import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar.jsx";

import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import "./App.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/authContext";
import { io } from "socket.io-client";

function App() {
  const { currentUser } = useContext(AuthContext);
///////
const [socket,setSocket]= useState(null)
useEffect(() => {
  const socket = io("http://localhost:5000", { transports: ["websocket"] });
  setSocket(socket);
}, []);
//////


  const Layout = () => {
    return (
        <div >
          <Navbar socket={socket} />
          <div >
            <div >
              <Outlet socket={socket}  />
            </div>
           
          </div>
        </div>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/",
          element: <Home socket={socket} />,
        },
        {
          path: "/profile/:id",
          element: <Profile socket={socket}  />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login socket={socket}  />,
    },
    {
      path: "/register",
      element: <Register socket={socket}  />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;