import React, { useState, useEffect } from "react";
import axios from "@/api/axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  FileText,
  LayoutDashboard,
  Settings,
  Menu,
  Loader2,
  Search,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";

// API service with data normalization
const ApiService = {
  async getUsers() {
    try {
      const response = await axios.get("/user/getallusers");
      // Ensure we always return an array, handle different response structures
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.users) {
        return response.data.users;
      } else if (response.data.data) {
        return response.data.data;
      } else if (typeof response.data === "object") {
        // If it's an object but not an array, might be a single user
        return [response.data];
      }
      return [];
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  async getPosts() {
    try {
      const response = await axios.get("/post/getposts");
      // Similar data normalization for posts
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.posts) {
        return response.data.posts;
      } else if (response.data.data) {
        return response.data.data;
      } else if (typeof response.data === "object") {
        return [response.data];
      }

      return [];
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  },
  async deletePost(postId) {
    try {
      await axios.delete(`/post/deletepost/${postId}`);
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  },
  async deleteUser(userId) {
    try {
      await axios.delete(`/user/deleteuser/${userId}`);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },
};

// Dashboard Component
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState({ users: false, posts: false });
  const [error, setError] = useState({ users: null, posts: null });
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch Users with error handling and data normalization
  const fetchUsers = async () => {
    setLoading((prev) => ({ ...prev, users: true }));
    try {
      const data = await ApiService.getUsers();
      // Ensure each user has required properties
      const normalizedUsers = data.map((user) => ({
        id: user.id || user._id,
        name: user.name || user.username || "N/A",
        email: user.email || "N/A",
        ...user,
      }));
      setUsers(normalizedUsers);
      setError((prev) => ({ ...prev, users: null }));
    } catch (err) {
      console.error("Error in fetchUsers:", err);
      setError((prev) => ({
        ...prev,
        users: "Failed to fetch users. Please try again.",
      }));
      setUsers([]); // Reset to empty array on error
    } finally {
      setLoading((prev) => ({ ...prev, users: false }));
    }
  };

  // Fetch Posts with error handling and data normalization
  const fetchPosts = async () => {
    setLoading((prev) => ({ ...prev, posts: true }));
    try {
      const data = await ApiService.getPosts();
      // Ensure each post has required properties
      const normalizedPosts = data.map((post) => {
        console.log("Processing post:", post); // Debug individual posts
        return {
          _id: post._id || post.id,
          basicInfo: {
            title: post.basicInfo?.title || "Untitled",
            price: post.basicInfo?.price || 0,
            city: post.basicInfo?.city || "N/A",
            images: post.basicInfo?.images || [],
            ...post.basicInfo,
          },
          userId: post.userId || {}, // Ensure userId exists
          ...post,
        };
      });
      setPosts(normalizedPosts);
      setError((prev) => ({ ...prev, posts: null }));
    } catch (err) {
      console.error("Error in fetchPosts:", err);
      setError((prev) => ({
        ...prev,
        posts: "Failed to fetch posts. Please try again.",
      }));
      setPosts([]); // Reset to empty array on error
    } finally {
      setLoading((prev) => ({ ...prev, posts: false }));
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  // Safe filtering function
  const safeFilter = (array, searchTerm) => {
    if (!Array.isArray(array)) return [];
    return array.filter((item) => {
      if (!item) return false;
      return Object.values(item).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  // Filtered data using safe filter
  const filteredUsers = safeFilter(users, searchTerm);
  const filteredPosts = safeFilter(posts, searchTerm);

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  // Error Message Component
  const ErrorMessage = ({ message, onRetry }) => (
    <Alert className="bg-destructive/15 mb-4">
      <AlertDescription className="flex items-center justify-between text-destructive">
        <span>{message}</span>
        <button
          onClick={onRetry}
          className="px-3 py-1 rounded-md hover:bg-destructive/20 transition-colors"
        >
          Retry
        </button>
      </AlertDescription>
    </Alert>
  );

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      setLoading((prev) => ({ ...prev, posts: true }));
      try {
        await ApiService.deletePost(postId);
        setPosts(posts.filter((post) => post._id !== postId));
        alert("Post deleted successfully");
      } catch (err) {
        setError((prev) => ({
          ...prev,
          posts: "Failed to delete post. Please try again.",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, posts: false }));
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setLoading((prev) => ({ ...prev, users: true }));
      try {
        await ApiService.deleteUser(userId);
        setUsers(users.filter((user) => user.id !== userId));
        alert("User deleted successfully");
      } catch (err) {
        setError((prev) => ({
          ...prev,
          users: "Failed to delete user. Please try again.",
        }));
      } finally {
        setLoading((prev) => ({ ...prev, users: false }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
          fixed lg:sticky top-0 left-0 z-40
          h-screen w-64 bg-card border-r
          transform transition-transform duration-200
          lg:transform-none
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Admin Panel</h2>
            <nav className="space-y-2">
              {[
                { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
                { id: "users", icon: Users, label: "Users" },
                { id: "posts", icon: FileText, label: "Posts" },
                { id: "settings", icon: Settings, label: "Settings" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`
                    flex items-center w-full px-4 py-2 rounded-lg
                    transition-colors duration-200
                    ${
                      activeTab === item.id
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Top Bar */}
          <header className="sticky top-0 z-30 bg-background border-b">
            <div className="px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-secondary"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex-1 max-w-xl ml-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="p-6">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{users.length}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{posts.length}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Users</h2>
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add User
                  </button>
                </div>

                {error.users && (
                  <ErrorMessage message={error.users} onRetry={fetchUsers} />
                )}

                {loading.users ? (
                  <LoadingSpinner />
                ) : (
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left">ID</th>
                          <th className="px-4 py-3 text-left">Name</th>
                          <th className="px-4 py-3 text-left">Email</th>
                          <th className="px-4 py-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-t">
                            <td className="px-4 py-3">{user.id}</td>
                            <td className="px-4 py-3">{user.name}</td>
                            <td className="px-4 py-3">{user.email}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button
                                  className="p-2 hover:bg-secondary rounded-full"
                                  onClick={() => handleDeleteUser(user.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Similar structure for Posts tab */}
            {activeTab === "posts" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Posts</h2>
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Post
                  </button>
                </div>

                {error.posts && (
                  <ErrorMessage message={error.posts} onRetry={fetchPosts} />
                )}

                {loading.posts ? (
                  <LoadingSpinner />
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPosts.map((post) => (
                      <Card
                        key={post._id}
                        className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow "
                        // onClick={() => navigate(`/postdetail/${post._id}`)}
                      >
                        <div className="relative h-48">
                          <img
                            src={post?.basicInfo?.images[0]}
                            alt={post?.basicInfo?.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <CardHeader>
                          <h2 className="text-xl font-semibold">
                            {post?.basicInfo?.title}
                          </h2>
                          <p className="text-gray-600 flex items-center">
                            {/* <MapPin size={16} className="mr-1" /> */}
                            {post?.basicInfo?.city}
                          </p>
                        </CardHeader>

                        <CardContent>
                          <p className="text-xl text-blue-600 font-bold">
                            Rs {post?.basicInfo?.price}
                          </p>
                        </CardContent>

                        <CardContent>
                          {console.log(post?.postDetail?.username)}
                        </CardContent>
                        <CardFooter className="flex justify-end mt-4 gap-2">
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="p-2 hover:bg-secondary rounded-full"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
