import { Facebook, Google } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ConfirmationResult,
  FacebookAuthProvider,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import loginImage from "../../assets/MHD_Login_img.jpg";
import { auth } from "../../firebase";

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  console.log('verificationId:', verificationId)
  const [loading, setLoading] = useState(false);
  console.log('setLoading:', setLoading)
  const [step, setStep] = useState(1);
  console.log('setStep:', setStep)
  const [user, setUser] = useState<ConfirmationResult | null>(null);
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
      console.error("Google Sign-In Error:", error);
    }
  };

  const sendOtp = async () => {
    const newPhoneNumber = phoneNumber.startsWith("+")
    ? phoneNumber
    : `+91${phoneNumber.trim()}`;

  if (!/^\+?[1-9]\d{1,14}$/.test(newPhoneNumber)) {
    alert("Invalid phone number format.");
    return;
  }

    try {
      const reCaptcha = new RecaptchaVerifier(
        auth,
        "recaptcha-container", // ID of the DOM element for reCAPTCHA
        {
          size: "invisible", // Or "normal" if you want to show it visibly
          callback: (response: string) => {
            console.log("reCAPTCHA verified:", response);
          },
        },
     
      );
      reCaptcha.render();
      console.log('reCaptcha:', reCaptcha)
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        newPhoneNumber,
        reCaptcha
      );
      console.log('confirmationResult:', confirmationResult)
      setVerificationId(confirmationResult.verificationId);
      alert("OTP sent!");
      setUser(confirmationResult);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    try {
      const userLoginSuccess = await user?.confirm(otp);
      console.log("userLoginSuccess:", userLoginSuccess);
    } catch (error) {
      console.log("error:", error);
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

          {/* ------------ SMS login-------- */}

          <Box
            sx={{
              width: 400,
              margin: "50px auto",
              padding: 3,
              boxShadow: 3,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              Phone Authentication
            </Typography>

            {step === 1 ? (
              <>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91-1234 567890"
                />

                {/* <PhoneInput
                  country={"auto"}
                  value={phoneNumber}
                  onChange={() => setPhoneNumber("+" + phoneNumber)}
                /> */}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={sendOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Send OTP"
                  )}
                </Button>
              </>
            ) : (
              <>
                <TextField
                  label="Enter OTP"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={verifyOtp}
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </>
            )}

            <div id="recaptcha-container"></div>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginPage;
