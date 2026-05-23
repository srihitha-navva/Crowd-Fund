import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as theme from "../styles/Common";
import { useAuth } from "../store/authStore";
import { API_BASE_URL } from "../config/api";

function FundraisingPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    deadline: "",
    category: "Medical",
  });
  const [campaignImage, setCampaignImage] = useState(null);
  const [proofFiles, setProofFiles] = useState([]);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthenticated || user?.role !== "FUNDRAISER") {
    return (
      <div className={theme.pageBackground + " min-h-screen"}>
        <div className={theme.pageWrapper + " text-center py-20"}>
          <h1 className={theme.pageTitle + " mb-4"}>Access Denied</h1>
          <p className={theme.body + " mb-8"}>
            Only fundraisers can create campaigns. Please sign up as a fundraiser.
          </p>
          <NavLink to="/register" className={theme.btnPrimary}>
            Become a Fundraiser
          </NavLink>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProofFilesChange = (e) => {
    setProofFiles(Array.from(e.target.files || []));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        payload.append(key, key === "goalAmount" ? Number(value) : value);
      });
      if (campaignImage) {
        payload.append("campaignImage", campaignImage);
      }
      proofFiles.forEach((file) => {
        payload.append("proofFiles", file);
      });

      const response = await fetch(`${API_BASE_URL}/campaign-api/campaign`, {
        method: "POST",
        credentials: "include",
        body: payload,
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Campaign created successfully. It will be reviewed by our admin team.");
        setFormData({
          title: "",
          description: "",
          goalAmount: "",
          deadline: "",
          category: "Medical",
        });
        setCampaignImage(null);
        setProofFiles([]);
        setTimeout(() => navigate("/campaigns"), 2000);
      } else {
        setMessage(data.message || "Unable to create campaign.");
      }
    } catch (error) {
      console.error("Create campaign error:", error);
      setMessage("Something went wrong while creating the campaign.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className={theme.pageBackground + " min-h-screen"}>
      <div className={theme.pageWrapper}>
        <div className="max-w-2xl mx-auto">
          <h1 className={theme.pageTitle + " mb-2"}>Start Your Campaign</h1>
          <p className={theme.body + " mb-8"}>
            Share your cause with the world. Fill in the details below to get started.
          </p>

          <form onSubmit={handleSubmit} className={theme.formCard}>
            <div className={theme.formGroup}>
              <label className={theme.label}>Campaign Title</label>
              <input
                className={theme.input}
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Help build our community school"
                required
              />
            </div>

            <div className={theme.formGroup}>
              <label className={theme.label}>Category</label>
              <select
                className={theme.input}
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Medical">Medical</option>
                <option value="Education">Education</option>
                <option value="Emergency">Emergency</option>
                <option value="Environment">Environment</option>
                <option value="Community">Community</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className={theme.formGroup}>
              <label className={theme.label}>Description</label>
              <textarea
                className={theme.textarea + " min-h-32"}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell your story. Why does this campaign matter?"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className={theme.formGroup}>
                <label className={theme.label}>Fundraising Goal (₹)</label>
                <input
                  className={theme.input}
                  type="number"
                  min="1"
                  name="goalAmount"
                  value={formData.goalAmount}
                  onChange={handleChange}
                  placeholder="10000"
                  required
                />
              </div>

              <div className={theme.formGroup}>
                <label className={theme.label}>Deadline</label>
                <input
                  className={theme.input}
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={theme.formGroup}>
              <label className={theme.label}>Campaign Image</label>
              <input
                className={theme.input}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setCampaignImage(e.target.files?.[0] || null)}
              />
              {campaignImage && (
                <p className={theme.muted + " mt-2"}>{campaignImage.name}</p>
              )}
            </div>

            <div className={theme.formGroup}>
              <label className={theme.label}>Proof Documents or Images</label>
              <input
                className={theme.input}
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                multiple
                onChange={handleProofFilesChange}
              />
              {proofFiles.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {proofFiles.map((file) => (
                    <span
                      key={`${file.name}-${file.lastModified}`}
                      className="rounded-full bg-[#ECE7D1] px-3 py-1 text-xs font-semibold text-[#665A44]"
                    >
                      {file.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={isSubmitting} className={theme.submit}>
              {isSubmitting ? "Creating Campaign..." : "Create Campaign"}
            </button>

            {message && (
              <p
                className={
                  message.includes("successfully") ? theme.success : theme.error
                }
              >
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}

export default FundraisingPage;
