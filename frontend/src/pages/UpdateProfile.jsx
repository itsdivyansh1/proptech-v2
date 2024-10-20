import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice"; // Make sure this path matches your Redux setup
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import UploadProfileImage from "@/components/UploadProfileImage";

const formSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters",
  }),
});

function UpdateProfile() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (currentUser && Object.keys(currentUser).length > 0) {
      form.reset({
        username: currentUser.username,
        password: "",
      });
      setAvatar(currentUser.avatar);
      setIsLoading(false);
    } else {
      navigate("/login");
    }
  }, [currentUser, form.reset]);

  const onSubmit = async (formData) => {
    try {
      const response = await axios.put(
        `http://localhost:3100/api/user/updateuser/${id}`,
        {
          username: formData.username,
          password: formData.password,
          avatar: avatar,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        // Update Redux store with the new user data
        const updatedUser = {
          ...currentUser,
          username: formData.username,
          avatar: avatar,
        };

        dispatch(setUser(updatedUser));

        // Update localStorage with new user data
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Show success message
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });

        // Optional: Fetch fresh user data from server to ensure consistency
        try {
          const refreshResponse = await axios.get(
            `http://localhost:3100/api/user/${id}`,
            { withCredentials: true }
          );
          if (refreshResponse.data) {
            dispatch(setUser(refreshResponse.data));
          }
        } catch (error) {
          console.error("Error refreshing user data:", error);
        }

        navigate(`/profile/${id}`);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update profile",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container max-w-[1300px] mx-auto p-2 mt-10 flex items-center justify-center">
      <Card className="max-w-[400px] w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Edit Profile</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Change the avatar
                </p>
                <div className="flex flex-col gap-2 items-center justify-center">
                  <div className="w-20 h-20 mb-0">
                    {avatar ? (
                      <Avatar>
                        <AvatarImage src={avatar} alt={currentUser.username} />
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
                  </div>

                  <UploadProfileImage
                    uwConfig={{
                      cloudName: "djqyemiwb",
                      uploadPreset: "postimages",
                      multiple: false,
                      folder: "postimages",
                    }}
                    setAvatar={setAvatar}
                    className="mx-auto mt-5"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-700/80"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

export default UpdateProfile;
