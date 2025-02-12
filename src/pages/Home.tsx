import { Link } from "react-router-dom";
import TaskTable from "../components/TaskTable";
import Navbar from "../shared/Navbar";



const Home = () => {
  return (
    <>
    <Link to={'/login'} >Login</Link>
    
      <Navbar /> 
      <TaskTable />
    </>
  );
};

export default Home;
