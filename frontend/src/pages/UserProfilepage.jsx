import React, { useEffect, useState } from "react";
import PropertyList from "../components/PropertyList";
import { useSelector, useDispatch } from "react-redux";
import { clearUser, setUser } from "../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Delete,
  DeleteIcon,
  Edit,
  LogOut,
  PlusCircle,
  Trash,
} from "lucide-react";
import Chats from "@/components/Chats";
import { useToast } from "@/hooks/use-toast";

function UserProfilePage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState();
  const [error, setError] = useState(false);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [chats, setChats] = useState([]);
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);
  const getPosts = async () => {
    try {
      const response = await axios.get("/user/profileposts");
      setLoading(true);
      if (response) {
        setLoading(false);
        setPosts(response.data.userPosts.posts);
        setSavedPosts(response.data.userPosts.savedPosts);
        console.log("saved post le", savedPosts);
      }
    } catch (error) {
      console.log(error);
      setError(true);
      setLoading(false);
    }
  };

  const getChats = async () => {
    try {
      const response = await axios.get("/chat/getchats");
      if (response.data) {
        console.log("chats aaye hain:", response.data.chats);
        setChats(response.data.chats);
      }
    } catch (error) {
      console.log("error getting chats", error);
    }
  };

  useEffect(() => {
    getPosts();
    getChats();
  }, []);

  const handleLogout = () => {
    setLoading(true); // Set loading to true

    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setTimeout(() => {
      // Dispatch the removeUser action or clear local storage
      dispatch(clearUser()); // Make sure you have this action defined
      localStorage.removeItem("authToken"); // Remove the token if applicable
      setLoading(false); // Set loading to false after logout

      // Navigate to the login page
      navigate("/");
      toast({
        variant: "destructive",
        title: "Logged out",
        description: "You have successfully logged out.",
      });
    }, 1000);
  };

  return currentUser ? (
    <div className="container max-w-[1300px] mx-auto p-2 h-screen">
      <div className="grid md:grid-cols-4 h-[calc(100vh-2rem)] gap-2">
        {/* Left Column - Profile and Cards Section */}
        <div className="col-span-2 grid grid-rows-[200px,1fr] gap-2">
          {/* Profile Card with fixed height */}
          <Card className="flex flex-col">
            <CardHeader className="flex-none">
              <div className="flex items-center gap-4">
                {currentUser.avatar ? (
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={currentUser.avatar}
                      alt={currentUser.username}
                    />
                    <AvatarFallback>
                      {currentUser.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar>
                    <AvatarFallback>
                      {currentUser.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <CardTitle>{currentUser.username}</CardTitle>
                  <CardDescription>{currentUser.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              {/* Add any additional profile content here */}
            </CardContent>
            <CardFooter className="flex-none grid grid-cols-2 gap-2">
              <Button
                className="bg-green-600 hover:bg-green-600/80"
                onClick={() => navigate(`/updateprofile/${currentUser._id}`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-600/80"
                onClick={handleLogout}
                disabled={loading}
              >
                <LogOut />
                {loading ? "Logging out..." : "Log out"}
              </Button>
            </CardFooter>
          </Card>

          {/* Cards Section */}
          <div className="flex flex-col">
            {chats.length > 0 ? <Chats chats={chats} /> : <h3>No Messages</h3>}
          </div>
        </div>

        {/* Right Column - Posts */}
        <Card className="col-span-2 flex flex-col">
          <CardHeader className="flex-none">
            <div className="flex items-center justify-between">
              <CardTitle>My Posts</CardTitle>
              <Button variant="default" onClick={() => navigate("/addpost")}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Post
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1">
            <ScrollArea className="h-[calc(100vh-160px)]">
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="space-y-3">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <Card variant="secondary">
                  <CardContent className="flex items-center justify-center min-h-[100px]">
                    <CardDescription>
                      No posts yet. Create your first post!
                    </CardDescription>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <PropertyList posts={posts} />
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  ) : null;
}

export default UserProfilePage;
