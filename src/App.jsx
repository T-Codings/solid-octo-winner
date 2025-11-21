import Landing from "./routes/Landing";
import { Routes, Route, Navigate } from 'react-router-dom'
import Signup from "./routes/Signup"
import Login from "./routes/Login";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
