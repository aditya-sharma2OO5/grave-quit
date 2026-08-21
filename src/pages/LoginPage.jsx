import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Feather, ShieldCheck, Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login and redirect to My Items page
    navigate('/items');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#0A0A0A]">
      <div className="max-w-md w-full space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] mx-auto flex items-center justify-center">
            <Feather className="w-6 h-6 text-[#A8C5B0]" />
          </div>
          <h1 className="text-2xl font-bold font-headline text-[#F5F5F0]">
            {isSignUp ? 'Create Your Sanctuary' : 'Welcome Back to Graveyard'}
          </h1>
          <p className="text-xs text-[#8A8A8A]">
            {isSignUp 
              ? 'Begin observing your journeys with clarity and zero guilt.' 
              : 'Sign in to access your items, pattern summaries, and insights.'}
          </p>
        </div>

        {/* Auth Card */}
        <Card className="p-8">
          
          {/* Auth Tab Switcher */}
          <div className="flex p-1 bg-[#131313] rounded-lg border border-[#2A2A2A] mb-6">
            <button
              type="button"
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
                !isSignUp ? 'bg-[#1A1A1A] text-[#F5F5F0] border border-[#2A2A2A]' : 'text-[#8A8A8A]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
                isSignUp ? 'bg-[#1A1A1A] text-[#F5F5F0] border border-[#2A2A2A]' : 'text-[#8A8A8A]'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-[#8A8A8A] mb-1.5 uppercase tracking-wider">
                Student Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#131313] border border-[#2A2A2A] focus:border-[#A8C5B0] text-[#F5F5F0] placeholder-[#8A8A8A]/40 text-sm rounded-lg pl-10 pr-3.5 py-2.5 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-[#8A8A8A] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A8A8A] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#131313] border border-[#2A2A2A] focus:border-[#A8C5B0] text-[#F5F5F0] placeholder-[#8A8A8A]/40 text-sm rounded-lg pl-10 pr-3.5 py-2.5 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Submit */}
            <Button variant="primary" type="submit" className="w-full mt-2">
              <span>{isSignUp ? 'Create Student Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          {/* Social Auth Separator */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-[1px] bg-[#2A2A2A] flex-1"></div>
            <span className="text-[10px] text-[#8A8A8A] uppercase tracking-wider font-semibold">Or continue with</span>
            <div className="h-[1px] bg-[#2A2A2A] flex-1"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" size="sm" onClick={handleSubmit}>
              Google Workspace
            </Button>
            <Button variant="secondary" size="sm" onClick={handleSubmit}>
              GitHub Student
            </Button>
          </div>

        </Card>

        {/* Privacy Note */}
        <div className="p-3.5 bg-[#131313] border border-[#2A2A2A] rounded-xl text-center flex items-center justify-center gap-2 text-xs text-[#8A8A8A]">
          <ShieldCheck className="w-4 h-4 text-[#A8C5B0] shrink-0" />
          <span>We never sell your data or share individual entries with university offices.</span>
        </div>

      </div>
    </div>
  );
};
