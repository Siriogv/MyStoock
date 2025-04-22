"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authenticateUser } from "@/services/auth"; // Import authentication service

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = await authenticateUser(email, password);

    if (user) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", user.role); // Store user role
      toast({
        title: "Login successful",
        description: "Redirecting to dashboard...",
      });
      router.push("/");
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid username or password.",
      });
    }
  };

  return (
    <div className="grid h-screen place-items-center">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                type="email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                type="password"
              />
            </div>
            <Button className="mt-4 w-full" type="submit">
              Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
