import { NavLink } from "react-router-dom";
import * as theme from "../styles/Common";

function Footer() {
  const currentYear = new Date().getFullYear();
  const linkClass = "hover:text-white transition-colors";

  return (
    <footer className="border-t-4 border-[#DBCEA5] bg-[#4F412B] text-white shadow-[0_-10px_24px_rgba(79,65,43,0.12)]">
      <div className={theme.pageWrapper + " py-16"}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-[#ECE7D1] mb-4 uppercase tracking-wider">
              CrowdFund
            </h2>
            <p className="text-[#ECE7D1]/85 text-sm leading-relaxed">
              Empowering dreams through collective generosity. Together we create meaningful change and transform lives.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-lg text-white">Quick Links</h3>
            <ul className="space-y-2 text-sm text-[#ECE7D1]/85">
              <li><NavLink to="/" className={linkClass}>Home</NavLink></li>
              <li><NavLink to="/campaigns" className={linkClass}>Campaigns</NavLink></li>
              <li><NavLink to="/register" className={linkClass}>Start Fundraising</NavLink></li>
              <li><NavLink to="/how-it-works" className={linkClass}>How it Works</NavLink></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-lg text-white">Support</h3>
            <ul className="space-y-2 text-sm text-[#ECE7D1]/85">
              <li><NavLink to="/help-center" className={linkClass}>Help Center</NavLink></li>
              <li><NavLink to="/privacy-policy" className={linkClass}>Privacy Policy</NavLink></li>
              <li><NavLink to="/terms-conditions" className={linkClass}>Terms & Conditions</NavLink></li>
              <li><NavLink to="/contact" className={linkClass}>Contact Us</NavLink></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-lg text-white">Contact</h3>
            <p className="text-[#ECE7D1]/85 text-sm mb-2">Email</p>
            <p className="text-white font-medium mb-4">support@crowdfund.com</p>
            <NavLink to="/contact" className="text-sm font-semibold text-[#DBCEA5] hover:text-white transition-colors">
              Contact support
            </NavLink>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#DBCEA5]/35 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#ECE7D1]/85">
            © {currentYear} CrowdFund. All rights reserved.
          </p>
          <p className="text-sm text-[#ECE7D1]/85">Built for donors and fundraisers</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
