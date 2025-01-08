import { Button, Stack, TextField } from "@mui/material";
import { getAuth } from "firebase/auth";
import { child, get, getDatabase, push, ref } from "firebase/database";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { userTaskUpdated } from "../redux/reducers/user";
import AdminHome from "../pages/admin/Admin";
import { Link } from "react-router-dom";
type Props = {
  user: User | null;
};
const NewTask = ({ user }: Props) => {
  const [taskTitle, setTaskTitle] = useState<string>("");
  const dispatch = useDispatch();

  //----------------------------- Handle to add new task ------------------------------------
  // should be called when user create new task

  const UpdateTasks = () => {
    const db = getDatabase();
    const auth = getAuth();
    const userId = auth?.currentUser?.uid;
    console.log("userId:", userId);
    try {
      if (userId && user) {
        const tasksRef = ref(db, `users/${userId}/tasks`);
        
        push(tasksRef, {
          title: taskTitle,
          clocking: 0,
        })
          .then(() => {
            alert("Task added successfully");
          })
          .catch((err) => console.log(err)); 
         
          updateUserTasks(userId); // Calling [Handle to update the user tasks state ]
      } else {
        alert("Please login first.");
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  //---------------------------- Handle to update the user tasks state
  //---------------------------- getting task data

  const updateUserTasks = (userId:string) => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${userId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          dispatch(userTaskUpdated(snapshot.val().tasks));
          console.log("new task added");
          setTaskTitle('')
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Stack direction={"row"} mb={2}>
      <form
        style={{
          display: "flex",
          marginRight: "auto",
        }}
      >
        <Stack>
          <TextField
            fullWidth={true}
            size="small"
            placeholder="Task Title...."
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
        </Stack>
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
          }}
          onClick={() => UpdateTasks()}
          disabled={!taskTitle}
        >
          Create +
        </Button>
      </form>
<Link to={'/admin'}>
 <Button variant="contained" sx={{
   textTransform: "none",
  }} >
  Admin
 
 </Button>
   </Link>

    </Stack>
  );
};

export default NewTask;
