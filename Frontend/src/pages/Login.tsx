import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Store } from "lucide-react";
import { registerUser } from "@/api/authApi"; // <-- important: import real register API

export default function Login() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true); // toggle login/register
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  if (isAuthenticated && !isLoading) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLoginMode) {
        // Sign In
        await login(email, password);
        navigate("/");
      } else {
        // Sign Up
        await registerUser(name, email, password, "staff"); // register as staff by default
        toast({
          title: "Registration Successful",
          description: "You can now login with your credentials",
        });
        setIsLoginMode(true); // Switch back to login after registration
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (error: any) {
      toast({
        title: isLoginMode ? "Login Failed" : "Registration Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Store className="h-10 w-10 text-primary mr-2" />
          <h1 className="text-2xl font-bold text-primary">Stock Savvy Supermarket </h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{isLoginMode ? "Sign In" : "Create Account"}</CardTitle>
            <CardDescription>
              {isLoginMode 
                ? "Enter your credentials to access your account"
                : "Create a new account to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLoginMode && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (isLoginMode ? "Signing in..." : "Creating account...")
                  : (isLoginMode ? "Sign In" : "Create Account")}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              variant="link"
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-primary"
            >
              {isLoginMode
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
