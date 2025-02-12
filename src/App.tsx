import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NotLogin from "./components/NotLogin";
import { auth } from "./firebase";
import useGetuser from "./hooks/useGetuser";
import { useHandleBeforeUnload } from "./hooks/usehandleBeforeHook";
import AdminHome from "./pages/admin/Admin";
import LoginPage from "./pages/auth/LoginPage";
import Home from "./pages/Home";
import SingleTaskPage from "./pages/SingleTaskPage";

const App = () => {
  useHandleBeforeUnload();
  useGetuser()
  const [users, setUsers] = useState();
  
  useEffect(() => {
    // user = firebase retured user
    onAuthStateChanged(auth, async (user) => {
      console.log("user:", user);
    });
  }, []);

  useEffect(() => {
    const db = getDatabase();
    const dbRef = ref(db, "users");

    // Real-time listener
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("all users:", data);
        setUsers(data);
      } else {
        console.log("No users available");
      }
    });

    // Cleanup listener
    return () => unsubscribe();
  }, []);

  const userDetails = {
    name:'monis khan',
    email :'something@gmail.com'
  }


  return (
    <Router>
      <Routes>
         <Route path="/" element={ userDetails.name && userDetails.email ? <Home />:<NotLogin />} />
        <Route path="/admin" element={<AdminHome users={users} />} />
        <Route path="/task/:id" element={<SingleTaskPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
};

export default App;
