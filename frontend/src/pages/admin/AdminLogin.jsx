import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import heroimage from "@/assets/house-primary.svg";
import { HomeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { Toaster } from "@/components/ui/toaster";

const formSchema = z.object({
  email: z.string().email({
    message: "Enter valid email address",
  }),
  password: z.string().min(3, {
    message: "Password should contain min 3 characters",
  }),
});

function AdminLogin() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);



  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:3100/api/admin/login",
        formData,
        {
          withCredentials: true, 
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.token) {
        localStorage.setItem("adminauthToken", response.data.token);
        localStorage.setItem("admin", JSON.stringify(response.data.admin));
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate(`/admin/${response.data.admin.id}`);
      } else {
        console.log("Invalid");
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error.response?.data?.message || "An error occurred during login",
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <>
      <div className="lg:hidden absolute top-6 left-6 ">
        <Link
          to={"/"}
          className="relative z-20 flex items-center text-lg font-medium"
        >
          <HomeIcon />
          Proptech
        </Link>
      </div>
      <div className="container relative h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* <Link
          to="/signup"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Signup
        </Link> */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <Link
            to={"/"}
            className="relative z-20 flex items-center gap-2 text-lg font-medium"
          >
            <HomeIcon />
            Proptech
          </Link>
          <img src={heroimage} alt="" width={500} className="z-20 m-auto" />
        </div>
        <div className="lg:p-8 p-0 w-full flex items-center justify-center">
          <Card className="w-full max-w-[400px] md:0 border-none shadow-none">
            <Form {...form}>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Admin Login</CardTitle>
                <CardDescription>
                  Enter your email & password below to login
                </CardDescription>
              </CardHeader>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <CardContent className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your Email address"
                            {...field}
                          />
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
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter your password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                  {/* <span>
                    Don't have an account?{" "}
                    <Link
                      to={"/signup"}
                      className="text-blue-600 hover:underline"
                    >
                      Signup
                    </Link>
                  </span> */}
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
