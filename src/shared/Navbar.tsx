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
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../firebase";
import { increament } from "../redux/reducers/counter";
import { setUser, userExist, userNotExist } from "../redux/reducers/user";

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

  const handleLoginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      console.log("user:", user);
      if (user) {
        // need to check if user data is stored in database already or not
        // -------------------- get user information from data bse -----------------------

        const dbRef = ref(getDatabase());
        get(child(dbRef, `users/${user?.uid}`))
          .then((snapshot) => {
            if (snapshot.exists()) {
              dispatch(setUser(snapshot.val())); // Store the user data in redux store
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

  //  ----------------------- Handle for logout-------------------

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // toast.success("sign out successfully")
      dispatch(userNotExist());
      setIsDailogOpen(false);
    } catch (error) {
      console.log("error:", error);
      // toast.error("sign out failed")
    }
  };
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
      name,
      email,
      photo,
      totalClocking: 0,
      isActive: false,
    })
      .then(() => alert("data save successfully"))
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
                  {totalClocking}
                </Button>
              </Stack>

              {/* ---------------------  Timer's value ---------------------- */}

              <span> {counter} </span>

              {/* ---------------------  user avatar ---------------------- */}
              {user ? (
                <>
                  <Avatar
                    sx={{ bgcolor: "white", color: "black", cursor: "pointer" }}
                    src={user?.photo}
                    onClick={() => setIsDailogOpen(pre=>!pre)}
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
              ) : (
                <Typography
                  sx={{ color: "white", cursor: "pointer" }}
                  onClick={handleLoginWithGoogle}
                >
                  Login
                </Typography>
              )}
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>
    </nav>
  );
};

export default Navbar;
