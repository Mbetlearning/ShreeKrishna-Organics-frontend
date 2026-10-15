
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await login(
        email.trim(),
        password,
        "ADMIN"
      );

      if (!result.success) {
        setError(result.error || "Admin login failed.");
        return;
      }

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3E8] flex items-center justify-center p-5">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#E8DFD3] overflow-hidden">

        <div className="bg-[#075e4d] px-8 py-9 text-center text-white">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#F3DF9B] text-[#075e4d] flex items-center justify-center mb-4">
            <ShieldCheck size={32} />
          </div>

          <h1 className="font-serif text-2xl font-bold">
            ShreeKrishna Organics
          </h1>

          <p className="text-white/70 text-sm mt-1">
            Admin Management Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="text-xs font-semibold text-gray-600">
              Admin Email
            </label>

            <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-xl px-4">
              <Mail size={18} className="text-gray-400" />

              <input
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                className="w-full py-3.5 outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-600">
              Password
            </label>

            <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-xl px-4">
              <LockKeyhole size={18} className="text-gray-400" />

              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full py-3.5 outline-none text-sm"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
className="w-full bg-[#075e4d] hover:bg-[#064c3f] disabled:opacity-60 text-white py-3.5 rounded-xl font-bold transition"          >
            {loading ? "Signing In..." : "Sign In to Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
