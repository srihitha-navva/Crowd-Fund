import { useEffect, useState } from "react";
import { NavLink, Navigate } from "react-router-dom";
import {
  ArrowRight,
  CircleDollarSign,
  Clock,
  HeartHandshake,
  LayoutDashboard,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { API_BASE_URL } from "../config/api";
import { useAuth } from "../store/authStore";
import * as theme from "../styles/Common";

const profilePathForRole = (role) => {
  switch (role) {
    case "DONOR":
      return "/donor-profile";
    case "FUNDRAISER":
      return "/fundraiser-profile";
    case "ADMIN":
      return "/admin-profile";
    default:
      return "/";
  }
};

const roleDetails = {
  DONOR: {
    label: "Donor Profile",
    title: "Your Giving Dashboard",
    description: "Track your donations and continue supporting campaigns that matter to you.",
    actionLabel: "Explore Campaigns",
    actionTo: "/campaigns",
    icon: HeartHandshake,
  },
  FUNDRAISER: {
    label: "Fundraiser Profile",
    title: "Your Campaign Workspace",
    description: "Manage your campaigns, follow donation progress, and keep your cause moving.",
    actionLabel: "Create Campaign",
    actionTo: "/fundraising",
    icon: CircleDollarSign,
  },
  ADMIN: {
    label: "Admin Profile",
    title: "Platform Overview",
    description: "Review platform activity and open the admin dashboard when campaigns need attention.",
    actionLabel: "Open Dashboard",
    actionTo: "/admin-dashboard",
    icon: ShieldCheck,
  },
};

const formatMoney = (value) => `₹${Number(value || 0).toLocaleString()}`;
const formatDate = (value) => {
  if (!value) return "Date unavailable";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

function DonationHistory({ donations, loading }) {
  return (
    <div>
      <h2 className={theme.heading + " mb-5"}>Donation History</h2>
      {loading ? (
        <p className={theme.loading}>Loading donations...</p>
      ) : donations.length ? (
        <div className="space-y-3">
          {donations.map((donation) => {
            const campaignId = donation.campaignId?._id || donation.campaignId;
            const content = (
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className={theme.articleTitle}>
                    {donation.campaignId?.title || "Campaign"}
                  </p>
                  <p className={theme.muted + " mt-1"}>
                    Donated on {formatDate(donation.createdAt)}
                  </p>
                </div>
                <p className={theme.campaignAmount}>{formatMoney(donation.amount)}</p>
              </div>
            );

            return campaignId ? (
              <NavLink
                key={donation._id}
                to={`/campaign/${campaignId}`}
                className={theme.articleCard + " block"}
              >
                {content}
              </NavLink>
            ) : (
              <div key={donation._id} className={theme.articleCard}>
                {content}
              </div>
            );
          })}
        </div>
      ) : (
        <p className={theme.emptyState}>No donations yet.</p>
      )}
    </div>
  );
}

function Profile({ expectedRole }) {
  const user = useAuth((state) => state.currentUser);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadProfileData = async () => {
      try {
        const requests = [];

        if (user?.role === "FUNDRAISER" || user?.role === "ADMIN") {
          requests.push(
            fetch(`${API_BASE_URL}/campaign-api/my-campaigns`, {
              credentials: "include",
            }).then((res) => (res.ok ? res.json() : { payload: [] }))
          );
        } else {
          requests.push(Promise.resolve({ payload: [] }));
        }

        requests.push(
          fetch(`${API_BASE_URL}/donation-api/my-donations`, {
            credentials: "include",
          }).then((res) => (res.ok ? res.json() : { payload: [] }))
        );

        const [campaignData, donationData] = await Promise.all(requests);
        setCampaigns(campaignData.payload || []);
        setDonations(donationData.payload || []);
      } catch (error) {
        console.error("Profile load error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [isAuthenticated, user?.role]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (expectedRole && user?.role !== expectedRole) {
    return <Navigate to={profilePathForRole(user?.role)} replace />;
  }

  const details = roleDetails[user?.role] || roleDetails.DONOR;
  const RoleIcon = details.icon;
  const totalDonated = donations.reduce((sum, donation) => sum + (donation.amount || 0), 0);
  const totalRaised = campaigns.reduce((sum, campaign) => sum + (campaign.raisedAmount || 0), 0);
  const approvedCampaigns = campaigns.filter((campaign) => campaign.status === "APPROVED").length;
  const pendingCampaigns = campaigns.filter((campaign) => campaign.status === "PENDING").length;
  const statCards =
    user?.role === "DONOR"
      ? [
          { label: "Donated", value: formatMoney(totalDonated), icon: CircleDollarSign },
          { label: "Donations", value: donations.length, icon: HeartHandshake },
          { label: "Account", value: "Donor", icon: UserRound },
        ]
      : user?.role === "ADMIN"
      ? [
          { label: "Campaigns", value: campaigns.length, icon: LayoutDashboard },
          { label: "Pending", value: pendingCampaigns, icon: Clock },
          { label: "Donated", value: formatMoney(totalDonated), icon: CircleDollarSign },
        ]
      : [
          { label: "Raised", value: formatMoney(totalRaised), icon: CircleDollarSign },
          { label: "Approved", value: approvedCampaigns, icon: LayoutDashboard },
          { label: "Donated", value: formatMoney(totalDonated), icon: HeartHandshake },
        ];

  return (
    <main className={theme.pageBackground}>
      <div className={theme.pageWrapper}>
        <section className="rounded-lg border border-[#DBCEA5] bg-white p-8 shadow-sm">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <img
                src={user?.profileImage || "https://i.pravatar.cc/120?u=" + user?.email}
                alt={user?.name || "Profile"}
                className="h-24 w-24 rounded-full border-4 border-[#ECE7D1] object-cover"
              />
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-lg bg-[#ECE7D1] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#8A7650]">
                  <RoleIcon size={15} />
                  {details.label}
                </div>
                <h1 className="text-3xl font-semibold text-[#3D3324]">{user?.name}</h1>
                <p className={theme.bodySmall + " mt-2 max-w-xl"}>{details.description}</p>
                <div className="mt-4 flex flex-wrap gap-3 text-sm text-[#665A44]">
                  {user?.email && (
                    <span className="inline-flex items-center gap-2">
                      <Mail size={15} />
                      {user.email}
                    </span>
                  )}
                  {user?.mobile && (
                    <span className="inline-flex items-center gap-2">
                      <Phone size={15} />
                      {user.mobile}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-2xl font-semibold text-[#3D3324]">{details.title}</h2>
              <NavLink to={details.actionTo} className={theme.btnPrimary + " gap-2"}>
                {details.actionLabel}
                <ArrowRight size={16} />
              </NavLink>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={theme.card + " cursor-default"}>
                <Icon className="mb-4 text-[#8A7650]" size={24} />
                <p className={theme.campaignMeta}>{stat.label}</p>
                <p className={theme.heading2}>{stat.value}</p>
              </div>
            );
          })}
        </section>

        {user?.role === "DONOR" && (
          <section className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <DonationHistory donations={donations} loading={loading} />
            <div className={theme.articleCard + " h-fit"}>
              <HeartHandshake className="mb-4 text-[#8A7650]" size={28} />
              <h2 className={theme.subHeading}>Keep Supporting Causes</h2>
              <p className={theme.bodySmall + " mt-3 mb-5"}>
                Browse approved campaigns, review their stories, and contribute when a cause feels right.
              </p>
              <NavLink to="/campaigns" className={theme.btnSecondary}>
                Find Campaigns
              </NavLink>
            </div>
          </section>
        )}

        {user?.role === "FUNDRAISER" && (
          <section className="mt-12">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className={theme.heading}>Campaign Management</h2>
              <NavLink to="/fundraising" className={theme.btnPrimary}>
                Create Campaign
              </NavLink>
            </div>
            {loading ? (
              <p className={theme.loading}>Loading campaigns...</p>
            ) : campaigns.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {campaigns.map((campaign) => (
                  <NavLink
                    key={campaign._id}
                    to={`/campaign/${campaign._id}`}
                    className={theme.articleCard + " block"}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className={theme.articleTitle}>{campaign.title}</p>
                        <p className={theme.muted + " mt-1"}>
                          {formatMoney(campaign.raisedAmount)} of {formatMoney(campaign.goalAmount)}
                        </p>
                        <p className={theme.bodySmall + " mt-3 line-clamp-2"}>{campaign.description}</p>
                      </div>
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
                    </div>
                  </NavLink>
                ))}
              </div>
            ) : (
              <div className={theme.emptyState}>
                <Clock className="mx-auto mb-3" size={22} />
                No campaigns yet.
              </div>
            )}
          </section>
        )}

        {user?.role === "ADMIN" && (
          <section className="mt-12 grid gap-6 lg:grid-cols-3">
            <NavLink to="/admin-dashboard" className={theme.articleCard + " block"}>
              <ShieldCheck className="mb-4 text-[#8A7650]" size={28} />
              <h2 className={theme.subHeading}>Campaign Reviews</h2>
              <p className={theme.bodySmall + " mt-3"}>
                Approve or reject pending campaigns and inspect uploaded proof files.
              </p>
            </NavLink>
            <div className={theme.articleCard}>
              <Clock className="mb-4 text-[#8A7650]" size={28} />
              <h2 className={theme.subHeading}>Pending Queue</h2>
              <p className={theme.heading2 + " mt-3"}>{pendingCampaigns}</p>
            </div>
            <div className={theme.articleCard}>
              <LayoutDashboard className="mb-4 text-[#8A7650]" size={28} />
              <h2 className={theme.subHeading}>Platform Campaigns</h2>
              <p className={theme.heading2 + " mt-3"}>{campaigns.length}</p>
            </div>
          </section>
        )}

        {user?.role !== "DONOR" && (
          <section className="mt-12">
            <DonationHistory donations={donations} loading={loading} />
          </section>
        )}
      </div>
    </main>
  );
}

export default Profile;
