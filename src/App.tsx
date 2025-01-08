import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Testing from "./components/Testing";
import { auth } from "./firebase";
import AdminHome from "./pages/admin/Admin";
import Home from "./pages/Home";
import SingleTaskPage from "./pages/SingleTaskPage";

const App = () => {
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

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminHome users={users} />} />
        <Route path="/task/:id" element={<SingleTaskPage />} />
      </Routes>
    </Router>
  );
};

export default App;
