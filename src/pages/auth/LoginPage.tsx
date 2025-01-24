import { Facebook, Google } from "@mui/icons-material";
import { Box, Button, Stack } from "@mui/material";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";
import loginImage from "../../assets/MHD_Login_img.jpg";
import { auth } from "../../firebase";

const LoginPage = () => {
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();

  const handlSignWithFacebook = async () => {
    try {
      const { user } = await signInWithPopup(auth, facebookProvider);
      console.log("user:", user);
    } catch (error) {
      console.log("error:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      console.log("Google Sign-In Success:", user);
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: { md: "flex", xs: "block" },
      }}
    >
      {/* ----------------------left image-------------------------- */}
      <Box
        sx={{
          flex: 1,
        }}
      >
        <img
          src={loginImage}
          alt="mhd-login-img"
          style={{
            width: "100%",
            aspectRatio: "1/1",
            objectFit: "cover",
          }}
        />
      </Box>
      {/* ------------------------------------Login with firebase---------- */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mt: { xs: 5 },
        }}
      >
        <Stack
          spacing={2}
          direction="column"
          alignItems="center"
          sx={{ marginTop: 4 }}
        >
          {/* Google Sign-In Button */}
          <Button
            variant="outlined"
            startIcon={<Google />}
            sx={{
              backgroundColor: "white",
              color: "black",
              border: "1px solid lightgray",
              textTransform: "none",
              width: "250px",
              height: "50px",
            }}
            onClick={handleGoogleSignIn}
          >
            Sign in
          </Button>

          {/* Facebook Login Button */}
          <Button
            variant="contained"
            startIcon={<Facebook />}
            sx={{
              backgroundColor: "#1877F2",
              color: "white",
              textTransform: "none",
              width: "250px",
              height: "50px",
            }}
            onClick={handlSignWithFacebook}
          >
            Log in with Facebook
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginPage;
