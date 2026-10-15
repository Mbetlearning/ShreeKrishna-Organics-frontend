import React, {
  
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";

import {
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function AdminLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

 

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  try {
    const response = await apiRequest("/v1/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (response.role !== "ADMIN") {
      setError("Admin access required.");
      return;
    }

    localStorage.setItem(
      "prakriti_auth_token",
      response.accessToken
    );

    localStorage.setItem(
      "prakriti_auth_user",
      JSON.stringify({
        userId: response.userId,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        role: response.role,
      })
    );

    localStorage.setItem(
      "shreekrishna_admin",
      "true"
    );

    navigate("/admin/dashboard");
  } catch (err) {
    setError(
      err.message || "Admin login failed."
    );
  }
};

  return (
    <div className="min-h-screen bg-[#F7F3E8] flex items-center justify-center p-5">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-[#E8DFD3] overflow-hidden">

        {/* TOP */}
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

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-5"
        >

          {/* EMAIL */}
          <div>

            <label className="text-xs font-semibold text-gray-600">
              Admin Email
            </label>

            <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-xl px-4">

              <Mail
                size={18}
                className="text-gray-400"
              />

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="admin@shreekrishna.com"
                className="w-full py-3.5 outline-none text-sm"
              />

            </div>

          </div>

          {/* PASSWORD */}
          <div>

            <label className="text-xs font-semibold text-gray-600">
              Password
            </label>

            <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-xl px-4">

              <LockKeyhole
                size={18}
                className="text-gray-400"
              />

              <input
                type="password"
                required
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter password"
                className="w-full py-3.5 outline-none text-sm"
              />

            </div>

          </div>

          {/* ERROR */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </p>
          )}

          {/* LOGIN */}
          <button
            type="submit"
            className="w-full bg-[#075e4d] hover:bg-[#064c3f] text-white py-3.5 rounded-xl font-bold transition"
          >
            Sign In to Admin
          </button>

          {/* DEMO INFO */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800">

            Demo Login:
            <br />

            admin@shreekrishna.com
            <br />

            Admin@123

          </div>

        </form>

      </div>

    </div>
  );
}