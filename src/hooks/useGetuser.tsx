import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTotalClocking } from "../redux/reducers/totalClocking";
import { setUser } from "../redux/reducers/user";

const useGetuser = () => {
  const dispatch = useDispatch();

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitState }) => state.userReducer
  );

  useEffect(() => {
  

  const db = getDatabase();
  const userRef = ref(db, `users/${user?.id}`);

  // Attach a real-time listener
  const unsubscribe = onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      // Store the user data in Redux store
      dispatch(setUser(snapshot.val()));
      console.log("Real-time data updated:", snapshot.val());
      const updateduser=snapshot.val()
      const total = Object.values(updateduser.tasks || {}).reduce(
        (sum: number, task) => {
          const updatedTask = task as TaskType;
          return sum + updatedTask?.clocking; // Ensure clocking exists
        },
        0
      );
      dispatch(updateTotalClocking(total))
    } else {
      console.log("No user data available");
    }
  }, (error) => {
    console.error("Error listening to real-time updates:", error);
  });

  // Cleanup listener on component unmount
  return () => unsubscribe();




  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return;
};

export default useGetuser;
