/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logout } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { child, get, getDatabase, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../firebase";
import {
  increament,
  resetCounter,
  stopCounter,
} from "../redux/reducers/counter";
import {
  resetTotalClocking,
  updateTotalClocking,
} from "../redux/reducers/totalClocking";
import { setUser, userExist, userNotExist } from "../redux/reducers/user";
import { convertIntohoursAndMinuts } from "../utils/features";

// type Props = {
//   userDetails :{
//     name:string;
//     email:string;
//   }
// }

const Navbar = () => {
  const [isDailogOpen, setIsDailogOpen] = useState(false);
  const { totalClocking } = useSelector(
    (state: { totalClocking: TotalClockingInitState }) => state.totalClocking
  );
  const { counter, isRunning } = useSelector(
    (state: { counter: CounterInitState }) => state.counter
  );

  const { user } = useSelector(
    (state: { userReducer: UserReducerInitState }) => state.userReducer
  );
  console.log('user:', user)
  const dispatch = useDispatch();

  // --------------------------------- Timer -----------------------------------------

  useEffect(() => {
    let intervalId;

    if (isRunning) {
      intervalId = setInterval(() => {
        dispatch(increament());
      }, 1000);
    } else {
      return;
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [dispatch, isRunning]);

  //  ----------------------- Handle for login-------------------

  const handleLoginWithFirebaseGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider(); 
      const { user } = await signInWithPopup(auth, provider);
      console.log("user:", user);
      if (user) {
        // need to check if user data is stored in database already or not
        // -------------------- get user information from data bse -----------------------
        toast.success("Login Success");

        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${user?.uid}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              // Store the user data in redux store
              dispatch(setUser(snapshot.val()));
              // update the total clocking state

              dispatch(updateTotalClocking(snapshot.val().totalClocking));
            } else {
              console.log("No data available");
              const newUser = {
                id: user?.uid,
                name: user.displayName!,
                email: user.email!,
                photo: user.photoURL!,
                totalClocking: 0,
                isActive: false,
              };
              dispatch(userExist(newUser)); // Store the user data in redux store

              StoreUserinFirebase(
                // Calling [handle to store the data in firebase]
                user.uid,
                user?.displayName || "",
                user?.email || "",
                user?.photoURL || ""
              );
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } catch (error) {
      console.log("error in google login:", error);
      // toast.error("Sign in Fail");
    }
  };
  console.log('handleLoginWithFirebaseGoogle:', handleLoginWithFirebaseGoogle)

  //  ----------------------- Handle for logout-------------------

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // toast.success("sign out successfully")
      dispatch(userNotExist());
      dispatch(stopCounter());
      dispatch(resetCounter());
      dispatch(resetTotalClocking());

      setIsDailogOpen(false);
      toast.error("user logout");
    } catch (error) {
      console.log("error:", error);
      // toast.error("sign out failed")
    }
  };
  console.log('handleLogout:', handleLogout)

  //------------------------------- Handle to store the data in firebase---------------------------------

  //  Should be called when new user is login - to make instance

  const StoreUserinFirebase = (
    userId: string,
    name: string,
    email: string,
    photo: string
  ) => {
    const db = getDatabase();
    set(ref(db, "users/" + userId), {
      id: userId,
      name,
      email,
      photo,
      totalClocking: 0,
      isActive: false,
    })
      .then(() => console.log("data save successfully"))
      .catch((err) => console.log(err));
  };

  return (
    <nav>
      <AppBar position="static">
        <Toolbar>
          <Container
            maxWidth={"xl"}
            sx={{
              display: "flex",
            }}
          >
            {/* ----------------------------------  Logo heading or image ---------------------------------------------- */}

            <Typography
              fontWeight={"bold"}
              fontSize={"1.5rem"}
              sx={{
                marginRight: "auto",
              }}
            >
              HandySolver
            </Typography>

            {/* ----------------------------------  totol clocing + clocking + stop button + user icon ---------------------- */}
            <Stack
              direction={"row"}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "2rem",
              }}
            >
              {/* --------------------- total clocking ---------------------- */}

              <Stack direction={"row"} alignItems={"center"} gap={1}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "orange",
                    borderRadius: "100px",
                    fontWeight: "bold",
                    display: "flex",
                    gap: "1rem",
                    textTransform: "none",
                    color: "black",
                  }}
                >
                  <span>Total Clocking</span>
                  {/* {totalClocking} */}
                  {convertIntohoursAndMinuts(totalClocking)}
                </Button>
              </Stack>

              {/* ---------------------  Timer's value ---------------------- */}

              <span> {convertIntohoursAndMinuts(counter)} </span>

              {/* ---------------------  user avatar ---------------------- */}
              {/* {user ? 
              
              // -------------------- if user is there [Show Avatar ]
              (
                <>
                  <Avatar
                    sx={{ bgcolor: "white", color: "black", cursor: "pointer" }}
                    src={user?.photo}
                    onClick={() => setIsDailogOpen((pre) => !pre)}
                  />
                  <dialog
                    open={isDailogOpen}
                    style={{
                      position: "absolute",
                      top: "80%",
                      zIndex: 1,
                      left: "calc(100% - 50px)",
                    }}
                  >
                    <IconButton onClick={handleLogout}>
                      <Logout />
                    </IconButton>
                  </dialog>
                </>
              ) 
              // ----------------------Show login button
              :
               (
                <Typography
                  sx={{ color: "white", cursor: "pointer" }}
                  onClick={handleLoginWithFirebaseGoogle}
                >
                  Login
                </Typography>
              )} */}


<>
                  <Avatar
                    sx={{ bgcolor: "white", color: "black", cursor: "pointer" }}
                    src={''}
                  />
                  <dialog
                    open={isDailogOpen}
                    style={{
                      position: "absolute",
                      top: "80%",
                      zIndex: 1,
                      left: "calc(100% - 50px)",
                    }}
                  >
                    <IconButton>
                      <Logout />
                    </IconButton>
                  </dialog>
                </>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>
    </nav>
  );
};

export default Navbar;
