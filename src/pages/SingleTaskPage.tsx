import { useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const SingleTaskPage = () => {
  const [screenshotsList, setScreenshotsList] = useState();

  const { id: rowId } = useParams();

  useEffect(() => {
    const db = getDatabase();
    const auth = getAuth();
    const userId = auth.currentUser?.uid;
    console.log("userId:", userId);
    console.log("rowId:", rowId);
    const dbRef = ref(db, `users/${userId}/tasks/${rowId}`);

    // Real-time listener
    const unsubscribe = onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log("data:", data);
        setScreenshotsList(data.screenshots);
      } else {
        console.log("No users available");
      }
    });

    // Cleanup listener
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <div
        style={{
          overflowY: "auto",
        }}
      >
        <h2>Captured Screenshots:</h2>
        {Object.entries(screenshotsList || {}).map(([key,value]) => (
          <img
            key={key}
            src={value.url}
            alt={`Screenshot ${key}`}
            style={{ margin: "10px", width: "300px" }}
          />
        ))}
      </div>
    </div>
  );
};

export default SingleTaskPage;
