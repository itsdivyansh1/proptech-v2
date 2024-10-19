import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Toaster } from "./ui/toaster";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Toaster />
    </>
  );
};

export default Layout;
