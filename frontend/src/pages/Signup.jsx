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
import { HomeIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import heroimage from "@/assets/house-primary.svg";
import axios from "axios";

const formSchema = z.object({
  username: z.string().min(6, {
    message: "Must container min 6 characters",
  }),
  email: z.string().email({
    message: "Enter valid email address",
  }),
  password: z.string().min(6, {
    message: "Password should contain min 6 characters",
  }),
});

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3100/api/auth/register",
        values,
        { withCredentials: true }
      );

      if (response.data.userId) {
        navigate(`/verifyotp/${response.data.userId}`);
      } else if (response.data.error) {
        console.log(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        console.log("Server responded with error", error.response.data);
      } else if (error.request) {
        console.log("No response from server", error.request);
      } else {
        console.log("Error setting up request", error.message);
      }
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
        <Link
          to="/login"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Login
        </Link>
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
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Signup</CardTitle>
                  <CardDescription>Create your account</CardDescription>
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
                    {loading ? "Signing up..." : "Signup"}
                  </Button>
                  <span>
                    Already have an account?{" "}
                    <Link
                      to={"/login"}
                      className="text-blue-600 hover:underline"
                    >
                      Login
                    </Link>
                  </span>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Signup;
