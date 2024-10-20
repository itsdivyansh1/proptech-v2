require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const authRoute = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const deleteUnverified = require("./utils/deleteUnverified");
const cors = require("cors");
const userRoute = require("./routes/userRoutes");
const postRoute = require("./routes/postRoutes");
const chatRoute = require("./routes/chatRoutes");
const messageRoute = require("./routes/messageRoutes");
const adminRoute=require("./routes/adminRoutes")

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

cron.schedule("*/10 * * * *", () => {
  deleteUnverified();
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.use("/api/admin",adminRoute)



app.get("/", (req, res) => {
  res.send("server running");
});

// real-time chatting

const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Handle user joining
  socket.on("addUser", (userId) => {
    console.log("User joined:", userId);
    onlineUsers.set(userId, socket.id);
    console.log("online users:", onlineUsers);
    io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
  });

  socket.on("sendMessage", async (data) => {
    console.log("Message received:", data);
    const { senderId, receiverId, text, chatId } = data;

    try {
      const receiverSocketId = onlineUsers.get(receiverId);
      console.log("Receiver socket ID:", receiverSocketId);

      if (receiverSocketId) {
        // Send to receiver
        io.to(receiverSocketId).emit("getMessage", {
          senderId,
          text,
          chatId,
          createdAt: new Date(),
        });

        // Send confirmation to sender
        socket.emit("messageSent", {
          success: true,
          message: "Message delivered",
        });
      }
    } catch (error) {
      console.error("Error handling message:", error);
      socket.emit("messageError", {
        success: false,
        error: error.message,
      });
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    let disconnectedUserId = null;
    onlineUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
      }
    });

    if (disconnectedUserId) {
      onlineUsers.delete(disconnectedUserId);
      io.emit("getOnlineUsers", Array.from(onlineUsers.keys()));
    }
  });
});

// Error handling
io.on("error", (error) => {
  console.error("Socket.IO error:", error);
});

server.listen(3100, () => {
  console.log("Server is running on port 3100");
});
