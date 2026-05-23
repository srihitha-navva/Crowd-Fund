import { useState, useEffect } from "react";
import { NavLink, useParams } from "react-router-dom";
import { Check, FileText, X } from "lucide-react";
import * as theme from "../styles/Common";
import { API_BASE_URL } from "../config/api";
import { getCampaignImage } from "../utils/campaignImages";
import { useAuth } from "../store/authStore";

function CampaignDetail() {
  const { id } = useParams();
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState("");
  const [donating, setDonating] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const [donationMessage, setDonationMessage] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/campaign-api/campaign/${id}`);
        if (response.ok) {
          const data = await response.json();
          setCampaign(data.payload);
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCampaign();
  }, [id]);

  const handleDonate = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) return;

    setDonating(true);
    setDonationMessage("");

    try {
      const amount = parseInt(donationAmount);
      const response = await fetch(`${API_BASE_URL}/donation-api/donation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          campaignId: id,
          amount,
        }),
      });

      if (response.ok) {
        setDonationMessage("Donation successful! Thank you for your support.");
        setCampaign((prev) => ({
          ...prev,
          raisedAmount: (prev.raisedAmount || 0) + amount,
          donorCount: (prev.donorCount || 0) + 1,
          donorsCount: (prev.donorsCount || 0) + 1,
        }));
        setDonationAmount("");
      } else {
        const data = await response.json().catch(() => ({}));
        setDonationMessage(data.message || "Failed to process donation. Please try again.");
      }
    } catch (error) {
      console.error("Donation error:", error);
      setDonationMessage("Something went wrong. Please try again.");
    } finally {
      setDonating(false);
    }
  };

  const updateCampaignStatus = async (action) => {
    setReviewing(true);
    setReviewMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/admin-api/campaigns/${action}/${id}`, {
        method: "PUT",
        credentials: "include",
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        const nextStatus = action === "approve" ? "APPROVED" : "REJECTED";
        setCampaign((prev) => ({ ...prev, ...data.payload, status: data.payload?.status || nextStatus }));
        setReviewMessage(`Campaign ${nextStatus.toLowerCase()}.`);
      } else {
        setReviewMessage(data.message || "Unable to update campaign.");
      }
    } catch (error) {
      console.error("Campaign review error:", error);
      setReviewMessage("Something went wrong while updating the campaign.");
    } finally {
      setReviewing(false);
    }
  };

  if (loading) {
    return (
      <div className={theme.pageBackground + " min-h-screen flex items-center justify-center"}>
        <p className={theme.loading}>Loading campaign...</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className={theme.pageBackground + " min-h-screen"}>
        <div className={theme.pageWrapper}>
          <p className={theme.emptyState}>Campaign not found</p>
          <NavLink to="/campaigns" className={theme.btnPrimary}>
            Back to Campaigns
          </NavLink>
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(
    (campaign.raisedAmount || 0) / (campaign.goalAmount || 1) * 100,
    100
  );
  const isAdmin = user?.role === "ADMIN";
  const canDonate = isAuthenticated && campaign.status === "APPROVED";

  return (
    <main className={theme.pageBackground + " min-h-screen"}>
      <div className={theme.pageWrapper}>
        {/* Campaign Image */}
        <div className="mb-8 rounded-lg overflow-hidden h-96 bg-[#ECE7D1] shadow-sm">
          <img
            src={getCampaignImage(campaign)}
            alt={campaign.title || "Campaign"}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <h1 className={theme.pageTitle + " mb-4"}>{campaign.title}</h1>

            <div className="flex flex-wrap gap-4 mb-6">
              {campaign.status && (
                <div>
                  <p className={theme.campaignMeta}>Status</p>
                  <p className={
                    campaign.status === "APPROVED"
                      ? theme.statusActive
                      : campaign.status === "PENDING"
                      ? theme.statusPending
                      : theme.statusRejected
                  }>
                    {campaign.status}
                  </p>
                </div>
              )}
              {campaign.deadline && (
                <div>
                  <p className={theme.campaignMeta}>Deadline</p>
                  <p className={theme.body}>
                    {new Date(campaign.deadline).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div className={theme.divider}></div>

            <h2 className={theme.heading + " mb-4"}>About This Campaign</h2>
            <p className={theme.body + " mb-8"}>{campaign.description}</p>

            {campaign.story && (
              <>
                <h2 className={theme.heading + " mb-4"}>The Story</h2>
                <p className={theme.body + " mb-8"}>{campaign.story}</p>
              </>
            )}

            {campaign.proofFiles?.length > 0 && (
              <>
                <h2 className={theme.heading + " mb-4"}>Proof Files</h2>
                <div className="mb-8 flex flex-wrap gap-3">
                  {campaign.proofFiles.map((file, index) => (
                    <a
                      key={file.url}
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-[#DBCEA5] bg-white px-4 py-2 text-sm font-semibold text-[#665A44] hover:border-[#8A7650] hover:text-[#8A7650]"
                    >
                      <FileText size={16} />
                      {file.name || `Proof ${index + 1}`}
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Donation Sidebar */}
          <div>
            <div className={theme.card + " sticky top-24"}>
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className={theme.campaignAmount}>
                    ₹{Number(campaign.raisedAmount || 0).toLocaleString()}
                  </p>
                  <p className={theme.muted}>of ₹{Number(campaign.goalAmount || 0).toLocaleString()}</p>
                </div>
                <div className={theme.progressBar}>
                  <div
                    className={theme.progressFill}
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className={theme.muted + " mt-2"}>
                  {progressPercent.toFixed(0)}% funded
                </p>
              </div>

              <p className={theme.body + " mb-6 text-center text-sm"}>
                <strong>{campaign.donorCount || campaign.donorsCount || 0}</strong> supporters believed in this cause
              </p>

              <div className={theme.divider}></div>

              {isAdmin && (
                <>
                  <div className="space-y-4">
                    <p className={theme.campaignMeta}>Admin Review</p>
                    {campaign.status === "PENDING" ? (
                      <div className="grid gap-3">
                        <button
                          type="button"
                          disabled={reviewing}
                          onClick={() => updateCampaignStatus("approve")}
                          className={theme.btnPrimary + " w-full gap-2"}
                        >
                          <Check size={16} /> Approve Campaign
                        </button>
                        <button
                          type="button"
                          disabled={reviewing}
                          onClick={() => updateCampaignStatus("reject")}
                          className={theme.btnSecondary + " w-full gap-2"}
                        >
                          <X size={16} /> Reject Campaign
                        </button>
                      </div>
                    ) : (
                      <p className={theme.emptyState}>Review complete: {campaign.status}</p>
                    )}
                    {reviewMessage && (
                      <p className={reviewMessage.includes("Unable") || reviewMessage.includes("wrong") ? theme.error : theme.success}>
                        {reviewMessage}
                      </p>
                    )}
                  </div>
                  <div className={theme.divider}></div>
                </>
              )}

              {canDonate ? (
                <>
                  {/* Donation Form */}
                  <form onSubmit={handleDonate} className="space-y-4">
                    <div className={theme.formGroup}>
                      <label className={theme.label}>Donation Amount (₹)</label>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className={theme.input}
                        placeholder="Enter amount"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={donating || !donationAmount}
                      className={theme.btnPrimary + " w-full"}
                    >
                      {donating ? "Processing..." : "Donate Now"}
                    </button>

                    {donationMessage && (
                      <p
                        className={
                          donationMessage.includes("successful")
                            ? theme.success
                            : theme.error
                        }
                      >
                        {donationMessage}
                      </p>
                    )}
                  </form>

                  <p className={theme.muted + " text-center text-xs mt-4"}>
                    Your donation will make a difference
                  </p>
                </>
              ) : !isAuthenticated ? (
                <div className="space-y-4">
                  <p className={theme.bodySmall + " text-center"}>
                    Create an account to continue with your donation.
                  </p>
                  <NavLink to="/register" className={theme.btnPrimary + " w-full"}>
                    Get Started to Donate
                  </NavLink>
                </div>
              ) : (
                <p className={theme.emptyState}>
                  Donations open after this campaign is approved.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12">
          <NavLink to={isAdmin ? "/admin-dashboard" : "/campaigns"} className={theme.btnSecondary}>
            {isAdmin ? "Back to Admin Dashboard" : "Back to Campaigns"}
          </NavLink>
        </div>
      </div>
    </main>
  );
}

export default CampaignDetail;
