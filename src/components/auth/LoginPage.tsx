import React, { useState } from 'react';
import { Bot, LogIn, Sparkles, Shield, UserCheck } from 'lucide-react';
import { UserRole } from '../../types';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('manager@waresmart.ai');
  const [password, setPassword] = useState('demo1234');
  const [role, setRole] = useState<UserRole>('Warehouse Manager');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-cyan-500 selection:text-white">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-cyan-600/30">
            <Bot className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Smart Warehouse <span className="text-cyan-400">Operations System</span>
          </h1>
          <p className="text-xs text-slate-400">AI-Powered Smart Warehouse Operations Platform</p>
        </div>

        {/* Demo 1-Click Login Box */}
        <div className="bg-cyan-950/30 border border-cyan-500/30 rounded-2xl p-4 space-y-2 text-center">
          <div className="text-xs font-semibold text-cyan-300 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Hackathon Demo Quick Login
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={() => onLogin('Warehouse Manager')}
              className="py-2 px-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[11px] font-semibold transition shadow-md shadow-cyan-600/20"
            >
              Manager Demo
            </button>
            <button
              onClick={() => onLogin('Warehouse Operator')}
              className="py-2 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-[11px] font-semibold transition border border-slate-700"
            >
              Operator Demo
            </button>
            <button
              onClick={() => onLogin('Admin')}
              className="py-2 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-[11px] font-semibold transition border border-slate-700"
            >
              Admin Demo
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-300">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-cyan-300 focus:outline-none"
            >
              <option value="Warehouse Manager">Warehouse Manager</option>
              <option value="Warehouse Operator">Warehouse Operator</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-xl shadow-cyan-600/30"
          >
            <LogIn className="w-4 h-4" /> Sign In to WareSmart AI
          </button>
        </form>
      </div>
    </div>
  );
};
