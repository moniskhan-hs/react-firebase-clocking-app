import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { auth } from "./firebase";
import AdminHome from "./pages/admin/Admin";
import Home from "./pages/Home";
import SingleTaskPage from "./pages/SingleTaskPage";
import { getDatabase, onValue, ref } from "firebase/database";

const App = () => {
  const [users, setUsers] = useState();
  useEffect(() => {
    // user = firebase retured user
    onAuthStateChanged(auth, async (user) => {
    
    });
  }, []);



  useEffect(() => {
    const db = getDatabase();
    const dbRef = ref(db, "users");

    // Real-time listener
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUsers(data);
      } else {
        console.log("No users available");
      }
    });

    // Cleanup listener
    return () => unsubscribe();
  }, []);



  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminHome users = {users}/>} />
        <Route path="/task/:id" element={<SingleTaskPage  />} />
      </Routes>
    </Router>
  );
};

export default App;
