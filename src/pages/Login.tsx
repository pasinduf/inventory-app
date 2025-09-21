import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { login } from "@/api/auth/login";
import { DEFAULT_ERROR_MESSAGE } from "@/api/const";
import { parseJwt } from "@/lib/parseJwt";
import { useAuth } from "@/hooks/useAuth";
import { tokenRepository } from "@/api";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  
  const { setAuth }: any = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      const result = await login({ username, password });
      if (result) {
        const decoded: any = parseJwt(result.access_token);
        const payload = {
          username: decoded.name,
          userid: decoded.sub,
          roles: decoded.roles,
          accessToken: result.access_token,
        };

        setAuth(payload);
        tokenRepository.setAccessAuth(JSON.stringify(payload));

        // const branchFilters = await getFilterBranches();
        // const centerFilters = await getFilterCenters();
        // const accessList = await getAccessList();
        // setStore({
        //   branchFilters,
        //   centerFilters,
        //   accessList,
        // });

        // navigate(from, { replace: true });
      }
    } catch (error) {
      setError(`${(error as any)?.response?.data?.message || DEFAULT_ERROR_MESSAGE}`);
    } finally {
      setSubmitting(false);
    }
   
    // TODO: Add authentication logic here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md shadow-card border-border">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90" disabled={submitting}>
              Sign In
            </Button>

            <div className="mt-1 text-destructive text-center">{error}</div>
          </form>

          {/* <div className="mt-6 text-center">
            <Button variant="link" className="text-sm text-muted-foreground">
              Forgot your password?
            </Button>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
