import { Facebook, Google, Microsoft } from "@mui/icons-material";
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
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  GoogleAuthProvider,
  isSignInWithEmailLink,
  RecaptchaVerifier,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPhoneNumber,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { OAuthProvider } from "firebase/auth/web-extension";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import loginImage from "../../assets/MHD_Login_img.jpg";
import { auth } from "../../firebase";

const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  console.log("verificationId:", verificationId);
  const [loading, setLoading] = useState(false);
  console.log('setLoading:', setLoading)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [singleEmail, setSingleEmail] = useState( window.localStorage.getItem("emailForSignIn") || "");

  const [result, setResult] = useState<ConfirmationResult | null>(null);
  const [user, setUser] = useState<UserCredential | undefined>();
  const [reCaptcha, setReCaptcha] = useState<RecaptchaVerifier>();

  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const microsoftProvider = new OAuthProvider("microsoft.com");

  useEffect(() => {
    const reCaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "normal",
      callback: (response: string) => {
        console.log("reCAPTCHA verified:", response);
      },
    });
    setReCaptcha(reCaptcha);
  }, []);

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
      if (reCaptcha) reCaptcha.render();
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        newPhoneNumber,
        reCaptcha
      );
      console.log("confirmationResult:", confirmationResult);
      setVerificationId(confirmationResult.verificationId);
      alert("OTP sent!");
      setResult(confirmationResult); // user is set
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
      if (reCaptcha) reCaptcha.clear();
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (otp == "") return toast.error("Please Enter the OTP");

    try {
      const userLoginSuccess = await result?.confirm(otp);
      console.log("userLoginSuccess:", userLoginSuccess);
      toast.success("user login successfully");
      setUser(userLoginSuccess);
      reCaptcha?.clear();
    } catch (error) {
      console.log("error:", error);
      toast.error("Invalid OTP");
      reCaptcha?.clear();
    }
  };

  const loginWithMicrosoft = async () => {
    try {
      // microsoftProvider.setCustomParameters({
      //   tenant: "23d45b26-0876-4494-bfb8-369aecda8e1a",
      // });

      const result = await signInWithPopup(auth, microsoftProvider);
      console.log("Microsoft Login Success:", result.user);
      toast.success(`Welcome, ${result.user.displayName}!`);
    } catch (error:unknown) {
      console.error("Error during Microsoft login:", error);
      // toast.error(`Login Failed: ${error.message}`);
    }
  };

  const loginwithEmailAndPassword = () => {
    if (!email || !password)
      return toast.error("Please Enter email or password");
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log("user:", user);
        toast.success("Login Success");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        console.log('errorCode:', errorCode)
        const errorMessage = error.message;
        console.log('errorMessage:', errorMessage)
        console.log("error:", error);
      });
  };


  useEffect(() => {
    // Get the saved email
    const saved_email = window.localStorage.getItem("emailForSignIn");

    // Verify the user went through an email link and the saved email is not null
    if (isSignInWithEmailLink(auth, window.location.href) && !!saved_email) {
      // Sign the user in
    signInWithEmailLink( auth, saved_email, window.location.href);
    }
  }, []);

  const handleSendLoginLink = async () => {
    try {
      const actionCodeSettings = {
        url: "https://react-firebase-clocking-app.vercel.app", 
        handleCodeInApp: true,
      };
  
      await sendSignInLinkToEmail(auth, singleEmail, actionCodeSettings);
      toast.success("Login link sent to your email!");
      window.localStorage.setItem("emailForSignIn", singleEmail);
    } catch (error) {
      console.error("Error sending login link:", error);
      toast.error("Failed to send login link. Please try again.");
    }
  };
  
  const handleLoginWithLink = async () => {
    try {
      // Check if the current URL is a valid email login link
      if (isSignInWithEmailLink(auth, window.location.href)) {
        // Retrieve the email from localStorage
        const email = window.localStorage.getItem("emailForSignIn");
  
        if (!email) {
          toast.error("Please provide your email to complete the login.");
          return;
        }
  
        // Complete the login process
        const result = await signInWithEmailLink(auth, email, window.location.href);
        console.log("Logged in user:", result.user);
        toast.success("Login successful!");
  
        // Clear the email from localStorage
        window.localStorage.removeItem("emailForSignIn");
  
        // Redirect the user to the desired page
        window.location.href = "/dashboard"; // Replace with your desired route
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Failed to log in. Please try again.");
  
      // Handle specific errors
      // if (error.code === "auth/invalid-action-code") {
      //   toast.error("The login link is invalid or expired. Please request a new link.");
      // }
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
          {/* -------------------login with Email and Password----------------- */}
          <Stack gap={2}>
            <TextField
              placeholder="Enter your email"
              required
              type="email"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              placeholder="Enter your password"
              required
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="contained" onClick={loginwithEmailAndPassword}>
              Login
            </Button>
          </Stack>

          <Stack gap={2}>
            <TextField
              placeholder="Enter your email"
              required
              type="email"
              size="small"
              value={singleEmail}
              onChange={(e) => setSingleEmail(e.target.value)}
            />

            <Button variant="contained" onClick={handleSendLoginLink}>
              Send Login Link
            </Button>
            <Button variant="contained" onClick={handleLoginWithLink}>
              Login
            </Button>
          </Stack>

          <Typography>OR</Typography>

          {/* ------------ SMS login- Button------- */}

          <Box
            sx={{
              // width: 400,
              width: "250px",
              margin: "50px auto",
              // padding: 3,
              // boxShadow: 3,
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            {user ? (
              <Typography>User login Successfully</Typography>
            ) : !result ? (
              // send OTP to user
              <>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  sx={{ mb: 2 }}
                  size="small"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91-1234 567890"
                />

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

          <Typography>OR</Typography>

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

          {/* ---------------- Microsoft login Button------------------- */}

          <Button
            onClick={loginWithMicrosoft}
            variant="outlined"
            startIcon={<Microsoft />} // Custom Microsoft Logo
            sx={{
              textTransform: "none",
              borderRadius: "4px",
              color: "black",
              borderColor: "#A6A6A6",
              padding: "6px 12px",
              fontSize: "14px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "white",
              "&:hover": {
                backgroundColor: "#f3f3f3",
                borderColor: "#999",
              },
            }}
          >
            Sign in with Microsoft
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default LoginPage;
