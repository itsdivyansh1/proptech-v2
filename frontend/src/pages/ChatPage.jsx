import React, { useEffect, useState, useRef } from "react";
import { Send, Menu, User } from "lucide-react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "../api/axios";
import * as timeago from "timeago.js";
import { io } from "socket.io-client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const ChatPage = () => {
  const [newMessage, setNewMessage] = useState("");
  const [chat, setChat] = useState();
  const [otheruser, setOtheruser] = useState();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const { id } = useParams();
  const currentUser = useSelector((state) => state.user.currentUser);
  const socketRef = useRef();
  const scrollRef = useRef(null);

  
  useEffect(() => {
    const newSocket = io("http://localhost:3100", {
      transports: ["websocket"],
      reconnection: true,
    });

    newSocket.on("connect", () => {
      setConnected(true);
    });

    newSocket.on("connect_error", (error) => {
      setConnected(false);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);


  useEffect(() => {
    if (!socket || !currentUser?._id) return;

    socket.emit("addUser", currentUser._id);

    socket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("getMessage", (message) => {
      if (message.chatId === id) {
        setChat((prev) => ({
          ...prev,
          messages: [...(prev?.messages || []), message],
        }));
      }
    });

    return () => {
      socket.off("getOnlineUsers");
      socket.off("getMessage");
      socket.off("messageSent");
      socket.off("messageError");
    };
  }, [socket, currentUser, id]);

 
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage || !socket || !connected) return;

    try {
      socket.emit("sendMessage", {
        senderId: currentUser._id,
        receiverId: otheruser._id,
        text: newMessage,
        chatId: id,
      });

      const res = await axios.post(`/message/${id}`, { text: newMessage });

      if (res.data.message) {
        setChat((prev) => ({
          ...prev,
          messages: [
            ...(prev?.messages || []),
            {
              sender: currentUser._id,
              text: newMessage,
              createdAt: new Date(),
            },
          ],
        }));
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const getChat = async () => {
    try {
      const response = await axios.get(`/chat/getchat/${id}`);
      if (response.data.chat) {
        setChat(response.data.chat);
        const other = response.data.chat?.users?.find(
          (user) => user._id !== currentUser._id
        );
        setOtheruser(other);
      }
    } catch (error) {
      console.error("Error getting chat:", error);
    }
  };

  useEffect(() => {
    getChat();
  }, [id]);

  return (
    <div className="flex min-h-screen bg-background p-4 bg-red-400">
      <Card className="w-full max-w-4xl mx-auto h-full ">
        <CardHeader className="p-4 border-b">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={otheruser?.avatar} />
              <AvatarFallback>
                {otheruser?.username?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-lg font-semibold">
                {otheruser?.username}
              </span>
              <Badge
                variant={
                  onlineUsers.includes(otheruser?._id) ? "success" : "secondary"
                }
              >
                {onlineUsers.includes(otheruser?._id) ? "Online" : "Offline"}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[350px] p-4">
            {chat?.messages?.length > 0 ? (
              chat.messages.map((message, index) => (
                <div
                  key={message._id || index}
                  className={`flex ${
                    message.sender === currentUser._id
                      ? "justify-end"
                      : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`max-w-md rounded-lg p-3 ${
                      message.sender === currentUser._id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {timeago.format(message.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No messages yet</p>
              </div>
            )}
            <div ref={scrollRef} />
          </ScrollArea>

          <form
            onSubmit={handleSendMessage}
            className="border-t p-4 flex gap-4 mb-0"
          >
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={!connected}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatPage;
