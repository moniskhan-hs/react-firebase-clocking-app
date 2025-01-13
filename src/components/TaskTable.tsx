import { Logout, Timer, TimerOff } from "@mui/icons-material";
import { Avatar, Box, Button, IconButton } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getAuth } from "firebase/auth";
import { child, get, getDatabase, push, ref, update } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  resetCounter,
  startCounter,
  stopCounter,
  updateCounter,
} from "../redux/reducers/counter";
import { updateTotalClocking } from "../redux/reducers/totalClocking";
import { setUser } from "../redux/reducers/user";
import { convertIntohoursAndMinuts, convertToSeconds } from "../utils/features";
import { uploadImageOnFirebase } from "../utils/upload/firebase-storage-upload";
import NewTask from "./NewTask";

const TaskTable = () => {
  const [isSharing, setIsSharing] = useState(false);

  const dispatch = useDispatch();

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitState }) => state.userReducer
  );

  const { activeRowId, isRunning, counter } = useSelector(
    (state: { counter: CounterInitState }) => state.counter
  );

  const { totalClocking: reducerTotalClockingValue } = useSelector(
    (state: { totalClocking: TotalClockingInitState }) => state.totalClocking
  );

  // -------------------------------------- Table Columns---------------------------------------
  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "ID", width: 200 },
    {
      field: "image",
      headerName: "Avatar",
      width: 150,
      renderCell: (params) => (
        <Avatar
          sx={{ bgcolor: "orange", color: "black", mt: 1 }}
          src={params.value}
          alt="userIcon"
        />
      ),
    },
    {
      field: "taskName",
      headerName: "Task",
      //   width: 150,
      flex: 1,
    },
    {
      field: "timer",
      headerName: "Timer",
      type: "number",
      width: 110,
      renderCell: (params) => (
        <Box>
          {isRunning && activeRowId === params.row.id ? (
            <Button
              variant="text"
              onClick={() => handleTimerStop(params.row.id)}
            >
              <TimerOff />
            </Button>
          ) : (
            <IconButton
              onClick={() =>
                handleTimerStart(
                  params.row.id,
                  convertToSeconds(params.row.clocking)
                )
              }
              disabled={isRunning}
            >
              <Timer />
            </IconButton>
          )}
        </Box>
      ),
    },
    {
      field: "clocking",
      headerName: "Clocking",
      width: 150,
      valueGetter: (_, row) =>
        row.id == activeRowId
          ? convertIntohoursAndMinuts(counter)
          : row.clocking,
    },
    {
      field: "screenshots",
      headerName: "Screenshots",
      width: 150,
      renderCell: (params) => (
        <Button
          sx={{
            cursor: isRunning ? "not-allowed" : "pointer",
            color: isRunning ? "blue" : "GrayText",
          }}
          disabled={isRunning}
        >
          <Link to={`task/${params.row.id}`}>
            <Logout />
          </Link>
        </Button>
      ),
    },
  ];

  // -------------------------------------- Table rows---------------------------------------

  const rows = Object.entries(user?.tasks || {}).map(([key, value]) => ({
    id: key,
    image: user?.photo,
    taskName: value.title,
    clocking: convertIntohoursAndMinuts(value.clocking),
  }));

  // --------------------------- HANDELS FOR TIMER [START + STOP ]-----------------------------

  //--------------------------- Handle to start the timer---------------------------
  const handleTimerStart = async (rowId: string, currentClocking: number) => {
    try {
      const auth = getAuth();
      const userId = auth?.currentUser?.uid;
      const userRef = ref(getDatabase(), `users/${userId}`);
      // need to check the user is do clocking from other tabs or not

      const snapshot = await get(child(ref(getDatabase()), `users/${userId}`));

      let isClockingFromOtherTabs = false;

      if (snapshot.exists()) {
        isClockingFromOtherTabs = snapshot.val().isActive;
      }

      console.log("isClockingFromOtherTabs:", isClockingFromOtherTabs);
      if (isClockingFromOtherTabs) {
        toast.error(
          "You are clocking from other tab, Make sure to stop it to countinue from here"
        );
        return;
      }

      // updated the user's isActive flag into the database

      dispatch(updateCounter(currentClocking));
      dispatch(startCounter(rowId));

      await update(userRef, { isActive: true });
      console.log("user is online now");

      startScreenShare(rowId);
    } catch (error) {
      console.log("error:", error);
    }
  };

  //--------------------------- Handle to stop the timer---------------------------

  const handleTimerStop = async (rowId: string) => {
    dispatch(stopCounter());
    console.log("counter " + counter);

    //---------------------------------------  update the task's cloking  value in firebase
    const db = getDatabase();
    const auth = getAuth();
    const userId = auth?.currentUser?.uid;
    const tasksRef = ref(db, `users/${userId}/tasks/${rowId}`);
    update(tasksRef, {
      clocking: counter,
    })
      .then(() => console.log(`clocking updated`))
      .catch((err) => console.log("err" + err));

    //----------------------------- fetching the updated user data from firebase to store in state---------------
    const userRef = ref(getDatabase());
    get(child(userRef, `users/${userId}`)).then((snapshot) => {
      if (snapshot.exists()) {
        const result = JSON.stringify(snapshot.val());

        // console.log('totalClocking'+result.t)

        console.log("user which comming from firebase :", result);

        dispatch(setUser(snapshot.val()));
        // Store the user data in redux store
        if (auth && userId) {
          const user = snapshot.val();
          updateOfTotalClocking(userId, user);
          console.log("snapshot.val():", user);
        }
      } else {
        console.log("no data available");
      }
    });
    // stop the screenshare
    stopScreenShare();
    //reset the counter
    dispatch(resetCounter());
  };

  // -------------------------------------- METHODS --------------------------------------

  //-------------------------------- method to auto update the total clocking
  const updateOfTotalClocking = (userId: string, updateduser: User) => {
    const total = Object.values(updateduser.tasks || {}).reduce(
      (sum: number, task) => {
        const updatedTask = task as TaskType;
        return sum + updatedTask?.clocking; // Ensure clocking exists
      },
      0
    );

    // update the totalclocking value in state
    dispatch(updateTotalClocking(total));
    const userRef = ref(getDatabase(), `users/${userId}`);
    update(userRef, { totalClocking: total, isActive: false })
      .then(() => {
        console.log("Total clocking updated successfully \n user is offline");
      })
      .catch((err) => console.log(err));
  };

  // ------------------------------------------------------- Screen Shot------------------------------------------------------

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const displayMediaOptions: DisplayMediaOptionsType = {
    video: true,
    audio: false,
  };

  const startScreenShare = async (rowId :string) => {
    try {
      console.log("screen sharing on .......");
      const stream = await navigator.mediaDevices.getDisplayMedia(
        displayMediaOptions
      );

      // need to seprately make the state of activerowId and reste it after that
      console.log('activeRowId in stream:', rowId)
      stream.getVideoTracks()[0].onended = () => {
        console.log('activeRowId: in stream', rowId)
        if(rowId){
          stopScreenShare()
        }
      
      };

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsSharing(true);
    } catch (err) {
      console.error("Error starting screen sharing:", err);
    }
  };





  const stopScreenShare = () => {
    console.log("screen sharing off .......");

    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsSharing(false);
  };

  const takeScreenshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL("image/png");
        // upload image on firebase
        uploadscreenshot(image);
      }
    }
  };

  const createUniqueName = () => {
    const timestamp = Date.now(); // Current time in milliseconds
    const randomString = Math.random().toString(36).substr(2, 9); // Random alphanumeric string
    return `file_${timestamp}_${randomString}`;
  };

  const uploadscreenshot = async (image: string) => {
    console.log("screenshot being uploading...........");
    try {
      const db = getDatabase();
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
      const uniqueFileName = createUniqueName();
      await uploadImageOnFirebase(
        image,
        userId!,
        uniqueFileName,
        auth.currentUser?.displayName as string
      ).then((downloadableURl) => {
        const screenshotRef = ref(
          db,
          `users/${userId}/tasks/${activeRowId}/screenshots`
        );

        push(screenshotRef, {
          url: downloadableURl,
        })
          .then(() => console.log("screen shot uploaded successfully"))
          .catch((err) => console.log("error uploading screenshot", +err));
      });
    } catch (error) {
      console.log("error:", error);
    }
  };

  useEffect(() => {
    if (isSharing) {
      intervalRef.current = setInterval(() => {
        takeScreenshot();
      }, 60000); // 1 minute
    } else {
      dispatch(stopCounter());
      dispatch(resetCounter());
      if (user) {
        // console.log('user:', user)
        console.log("user in sharing :", user);
        console.log("make the total clocking api");
        const db = getDatabase();
        //----------------- to update the user task clocking  and total clocking
        if (activeRowId && user.id) {
          console.log("bhai id hai", user.id);

          const updatedClocking =
            user.totalClocking && user.totalClocking + counter;
          console.log("counter:", counter);
          console.log("reducerTotalClockingValue:", reducerTotalClockingValue);
          console.log("updatedClocking:", updatedClocking);

          const userRef = ref(getDatabase());

          const tasksRef = ref(db, `users/${user.id}/tasks/${activeRowId}`);
          update(tasksRef, {
            clocking: counter,
          })
            .then(() => {
              get(child(userRef, `users/${user.id}`)).then((snapshot) => {
                if (snapshot.exists()) {
                  updateOfTotalClocking(user.id, snapshot.val());
                }
              });
              console.log(`task clocking value updated`);
            })
            .catch((err) => console.log("err" + err));

          console.log("kr diya clocking and total clocking ko update");
        } else {
          console.log("user id" + user.id);
          console.log("active row id" + activeRowId);
          console.log("bhai user id hi nahi hai==============");
        }

        // updateOfTotalClocking(user?.id,user)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSharing, dispatch]);

  return (
    <Box width={"100%"} padding={"1.5rem 5rem"}>
      <NewTask user={user} />
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10, 15]}
        />
      </Box>

      <video
        ref={videoRef}
        autoPlay
        style={{ display: "none", width: "10%", maxHeight: "300px" }}
      />
    </Box>
  );
};

export default TaskTable;
