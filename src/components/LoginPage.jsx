import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaTimes, FaWallet } from "react-icons/fa";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    if (e) e.preventDefault();

    try {
      setError("");
      setLoading(true);
      const user = await login(email, password);

      if (user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login failed", err);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-hidden font-sans">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/video/hero-home-bg.mp4" type="video/mp4" />
      </video>

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px] z-1"></div>

      {/* Project Name Logo */}
      <div className="absolute top-8 left-10 z-20 flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/30 shadow-xl">
          <FaWallet className="text-white text-2xl" />
        </div>
        <span className="text-white text-2xl font-black tracking-tighter uppercase drop-shadow-lg">Money Tracker</span>
      </div>

      {/* Login Card Container */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[420px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[30px] p-10 shadow-2xl relative"
        >
          {/* Close Icon (Matching the image) */}
          <button className="absolute top-6 right-6 text-white hover:scale-110 transition-transform">
            <FaTimes className="text-xl" />
          </button>

          <h1 className="text-3xl font-bold text-white text-center mb-10">Login</h1>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 text-sm rounded-xl text-center backdrop-blur-md"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Email Field */}
            <div className="relative group">
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-transparent border-b-2 border-white/30 py-3 pl-2 pr-10 text-white placeholder-white/70 outline-none focus:border-white transition-all text-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FaEnvelope className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-white transition-colors" />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-transparent border-b-2 border-white/30 py-3 pl-2 pr-10 text-white placeholder-white/70 outline-none focus:border-white transition-all text-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaLock className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 group-focus-within:text-white transition-colors" />
            </div>

            {/* Options */}
            <div className="flex items-center justify-between text-sm text-white/90">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded border-white/30 accent-white/20" />
                <span>Remember me</span>
              </label>
              <button type="button" className="hover:underline font-medium">Forgot Password?</button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-[#1a1c1e] font-bold py-3 rounded-lg hover:bg-gray-200 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Logging In...' : 'Login'}
            </button>

            {/* Register Link */}
            <div className="text-center text-white/90 text-sm mt-6">
              Don't have an account?
              <Link to="/signup" className="ml-2 font-bold hover:underline">Register</Link>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Decorative Blur Blobs */}
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full mix-blend-multiply filter blur-[120px] pointer-events-none"></div>
    </div>
  );
}
