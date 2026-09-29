import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Clubs from "./pages/Clubs";
import Gallery from "./pages/Gallery";
import Certificates from "./pages/Certificates";
import Feedback from "./pages/Feedback";
import Volunteer from "./pages/Volunteer";
import Admin from "./pages/Admin";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/events"
          element={<Events />}
        />

        <Route
          path="/clubs"
          element={<Clubs />}
        />

        <Route
          path="/gallery"
          element={<Gallery />}
        />

        <Route
          path="/certificates"
          element={<Certificates />}
        />

        <Route
          path="/feedback"
          element={<Feedback />}
        />

        <Route
          path="/volunteer"
          element={<Volunteer />}
        />

        {/* ================= ADMIN ================= */}

        <Route
          path="/admin"
          element={<Admin />}
        />
      </Routes>

      <Footer />
    </>
  );
}

export default App;