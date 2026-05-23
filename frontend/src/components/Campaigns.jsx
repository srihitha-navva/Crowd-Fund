import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import * as theme from "../styles/Common";
import { Search } from "lucide-react";
import { API_BASE_URL } from "../config/api";
import { getCampaignImage } from "../utils/campaignImages";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/campaign-api/campaign`);
        if (response.ok) {
          const data = await response.json();
          const approved = (data.payload || []).filter(c => c.status === "APPROVED");
          setCampaigns(approved);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) =>
      campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, campaigns]);

  return (
    <main className={theme.pageBackground + " min-h-screen"}>
      <div className={theme.pageWrapper}>
        {/* Header */}
        <div className="mb-12">
          <h1 className={theme.pageTitle + " mb-4"}>Active Campaigns</h1>
          <p className={theme.body + " max-w-2xl"}>
            Browse and support campaigns that matter to you. Every contribution brings us closer to making a real difference.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 relative">
          <Search size={20} className="absolute left-4 top-3.5 text-[#8E977D]" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={theme.input + " pl-12"}
          />
        </div>

        {/* Campaigns */}
        {loading ? (
          <div className="text-center py-20">
            <p className={theme.loading}>Loading campaigns...</p>
          </div>
        ) : filteredCampaigns.length > 0 ? (
          <div className={theme.campaignGrid}>
            {filteredCampaigns.map((campaign) => (
              <NavLink
                key={campaign._id}
                to={`/campaign/${campaign._id}`}
                className={theme.campaignCard}
              >
                <div className={theme.campaignImage}>
                  <img
                    src={getCampaignImage(campaign)}
                    alt={campaign.title || "Campaign"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-6">
                  <p className={theme.campaignMeta}>{campaign.category || "Campaign"}</p>

                  <h3 className={theme.heading2 + " mt-2 mb-2 line-clamp-2"}>
                    {campaign.title}
                  </h3>

                  <p className={theme.bodySmall + " line-clamp-2 mb-4"}>
                    {campaign.description}
                  </p>

                  <div className={theme.progressBar + " mb-3"}>
                    <div
                      className={theme.progressFill}
                      style={{
                        width: `${Math.min(
                          (campaign.raisedAmount || 0) /
                            (campaign.goalAmount || 1) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className={theme.campaignAmount}>
                        ₹{Number(campaign.raisedAmount || 0).toLocaleString()}
                      </p>
                      <p className={theme.muted}>
                        of ₹{Number(campaign.goalAmount || 0).toLocaleString()}
                      </p>
                    </div>
                    <p className={theme.muted + " text-xs"}>
                      {campaign.donorCount || campaign.donorsCount || 0} supporters
                    </p>
                  </div>

                  {campaign.deadline && (
                    <p className={theme.muted + " text-xs mt-3"}>
                      Deadline: {new Date(campaign.deadline).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </NavLink>
            ))}
          </div>
        ) : (
          <div className={theme.emptyState}>
            {searchTerm ? "No campaigns match your search" : "No active campaigns yet"}
          </div>
        )}
      </div>
    </main>
  );
}

export default Campaigns;
