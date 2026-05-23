import { useEffect, useState } from "react";
import { Navigate, NavLink } from "react-router-dom";
import { Check, Clock, FileText, Users, X } from "lucide-react";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../store/authStore";
import * as theme from "../styles/Common";

function AdminDashboard() {
  const user = useAuth((state) => state.currentUser);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadDashboard = async () => {
    try {
      const [campaignRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/admin-api/campaigns`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/admin-api/stats`, { credentials: "include" }),
      ]);

      const campaignData = campaignRes.ok ? await campaignRes.json() : { payload: [] };
      const statsData = statsRes.ok ? await statsRes.json() : { payload: null };

      setCampaigns(campaignData.payload || []);
      setStats(statsData.payload);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") {
      loadDashboard();
    }
  }, [isAuthenticated, user?.role]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  const updateCampaign = async (id, action) => {
    setMessage("");
    const response = await fetch(`${API_BASE_URL}/admin-api/campaigns/${action}/${id}`, {
      method: "PUT",
      credentials: "include",
    });

    if (response.ok) {
      setMessage(`Campaign ${action}d.`);
      await loadDashboard();
    } else {
      const data = await response.json().catch(() => ({}));
      setMessage(data.message || "Unable to update campaign.");
    }
  };

  return (
    <main className={theme.pageBackground}>
      <div className={theme.pageWrapper}>
        <div className="mb-10">
          <p className={theme.campaignMeta}>Admin</p>
          <h1 className={theme.pageTitle}>Dashboard</h1>
          <p className={theme.body + " max-w-2xl"}>
            Review campaigns, track platform activity, and keep fundraising quality consistent.
          </p>
        </div>

        <div className="mb-10 grid gap-4 md:grid-cols-4">
          <div className={theme.card + " cursor-default"}>
            <Users className="mb-4 text-[#8A7650]" size={24} />
            <p className={theme.campaignMeta}>Users</p>
            <p className={theme.heading2}>{stats?.users || 0}</p>
          </div>
          <div className={theme.card + " cursor-default"}>
            <Clock className="mb-4 text-[#8A7650]" size={24} />
            <p className={theme.campaignMeta}>Pending</p>
            <p className={theme.heading2}>{stats?.pendingCampaigns || 0}</p>
          </div>
          <div className={theme.card + " cursor-default"}>
            <p className={theme.campaignMeta}>Campaigns</p>
            <p className={theme.heading2}>{stats?.campaigns || 0}</p>
          </div>
          <div className={theme.card + " cursor-default"}>
            <p className={theme.campaignMeta}>Raised</p>
            <p className={theme.heading2}>₹{Number(stats?.totalRaised || 0).toLocaleString()}</p>
          </div>
        </div>

        {message && (
          <p className={message.includes("Unable") ? theme.error : theme.success}>{message}</p>
        )}

        {loading ? (
          <p className={theme.loading}>Loading dashboard...</p>
        ) : campaigns.length ? (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <article key={campaign._id} className={theme.articleCard}>
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <span
                        className={
                          campaign.status === "APPROVED"
                            ? theme.statusActive
                            : campaign.status === "PENDING"
                            ? theme.statusPending
                            : theme.statusRejected
                        }
                      >
                        {campaign.status}
                      </span>
                      <p className={theme.campaignMeta}>{campaign.category || "Campaign"}</p>
                    </div>
                    <NavLink to={`/campaign/${campaign._id}`} className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A7650]/25">
                      <h2 className={theme.articleTitle + " hover:text-[#8A7650]"}>{campaign.title}</h2>
                      <p className={theme.articleExcerpt + " mt-2 line-clamp-2"}>
                        {campaign.description}
                      </p>
                      <p className={theme.link + " mt-2 inline-block"}>View details</p>
                    </NavLink>
                    <p className={theme.muted + " mt-2"}>
                      By {campaign.createdBy?.name || "Unknown"} · ₹{Number(campaign.raisedAmount || 0).toLocaleString()} of ₹{Number(campaign.goalAmount || 0).toLocaleString()}
                    </p>
                    {campaign.proofFiles?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {campaign.proofFiles.map((file, index) => (
                          <a
                            key={file.url}
                            href={file.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded-full bg-[#ECE7D1] px-3 py-1 text-xs font-semibold text-[#665A44] hover:bg-[#DBCEA5]"
                          >
                            <FileText size={14} />
                            {file.name || `Proof ${index + 1}`}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {campaign.status === "PENDING" ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => updateCampaign(campaign._id, "approve")}
                        className={theme.btnPrimary + " inline-flex items-center gap-2 px-4"}
                      >
                        <Check size={16} /> Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => updateCampaign(campaign._id, "reject")}
                        className={theme.btnSecondary + " inline-flex items-center gap-2 px-4"}
                      >
                        <X size={16} /> Reject
                      </button>
                    </div>
                  ) : (
                    <p className={theme.muted}>Review complete</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className={theme.emptyState}>No campaigns to review.</p>
        )}
      </div>
    </main>
  );
}

export default AdminDashboard;
