import { Container, Typography } from "@mui/material";

const NotLogin = () => {
  return (
    <Container
      maxWidth={"md"}
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h1" fontSize={"2rem"}>
        Your are not logged in
      </Typography>
    </Container>
  );
};

export default NotLogin;
