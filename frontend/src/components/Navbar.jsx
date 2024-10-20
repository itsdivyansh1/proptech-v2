import { HomeIcon, LogOut, Menu, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { clearUser } from "@/redux/userSlice";

function Navbar() {
  const [loading, setLoading] = useState(false); // Create a loading state
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state) => state.user.currentUser);

  const navigationLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const NavigationLinks = ({ className = "" }) => (
    <>
      {navigationLinks.map((link) => (
        <Link
          key={link.label}
          to={link.to}
          className={`${navigationMenuTriggerStyle()} + ${className}`}
          onClick={() => setIsOpen(false)}
        >
          {link.label}
        </Link>
      ))}
    </>
  );

  const handleLogout = () => {
    setLoading(true); // Set loading to true

    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setTimeout(() => {
      
      dispatch(clearUser());
      localStorage.removeItem("authToken"); 
      setLoading(false); 

     
      navigate("/login");
    }, 1000);

    toast({
      variant: "destructive",
      title: "Logged out",
      description: "You have successfully logged out.",
    });
  };

  return (
    <div className="border-b shadow-sm sticky top-0 z-50 bg-gray-100">
      <div className="container flex justify-between items-center max-w-[1300px] mx-auto px-2 py-2 md:py-0">
        <div className="flex items-center ">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="!w-6 !h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <SheetHeader>
                <SheetTitle>
                  <Link
                    to="/"
                    className="flex items-center space-x-2 mb-6"
                    onClick={() => setIsOpen(false)}
                  >
                    <HomeIcon className="h-6 w-6" />
                    <span className="font-semibold text-xl">Proptech</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-8">
                <NavigationLinks className="block" />
              </div>
            </SheetContent>
          </Sheet>
          {/* logo */}
          <Link
            to={"/"}
            className="hover:text-blue-600 transition-colors cursor-pointer gap-2 inline-flex items-center p-4"
          >
            <HomeIcon />
            <span className="font-semibold text-xl">Proptech</span>
          </Link>
        </div>
        <div className="space-x-4 md:block hidden">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationLinks.map((link) => (
                <NavigationMenuItem key={link.label}>
                  <Link to={link.to} className={navigationMenuTriggerStyle()}>
                    {link.label}
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  {user.avatar ? (
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.username} />
                      <AvatarFallback>
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Avatar>
                      <AvatarFallback>
                        {user.username.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.username}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <Link to={`/profile/${user._id}`}>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <Link onClick={handleLogout} disabled={loading}>
                  <DropdownMenuItem>
                    {loading ? "Logging out..." : "Log out"}
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to={"/login"}>
                <Button>Login</Button>
              </Link>
              <Link to={"/signup"}>
                <Button variant="secondary">Signup</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
