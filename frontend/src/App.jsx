import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserProfilepage from "./pages/UserProfilepage";
import UpdateProfile from "./pages/UpdateProfile";
import Layout from "./components/Layout"; // Import the layout

import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import PublicRoute from "./components/PublicRoute";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/userSlice";
import { useEffect } from "react";
import ToastDemo from "./pages/test";
import { Toaster } from "./components/ui/toaster";
import PropertyListPage from "./pages/PropertyListPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import { propertyDetailLoader } from "./Loaders/propertydetailloader";
import ChatPage from "./pages/ChatPage";
import AddPost from "./pages/AddPost";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import OtpVerify from "./components/OtpVerify";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";

const router = createBrowserRouter([
  {
    element: <Layout />, // Apply layout for these routes
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },

      {
        path: "/profile/:id",
        element: <UserProfilepage />,
      },
      {
        path: "/updateprofile/:id",
        element: <UpdateProfile />,
      },
      {
        path: "/test",
        element: <ToastDemo />,
      },
      {
        path: "/list",
        element: <PropertyListPage />,
      },
      {
        path: "/postdetail/:id",
        element: <PropertyDetailPage />,
        loader: propertyDetailLoader,
      },
      {
        path: "/chat/:id",
        element: <ChatPage />,
      },
      {
        path: "/addpost",
        element: <AddPost />,
      },
    ],
  },
 
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },
  {
    path: "verifyotp/:id",
    element: (
      <PublicRoute>
        <OtpVerify />
      </PublicRoute>
    ),
  },

  {
    path: "/admin/:id",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user data exists in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
