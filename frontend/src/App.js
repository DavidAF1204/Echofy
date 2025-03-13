import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Registration from "./Registration";
import Profile from "./Profile";
import Admin from "./Admin";
import EchoPage from "./EchoPage";

/**
 * Represents a App component.
 *
 * @page
 * @returns {React.ReactElement} A Router element.
 */

function App() {
  return (
    <div className="App">
      {/* 
          This is a multi-line comment in JSX. 
          It provides information about the App component. 
          The App contains pages includes home page, login page, registration page, admin page, profile page, echo page routes. 
      */}
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/registration" element={<Registration />} />
          <Route exact path="/admin" element={<Admin />} />
          <Route path="/profile/:name" element={<Profile />} />
          <Route path="/echo/:id" element={<EchoPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
