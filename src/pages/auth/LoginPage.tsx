import { Box, Stack, Typography } from "@mui/material";
import loginImage from "../../assets/MHD_Login_img.jpg";
import firebaseLogo from "../../assets/firebase_logo.png";

const LoginPage = () => {



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
          direction={"row"}
          sx={{
            alignItems: "center",
            border: "1px solid #ff9100",
            padding: "0.75rem 2.3rem",
            borderRadius: "1.5rem",
            cursor: "pointer",
          }}
          // your handle for login which you have used in navbar component [ handleLoginWithFirebaseGoogle - 66]
        //   onClick={handleLoginWithGoogle}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: "1.2rem",
            }}
          >
            Login with
          </Typography>
          <img
            src={firebaseLogo}
            alt="firebaselog"
            style={{
              width: "1.7rem",
            }}
          />

          <Typography
            variant="body2"
            sx={{
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            Firebase
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginPage;
