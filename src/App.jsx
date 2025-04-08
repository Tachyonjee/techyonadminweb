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
import PublicRoute from "./Routes/PublicRoute";
import ProtectedRoute from "./Routes/ProtectedRoute";
import QuestionList from "./pages/QuestionSelection/questionList";
import Questions from "./pages/Questions";


const theme = createTheme({
  palette: {
    mode: "light",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen">
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signin" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signUp" element={<PublicRoute><SignUp /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/admin/question-setup" element={<ProtectedRoute><QuestionSetup /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute><QuestionSetup /></ProtectedRoute>} />
        <Route path="/teacher/dashboard" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/student/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="/admin/questions" element={<ProtectedRoute><QuestionList /></ProtectedRoute>} />
        <Route path="/questions" element={<ProtectedRoute><QuestionList /></ProtectedRoute>} />
      </Routes>
    </div>
  </ThemeProvider>
  );
}

export default App;
