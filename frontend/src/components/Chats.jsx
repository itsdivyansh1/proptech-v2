import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

const Chats = ({ chats }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Messages</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-full">
          <div className="space-y-2">
            {chats.map((message) => (
              <Button
                key={message._id}
                variant="ghost"
                className="w-full p-0 h-auto hover:bg-accent"
                onClick={() => navigate(`/chat/${message._id}`)}
              >
                <Card
                  className={`w-full ${
                    message.seenBy.includes(currentUser._id)
                      ? ""
                      : "bg-yellow-50"
                  }`}
                >
                  <CardContent className="p-4 flex items-center gap-3">
                    {message.receiver.avatar ? (
                      <Avatar>
                        <AvatarImage
                          src={message.receiver.avatar}
                          alt={message.receiver.username}
                        />
                        <AvatarFallback>
                          {message.receiver.username
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar>
                        <AvatarFallback>
                          {message.receiver.username
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="text-left">
                      <p className="font-medium">{message.sender}</p>
                      <p className="text-muted-foreground text-sm">
                        {message.lastMessage}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Chats;
