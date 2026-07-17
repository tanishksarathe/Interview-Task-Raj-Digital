import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import StudentDashboard from "./components/Dashboards/StudentDashboard";
import FacultyDashboard from "./components/Dashboards/FacultyDashboard";

function App() {
  return (
    <>
    <BrowserRouter>
      <Toaster/>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/faculty-dashboard" element={<FacultyDashboard/>} />
        <Route path="/student-dashboard" element={<StudentDashboard/>} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
