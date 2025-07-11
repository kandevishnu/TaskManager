import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import ManageTasks from "./pages/ManageTasks";
import CreateTask from "./pages/CreateTask";
import Layout from "./pages/Layout";
import "react-toastify/dist/ReactToastify.css";
import "./App.css"; // Ensure this is imported for global styles

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/verify" element={<VerifyOTP />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<ManageTasks />} />
          <Route path="tasks/create" element={<CreateTask />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}

export default App;
