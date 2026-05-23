import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as theme from "../styles/Common";
import { API_BASE_URL } from "../config/api";

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    role: "DONOR",
  });
  const [errors, setErrors] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Valid email is required";
    if (!formData.mobile.match(/^\d{10}$/))
      newErrors.mobile = "Valid 10-digit phone number is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("email", formData.email);
      payload.append("mobile", formData.mobile);
      payload.append("password", formData.password);
      payload.append("role", formData.role);
      if (profileImage) {
        payload.append("profileImage", profileImage);
      }

      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        method: "POST",
        credentials: "include",
        body: payload,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={theme.pageBackground + " min-h-screen"}>
      <div className={theme.pageWrapper}>
        <div className="max-w-xl mx-auto">
          <NavLink to="/" className="text-2xl font-bold text-[#8A7650] mb-8 inline-block">
            CrowdFund
          </NavLink>

          <div className={theme.formCard}>
            <h1 className={theme.formTitle}>Create Account</h1>
            <p className={theme.bodySmall + " mb-8 text-center"}>
              Set up your profile as a donor or fundraiser and start using CrowdFund.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className={theme.formGroup}>
                <label className={theme.label}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={theme.input}
                  placeholder="John Doe"
                />
                {errors.name && <p className={theme.error}>{errors.name}</p>}
              </div>

              <div className={theme.formGroup}>
                <label className={theme.label}>Profile Picture</label>
                <div className="flex flex-col gap-4 rounded-lg border border-dashed border-[#DBCEA5] bg-[#FBF8EC] p-4 sm:flex-row sm:items-center">
                  <img
                    src={
                      profileImage
                        ? URL.createObjectURL(profileImage)
                        : "https://i.pravatar.cc/120?u=new-user"
                    }
                    alt="Profile preview"
                    className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-sm"
                  />
                  <div className="flex-1">
                    <input
                      type="file"
                      name="profileImage"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleProfileImageChange}
                      className={theme.input}
                    />
                    <p className={theme.muted + " mt-2"}>JPG, PNG, or WEBP up to 5 MB.</p>
                  </div>
                </div>
              </div>

              <div className={theme.formGroup}>
                <label className={theme.label}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={theme.input}
                  placeholder="john@example.com"
                />
                {errors.email && <p className={theme.error}>{errors.email}</p>}
              </div>

              <div className={theme.formGroup}>
                <label className={theme.label}>Phone Number</label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={theme.input}
                  placeholder="1234567890"
                />
                {errors.mobile && <p className={theme.error}>{errors.mobile}</p>}
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
                />
                {errors.password && <p className={theme.error}>{errors.password}</p>}
              </div>

              <div className={theme.formGroup}>
                <label className={theme.label}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={theme.input}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className={theme.error}>{errors.confirmPassword}</p>
                )}
              </div>

              <div className={theme.formGroup + " rounded-lg bg-[#ECE7D1]/70 p-4"}>
                <label className={theme.label}>Account Type</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={theme.input}
                >
                  <option value="DONOR">Donor - Support causes</option>
                  <option value="FUNDRAISER">Fundraiser - Start campaigns</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={theme.submit}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {message && (
              <div
                className={
                  message.includes("successful")
                    ? theme.success
                    : theme.error
                }
              >
                {message}
              </div>
            )}

            <p className="mt-6 text-center text-[#3D3324]">
              Already have an account?{" "}
              <NavLink to="/login" className="font-bold text-[#8A7650] hover:underline">
                Sign In
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
