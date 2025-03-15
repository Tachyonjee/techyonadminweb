import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Login from "./pages/auth/Login";
import QuestionSetup from "./pages/QuestionSetup";
import "./index.css";
import Header from "./components/header";
import SignUp from "./pages/auth/signup";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="bg-gradient-to-r from-blue-500 to-purple-600">
      <Header></Header>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/admin/question-setup" element={<QuestionSetup />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Routes>
        </div>
    </ThemeProvider>
  );
}

export default App;
