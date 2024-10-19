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
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import heroimage from "@/assets/house-primary.svg";
import { HomeIcon } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

const formSchema = z.object({
  otp: z.string().length(4, {
    message: "OTP must be 4 characters",
  }),
});

function OtpVerify() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (values) => {
    if (!values.otp) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Enter your OTP",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:3100/api/auth/verifyotp/${id}`,
        { otp: values.otp }
      );

      if (response.data.verified) {
        toast({
          title: "Success",
          description: response.data.message,
        });
        navigate("/login");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.data.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to verify OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="lg:hidden absolute top-6 left-6">
        <Link
          to="/"
          className="relative z-20 flex items-center text-lg font-medium"
        >
          <HomeIcon />
          Proptech
        </Link>
      </div>
      <div className="container relative h-screen flex flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          to="/signup"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Signup
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <Link
            to="/"
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
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                  Enter your OTP code below to login
                </CardDescription>
              </CardHeader>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <CardContent>
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <InputOTP
                            maxLength={4}
                            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                            value={field.value}
                            onChange={field.onChange}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>

                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Verifying..." : "Verify OTP"}
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>
    </>
  );
}

export default OtpVerify;
