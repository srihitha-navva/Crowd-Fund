import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as theme from "../styles/Common";
import { useAuth } from "../store/authStore";

function Login() {
  const navigate = useNavigate();
  const login = useAuth((state) => state.login);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "DONOR",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(formData);
      // Check if login was successful by reading from store
      setTimeout(() => {
        const isAuthenticated = useAuth.getState().isAuthenticated;
        if (isAuthenticated) {
          navigate("/");
        }
      }, 500);
    } catch {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={theme.pageBackground + " min-h-screen"}>
      <div className={theme.pageWrapper}>
        <div className="max-w-md mx-auto">
          <NavLink to="/" className="text-2xl font-bold text-[#8A7650] mb-8 inline-block">
            CrowdFund
          </NavLink>

          <div className={theme.formCard}>
            <h1 className={theme.formTitle}>Sign In</h1>
            <p className={theme.bodySmall + " mb-8 text-center"}>
              Access your campaigns, donations, and profile dashboard.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className={theme.formGroup}>
                <label className={theme.label}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={theme.input}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className={theme.formGroup}>
                <label className={theme.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={theme.input}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className={theme.formGroup}>
                <label className={theme.label}>Account Type</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={theme.input}
                >
                  <option value="DONOR">Donor</option>
                  <option value="FUNDRAISER">Fundraiser</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>

              {error && <p className={theme.error}>{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className={theme.submit}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-[#3D3324]">
              Don't have an account?{" "}
              <NavLink to="/register" className="font-bold text-[#8A7650] hover:underline">
                Create one
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
