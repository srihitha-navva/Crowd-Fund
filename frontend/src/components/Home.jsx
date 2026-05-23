import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import * as theme from "../styles/Common";
import {
  CircleDollarSign,
  Globe2,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { API_BASE_URL } from "../config/api";
import heroImg from "../assets/home_6.png";
import { getCampaignImage } from "../utils/campaignImages";

function Home() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/campaign-api/campaign`);
        if (response.ok) {
          const data = await response.json();
          setCampaigns((data.payload || []).slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const features = [
    {
      title: "Zero Fees",
      description: "All funds go directly to your cause. No hidden charges.",
      icon: CircleDollarSign,
    },
    {
      title: "Secure Payments",
      description: "Bank-level security protects every transaction.",
      icon: ShieldCheck,
    },
    {
      title: "Global Reach",
      description: "Connect with supporters from around the world.",
      icon: Globe2,
    },
    {
      title: "24/7 Support",
      description: "Our team is always here to help you succeed.",
      icon: Headphones,
    },
  ];

  return (
    <main className={theme.pageBackground}>
      {/* Hero Section */}
      <section className="relative bg-[#8A7650] text-white py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(219,206,165,0.28),transparent_36%)]"></div>
        <div className={theme.pageWrapper + " relative z-10"}>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Change Lives, One Campaign at a Time
              </h1>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                CrowdFund connects dreams with supporters. Whether it's medical emergencies, education, or community projects—your cause deserves to be heard.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <NavLink
                  to="/campaigns"
                  className={theme.btnOutlineOnDark}
                >
                  Explore Campaigns
                </NavLink>
                <NavLink
                  to="/register"
                  className={theme.btnOnDark}
                >
                  Start Fundraising
                </NavLink>
              </div>
            </div>

            <div className="relative">
              <img
                src={heroImg}
                alt="Volunteers packing donation supplies"
                className="w-full aspect-[4/3] object-cover rounded-lg shadow-2xl border border-white/10"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=500&h=500&fit=crop";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      

      {/* Featured Campaigns */}
      <section className={theme.pageWrapper}>
        <div className="flex items-center justify-between mb-12">
          <h2 className={theme.heading}>Featured Campaigns</h2>
          <NavLink to="/campaigns" className={theme.link}>
            View All
          </NavLink>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className={theme.muted}>Loading campaigns...</p>
          </div>
        ) : campaigns.length > 0 ? (
          <div className={theme.campaignGrid}>
            {campaigns.map((campaign) => (
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

                  <div className={theme.progressBar + " mb-2"}>
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
                    <p className={theme.muted}>
                      {campaign.donorCount || campaign.donorsCount || 0} supporters
                    </p>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        ) : (
          <div className={theme.emptyState}>
            <p>No campaigns yet. Be the first to start one!</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-16 bg-[#ECE7D1]">
        <div className={theme.pageWrapper}>
          <h2 className="text-center mb-12">
            <span className={theme.heading}>Why Choose CrowdFund?</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white text-[#8A7650]">
                    <Icon size={26} />
                  </div>
                  <h3 className={theme.subHeading}>{feature.title}</h3>
                  <p className={theme.bodySmall + " mt-2"}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#8E977D] text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Create a campaign, share your story, and let your community support your cause.
          </p>
          <NavLink
            to="/register"
            className={theme.btnOnDark}
          >
            Get Started Today
          </NavLink>
        </div>
      </section>
    </main>
  );
}

export default Home;
