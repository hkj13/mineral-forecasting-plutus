"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Diamond, Lock, Mail, Eye, EyeOff, Zap, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const demoCredentials = [
    { email: "judge@plutus.iitism.ac.in", password: "Plutus2025!", role: "Judge Access" },
    { email: "demo@mineral.forecast", password: "DemoAccess123", role: "Demo User" },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const validUser = demoCredentials.find(
      (cred) => cred.email === email && cred.password === password
    );

    if (validUser) {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userRole", validUser.role);
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } else {
      setError("Invalid credentials. Use demo access below.");
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (index: number) => {
    setEmail(demoCredentials[index].email);
    setPassword(demoCredentials[index].password);
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center cyber-bg p-4 relative overflow-hidden">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Animated Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        {/* Futuristic Logo */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 animate-pulse" />
            <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10" />
            <Diamond className="w-10 h-10 text-cyan-400 relative z-10" />
            <div className="absolute inset-0 rounded-2xl bg-cyan-400/20 blur-xl" />
          </div>
          <h1 className="font-cyber text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-2">
            MINERAL INTEL
          </h1>
          <p className="text-cyan-500/70 font-tech tracking-widest text-sm">STRATEGIC RESOURCE COMMAND CENTER</p>
          <p className="text-slate-500 text-xs mt-2 font-tech">PLUTUS HACKATHON 2025 | IIT(ISM) DHANBAD</p>
        </div>

        <Card className="glass-card rounded-2xl border-cyan-500/20 overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="border-b border-cyan-500/10 pb-4">
            <CardTitle className="text-cyan-400 font-tech tracking-wider flex items-center gap-2">
              <Shield className="w-5 h-5" />
              SECURE ACCESS
            </CardTitle>
            <CardDescription className="text-slate-400 font-tech">
              Enter credentials to access the neural interface
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-tech">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-cyan-500/70 font-tech tracking-wider text-xs">EMAIL ADDRESS</Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-cyan-500/50 group-focus-within:text-cyan-400 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 glass border-cyan-500/20 text-white placeholder:text-slate-500 font-tech focus:border-cyan-400/50 focus:ring-cyan-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-cyan-500/70 font-tech tracking-wider text-xs">PASSWORD</Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-3.5 h-4 w-4 text-cyan-500/50 group-focus-within:text-cyan-400 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 glass border-cyan-500/20 text-white placeholder:text-slate-500 font-tech focus:border-cyan-400/50 focus:ring-cyan-500/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-cyan-500/50 hover:text-cyan-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 cyber-button rounded-xl font-tech tracking-wider text-base relative overflow-hidden group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                    <span className="text-cyan-400">AUTHENTICATING...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-cyan-400">
                    <Zap className="w-4 h-4" />
                    INITIALIZE ACCESS
                  </span>
                )}
              </Button>
            </form>

            {/* Demo Credentials - Futuristic */}
            <div className="mt-6 pt-6 border-t border-cyan-500/10">
              <p className="text-xs text-cyan-500/50 font-tech tracking-wider mb-3">QUICK ACCESS PROTOCOLS</p>
              <div className="space-y-2">
                {demoCredentials.map((cred, index) => (
                  <button
                    key={index}
                    onClick={() => fillDemoCredentials(index)}
                    className="w-full p-4 rounded-xl bg-gradient-to-r from-cyan-500/5 to-purple-500/5 hover:from-cyan-500/10 hover:to-purple-500/10 border border-cyan-500/20 hover:border-cyan-400/40 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white font-tech tracking-wider">{cred.role.toUpperCase()}</p>
                        <p className="text-xs text-slate-400 font-mono-tech mt-0.5">{cred.email}</p>
                      </div>
                      <span className="text-xs text-cyan-400 font-tech opacity-0 group-hover:opacity-100 transition-opacity">ACTIVATE →</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Futuristic Footer */}
        <p className="text-center text-xs text-cyan-500/30 mt-6 font-tech tracking-widest">
          TEXMiN FOUNDATION | IIT(ISM) DHANBAD
        </p>
      </div>
    </div>
  );
}
