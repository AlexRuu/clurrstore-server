"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/myButton";
import Link from "next/link";
import { login } from "@/actions/auth";
import { useState } from "react";
import LoginLoader from "./login-loader";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [isFail, setIsFail] = useState(false);
  const formSchema = z.object({
    email: z
      .string()
      .min(1, { message: "Please enter a valid email" })
      .email("Please enter a valid email"),
    password: z.string().min(8),
  });

  type LoginFormValues = z.infer<typeof formSchema>;
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginFormValues) => {
    setLoading(true);
    const loginResp = await login(data.email, data.password);
    if (loginResp == false) {
      setLoading(false);
      setIsFail(true);
      form.reset();
    }
    setLoading(false);
  };

  return (
    <>
      {loading && <LoginLoader />}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleLogin)}
          method="post"
          autoComplete="off"
          className="w-full justify-center items-center"
        >
          <div className="w-2/5 mx-auto flex flex-col">
            {isFail && (
              <p className="py-1 mb-2 text-sm text-center text-red-500 bg-red-200 rounded-[5px]">
                Incorrect email or password.
              </p>
            )}
            <div className="">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        required
                        type="text"
                        autoComplete="off"
                        autoCapitalize="none"
                        {...field}
                        value={field.value}
                      />
                    </FormControl>
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
                        required
                        type="password"
                        autoComplete="off"
                        autoCapitalize="none"
                        {...field}
                        value={field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div>
                <Link href="/account/recover" className="text-blue-500">
                  Forgot Password?
                </Link>
              </div>
            </div>
            <div className="text-center">
              <Button className="mr-2 text-black small:w-full small:text-center w-full my-5 small:px-0 border bg-[#e2ecf2] hover:shadow-home-button hover:-translate-y-[3px] hover:brightness-95 uppercase">
                Sign In
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default LoginForm;
