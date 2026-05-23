import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import * as theme from "../styles/Common";
import {
  CircleDollarSign,
  Globe2,
  Headphones,
  HeartHandshake,
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../store/authStore";
import heroImg from "../assets/home_6.png";
import { getCampaignImage } from "../utils/campaignImages";

function Home() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);
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

  const roleHome = {
    DONOR: {
      label: "Donor Home",
      title: `Welcome back${user?.name ? `, ${user.name}` : ""}`,
      description:
        "Find meaningful campaigns, follow your giving activity, and support causes that need help now.",
      actions: [
        { to: "/campaigns", label: "Explore Campaigns", icon: HeartHandshake, style: theme.btnPrimary },
        { to: "/donor-profile", label: "My Profile", icon: UserCircle, style: theme.btnSecondary },
      ],
      highlights: [
        "Browse verified campaigns waiting for supporters.",
        "Donate securely and keep your giving history in one place.",
        "Return anytime to continue supporting causes you care about.",
      ],
    },
    FUNDRAISER: {
      label: "Fundraiser Home",
      title: `Ready to grow your campaign${user?.name ? `, ${user.name}` : ""}?`,
      description:
        "Create campaigns, share your story, and track the support your community is building with you.",
      actions: [
        { to: "/fundraising", label: "Create Campaign", icon: PlusCircle, style: theme.btnPrimary },
        { to: "/fundraiser-profile", label: "My Profile", icon: UserCircle, style: theme.btnSecondary },
      ],
      highlights: [
        "Submit a campaign with photos, proof files, goals, and deadlines.",
        "Campaigns are reviewed by admins before donors can contribute.",
        "Keep your fundraiser profile ready for supporters to trust your story.",
      ],
    },
    ADMIN: {
      label: "Admin Home",
      title: `Platform overview${user?.name ? ` for ${user.name}` : ""}`,
      description:
        "Review submitted campaigns, monitor activity, and keep the platform trustworthy for everyone.",
      actions: [
        { to: "/admin-dashboard", label: "Open Dashboard", icon: LayoutDashboard, style: theme.btnPrimary },
        { to: "/admin-profile", label: "My Profile", icon: UserCircle, style: theme.btnSecondary },
      ],
      highlights: [
        "Approve or reject campaign submissions from one dashboard.",
        "Track users, donations, and platform totals.",
        "Inspect campaign details before they go live for donors.",
      ],
    },
  };

  const currentRoleHome = roleHome[user?.role];

  if (isAuthenticated && currentRoleHome) {
    return (
      <main className={theme.pageBackground}>
        <section className="bg-[#FBF8EC]">
          <div className={theme.pageWrapper}>
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className={theme.campaignMeta}>{currentRoleHome.label}</p>
                <h1 className={theme.pageTitle}>{currentRoleHome.title}</h1>
                <p className={theme.body + " max-w-2xl mb-8"}>
                  {currentRoleHome.description}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  {currentRoleHome.actions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <NavLink key={action.to} to={action.to} className={action.style}>
                        <Icon size={18} className="mr-2" />
                        {action.label}
                      </NavLink>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-lg border border-[#DBCEA5]/80 bg-white p-6 shadow-sm">
                <h2 className={theme.heading2 + " mb-5"}>Your next steps</h2>
                <div className="space-y-4">
                  {currentRoleHome.highlights.map((highlight, index) => (
                    <div key={highlight} className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#8E977D] text-sm font-bold text-white">
                        {index + 1}
                      </div>
                      <p className={theme.bodySmall}>{highlight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={theme.pageWrapper}>
          <div className="flex items-center justify-between mb-10">
            <h2 className={theme.heading}>
              {user?.role === "ADMIN" ? "Recent Campaigns" : "Featured Campaigns"}
            </h2>
            <NavLink to={user?.role === "ADMIN" ? "/admin-dashboard" : "/campaigns"} className={theme.link}>
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
                            ((campaign.raisedAmount || 0) / (campaign.goalAmount || 1)) * 100,
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
              <p>No campaigns yet.</p>
            </div>
          )}
        </section>
      </main>
    );
  }

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
