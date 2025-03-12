import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import Login from "./pages/Login";
import QuestionSetup from "./pages/QuestionSetup";
import "./index.css";
import Header from "./components/header";
import SignUp from "./pages/auth/signup";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header></Header>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/question-setup" element={<QuestionSetup />} />
        </Routes>
        </div>
    </ThemeProvider>
  );
}

export default App;
