import { NavLink } from "react-router-dom";
import { ListChecks, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import * as theme from "../styles/Common";

const pages = {
  how: {
    eyebrow: "How it works",
    title: "A simple way to start, share, and support campaigns.",
    body: "CrowdFund keeps the process clear for fundraisers and donors. Create a campaign, tell the story, share it with your community, and track support as donations come in.",
    items: [
      "Create a campaign with a goal, category, story, and deadline.",
      "Our team reviews campaigns before they appear publicly.",
      "Supporters browse approved campaigns and donate securely.",
      "Fundraisers track progress from their profile page.",
    ],
    icon: ListChecks,
    action: { to: "/register", label: "Start Fundraising" },
  },
  help: {
    eyebrow: "Help center",
    title: "Find quick answers for using CrowdFund.",
    body: "Use this support area for common questions about creating campaigns, donating, approvals, and account access.",
    items: [
      "Campaign approvals are handled by the admin team.",
      "Donors can view their donation history from their profile.",
      "Fundraisers can manage their campaigns from their profile.",
      "For login or account issues, contact support directly.",
    ],
    icon: MessageCircle,
    action: { to: "/contact", label: "Contact Support" },
  },
  privacy: {
    eyebrow: "Privacy policy",
    title: "Your information stays focused on your account and campaigns.",
    body: "CrowdFund collects only the details needed to create accounts, manage campaigns, process donations, and provide support.",
    items: [
      "Account details are used for authentication and profile access.",
      "Campaign data is shown publicly only after approval.",
      "Donation records are available to the donor and platform admins.",
      "We do not add unrelated tracking or marketing pages here.",
    ],
    icon: ShieldCheck,
    action: { to: "/contact", label: "Ask a Question" },
  },
  terms: {
    eyebrow: "Terms & conditions",
    title: "Clear rules keep campaigns trustworthy.",
    body: "By using CrowdFund, users agree to submit truthful campaign information, respect donors, and use the platform for genuine causes.",
    items: [
      "Fundraisers are responsible for accurate campaign details.",
      "Admins may approve, reject, or remove campaigns when needed.",
      "Donors should review campaign details before contributing.",
      "Users should not misuse account, campaign, or donation features.",
    ],
    icon: ShieldCheck,
    action: { to: "/register", label: "Create Account" },
  },
  contact: {
    eyebrow: "Contact us",
    title: "Need help? Send your question to support.",
    body: "For account access, campaign reviews, donation questions, or technical support, reach the CrowdFund team.",
    items: [
      "Email: support@crowdfund.com",
      "Support hours: 24/7 for urgent platform issues.",
      "Include your account email and campaign name when relevant.",
      "We will guide you to the right next step.",
    ],
    icon: Mail,
    action: { to: "/help-center", label: "Visit Help Center" },
  },
};

function InfoPage({ type }) {
  const page = pages[type];
  const Icon = page.icon;

  return (
    <main className={theme.pageBackground}>
      <section className={theme.pageWrapper}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-lg bg-[#ECE7D1] px-4 py-2 text-sm font-semibold text-[#8A7650]">
            <Icon size={18} />
            {page.eyebrow}
          </div>
          <h1 className={theme.pageTitle}>{page.title}</h1>
          <p className={theme.body + " max-w-3xl"}>{page.body}</p>

          <div className="mt-10 grid gap-4">
            {page.items.map((item) => (
              <div key={item} className="rounded-lg border border-[#DBCEA5] bg-white p-5 text-[#514631] shadow-sm">
                {item}
              </div>
            ))}
          </div>

          <div className="mt-10">
            <NavLink to={page.action.to} className={theme.btnPrimary}>
              {page.action.label}
            </NavLink>
          </div>
        </div>
      </section>
    </main>
  );
}

export function HowItWorks() {
  return <InfoPage type="how" />;
}

export function HelpCenter() {
  return <InfoPage type="help" />;
}

export function PrivacyPolicy() {
  return <InfoPage type="privacy" />;
}

export function TermsConditions() {
  return <InfoPage type="terms" />;
}

export function ContactUs() {
  return <InfoPage type="contact" />;
}
