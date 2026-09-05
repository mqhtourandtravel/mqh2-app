"use client" 

import * as React from "react"
import { useState } from "react";
import { LogIn, Lock, Mail } from "lucide-react";

interface SignIn2Props {
  onSignIn?: (email: string, pass: string) => Promise<void> | void;
  onOAuth?: (provider: 'google' | 'facebook' | 'apple') => Promise<void> | void;
  loading?: boolean;
  errorMessage?: string;
}

const SignIn2 = ({ onSignIn, onOAuth, loading, errorMessage }: SignIn2Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSignIn = () => {
    if (!email || !password) {
      setError("Masukkan email dan password Anda.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Format alamat email tidak valid.");
      return;
    }
    setError("");
    if (onSignIn) {
      onSignIn(email, password);
    }
  };

  const activeError = errorMessage || error;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-neutral-900/40 backdrop-blur-2xl backdrop-saturate-[1.8] rounded-3xl border border-white/15 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_20px_50px_-12px_rgba(0,0,0,0.6)] p-8 flex flex-col items-center text-white">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E6B472]/15 border border-[#E6B472]/30 mb-5 shadow-lg">
          <LogIn className="w-7 h-7 text-[#E6B472]" />
        </div>
        <h2 className="text-2xl font-bold mb-1 text-center tracking-tight text-white">
          Masuk ke Akun
        </h2>
        <p className="text-[#F4FBFA]/70 text-xs mb-6 text-center leading-relaxed">
          Kelola booking, jadwal keberangkatan, dan layanan MQH Tour &amp; Travel.
        </p>

        <div className="w-full flex flex-col gap-3 mb-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
              <Mail className="w-4 h-4" />
            </span>
            <input
              placeholder="Email"
              type="email"
              value={email}
              className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-white/15 focus:outline-none focus:border-[#E6B472] focus:ring-2 focus:ring-[#E6B472]/30 bg-black/30 text-white placeholder:text-white/40 text-sm transition-all"
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">
              <Lock className="w-4 h-4" />
            </span>
            <input
              placeholder="Password"
              type="password"
              value={password}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-white/15 focus:outline-none focus:border-[#E6B472] focus:ring-2 focus:ring-[#E6B472]/30 bg-black/30 text-white placeholder:text-white/40 text-sm transition-all"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
            />
          </div>

          <div className="w-full flex justify-between items-center min-h-[20px]">
            {activeError ? (
              <div className="text-xs text-red-400 text-left font-medium">{activeError}</div>
            ) : <span />}
            <button type="button" className="text-xs text-[#E6B472] hover:underline font-medium ml-auto">
              Lupa password?
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignIn}
          disabled={loading}
          className="w-full bg-[#E6B472] hover:bg-[#D9A25C] text-neutral-900 font-bold py-2.5 rounded-xl shadow-[0_4px_14px_rgba(230,180,114,0.35)] cursor-pointer transition-all duration-200 mb-4 mt-2 disabled:opacity-50 text-sm"
        >
          {loading ? "Memproses..." : "Masuk Sekarang"}
        </button>

        <div className="flex items-center w-full my-2">
          <div className="flex-grow border-t border-dashed border-white/20"></div>
          <span className="mx-2 text-xs text-white/50">Atau masuk dengan</span>
          <div className="flex-grow border-t border-dashed border-white/20"></div>
        </div>

        <div className="flex gap-3 w-full justify-center mt-2">
          <button
            type="button"
            onClick={() => onOAuth && onOAuth('google')}
            aria-label="Login dengan Google"
            className="flex items-center justify-center w-12 h-11 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 transition-all grow cursor-pointer"
          >
            <img
              src="https://cdn.21st.dev/assets/mirror/38/38146bfd9eff6dbf0d74771f2e625c70d87d3770e0d080dbb6e50db1d5403f46.svg"
              alt="Google"
              className="w-5 h-5"
            />
          </button>
          <button
            type="button"
            onClick={() => onOAuth && onOAuth('facebook')}
            aria-label="Login dengan Facebook"
            className="flex items-center justify-center w-12 h-11 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 transition-all grow cursor-pointer"
          >
            <img
              src="https://cdn.21st.dev/assets/mirror/49/49c99a2bb048f4c4941540ccf601621071669cdd1f51e52312a412f23bb2d5fa.svg"
              alt="Facebook"
              className="w-5 h-5"
            />
          </button>
          <button
            type="button"
            onClick={() => onOAuth && onOAuth('apple')}
            aria-label="Login dengan Apple"
            className="flex items-center justify-center w-12 h-11 rounded-xl border border-white/15 bg-white/5 hover:bg-white/15 transition-all grow cursor-pointer"
          >
            <img
              src="https://cdn.21st.dev/assets/mirror/c2/c221b3f2143cf5d8d85a3b68da84dbae21b18db4164e63ca8c07c6ffdbb922c4.svg"
              alt="Apple"
              className="w-5 h-5 invert"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export { SignIn2 };
export default SignIn2;
