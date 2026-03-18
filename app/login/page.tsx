'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialType = searchParams.get('type') || 'resident';
  
  const [userType, setUserType] = useState<'resident' | 'official'>(initialType as 'resident' | 'official');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login - in production this would validate against a database
    setTimeout(() => {
      if (userType === 'resident') {
        router.push('/resident/dashboard');
      } else {
        router.push('/official/dashboard');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary to-primary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fadeUp">
        {/* Back Link */}
        <Link href="/" className="inline-flex items-center gap-2 text-secondary-foreground/80 hover:text-secondary-foreground mb-6 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card className="p-8 border-primary/20 shadow-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <Image
              src="/santiago.jpg"
              alt="Barangay Santiago Logo"
              width={80}
              height={80}
              className="rounded-full mx-auto mb-4 border-4 border-accent"
            />
            <h1 className="text-2xl font-bold text-foreground">Barangay Santiago Saz Portal</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
          </div>

          {/* User Type Toggle */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => setUserType('resident')}
              className={`flex items-center justify-center gap-2 py-3 rounded-md font-medium transition ${
                userType === 'resident'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Users className="w-4 h-4" />
              Resident
            </button>
            <button
              type="button"
              onClick={() => setUserType('official')}
              className={`flex items-center justify-center gap-2 py-3 rounded-md font-medium transition ${
                userType === 'official'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Shield className="w-4 h-4" />
              Official
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1 border-border focus:border-primary"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="border-border focus:border-primary pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground">
                <input type="checkbox" className="rounded border-border" />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                `Sign in as ${userType === 'resident' ? 'Resident' : 'Official'}`
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground text-center mb-2">Demo credentials:</p>
            <p className="text-xs text-center text-foreground">Email: demo@example.com</p>
            <p className="text-xs text-center text-foreground">Password: password123</p>
          </div>

          {/* Register Link (for residents only) */}
          {userType === 'resident' && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Register here
              </Link>
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
