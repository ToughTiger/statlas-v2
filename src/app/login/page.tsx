
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { login, isAuthenticated, getSelectedStudy } from '@/lib/authenticate';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // This check runs client-side after hydration to avoid server-side rendering issues with localStorage
    if (isAuthenticated()) {
      if (getSelectedStudy()) {
        router.replace('/dashboard');
      } else {
        router.replace('/study-selector');
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      if (user) {
        toast({ title: "Login Successful", description: `Welcome back, ${user.name}` });
        router.push('/study-selector');
      } else {
        // This case should ideally not be hit if login throws an error
        setError("Invalid username or password.");
      }
    } catch (error: any) {
      setError(error.message || "Invalid username or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="hidden bg-muted lg:flex lg:flex-col items-center justify-center p-8 text-center">
        <Image
            src="/logo.png"
            alt="eRIC Solutions Logo"
            width="200"
            height="100"
            className="mb-6"
            data-ai-hint="logo"
        />
        <div className="max-w-md">
            <h1 className="text-3xl font-bold text-primary">eRIC Solutions</h1>
            <p className="text-muted-foreground mt-4">
                Pioneering the future of clinical trial analytics. Our platform provides powerful insights to accelerate research and development.
            </p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
           <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                    Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                          id="email"
                          type="email"
                          placeholder="m@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          disabled={isLoading}
                          />
                      </div>
                      <div className="grid gap-2">
                          <div className="flex items-center">
                          <Label htmlFor="password">Password</Label>
                          <Link href="#" className="ml-auto inline-block text-sm underline">
                              Forgot your password?
                          </Link>
                          </div>
                          <Input 
                            id="password" 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                          />
                      </div>
                      {error && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                {error}
                            </AlertDescription>
                        </Alert>
                      )}
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
