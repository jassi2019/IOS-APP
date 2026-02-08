"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import Image from "next/image";
import { useRouter } from "next/navigation";
import useToast from "@/hooks/useToast";
import Loader from "@/components/custom/loader";
import { login } from "@/services/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (email) => {
  return emailRegex.test(email);
};

const isValidPassword = (password) => {
  return password.length >= 8;
};

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const { showError, showSuccess } = useToast();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!isValidEmail(email)) {
      showError("Please enter a valid email");
      return;
    }

    if (!isValidPassword(password)) {
      showError("Password must be at least 8 characters");
      return;
    }

    try {
      setIsLoading(true);
      const {
        data: { token },
      } = await login(email, password);
      showSuccess("Login successful");

      localStorage.setItem("token", token);
      router.push("/");
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[380px] shadow-lg">
        <CardHeader className="space-y-1 flex flex-col items-center">
          {/* <div className="w-48 h-24 relative mb-4"> */}
          {/* <Image
              src="/logo.png"
              alt="Taiyari NEET ki"
              fill
              priority
              className="object-contain"
            /> */}
          <h2 className="text-2xl font-bold">Taiyari NEET ki</h2>
          {/* </div> */}
          <CardTitle className="text-2xl text-center font-bold">
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                name="email"
                placeholder="Email"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                name="password"
                placeholder="Password"
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
