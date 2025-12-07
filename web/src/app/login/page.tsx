"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Diamond, Lock, Mail, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Demo credentials
  const demoCredentials = [
    { email: "judge@plutus.iitism.ac.in", password: "Plutus2025!", role: "Judge" },
    { email: "demo@mineral.forecast", password: "DemoAccess123", role: "Demo User" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Check against demo credentials
    const validUser = demoCredentials.find(
      (cred) => cred.email === email && cred.password === password
    );

    if (validUser) {
      // Store auth state (in real app, use proper auth)
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", validUser.role);
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } else {
      setError("Invalid email or password. Use demo credentials below.");
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (index: number) => {
    setEmail(demoCredentials[index].email);
    setPassword(demoCredentials[index].password);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PC9nPjwvc3ZnPg==')] opacity-50" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 border border-blue-400/30 mb-4">
            <Diamond className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Mineral Forecasting</h1>
          <p className="text-slate-400">India&apos;s Critical Mineral Intelligence Platform</p>
          <p className="text-sm text-slate-500 mt-1">Plutus Hackathon | IIT(ISM) Dhanbad</p>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Sign In</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-3">Demo Credentials (for judges):</p>
              <div className="space-y-2">
                {demoCredentials.map((cred, index) => (
                  <button
                    key={index}
                    onClick={() => fillDemoCredentials(index)}
                    className="w-full p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 text-left transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white font-medium">{cred.role}</p>
                        <p className="text-xs text-slate-400">{cred.email}</p>
                      </div>
                      <span className="text-xs text-blue-400">Click to use</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          TEXMiN Foundation | IIT(ISM) Dhanbad
        </p>
      </div>
    </div>
  );
}
