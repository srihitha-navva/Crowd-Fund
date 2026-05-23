import { NavLink } from "react-router-dom";
import { useAuth } from "../store/authStore";
import * as theme from "../styles/Common";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);

  const getProfilePath = () => {
    if (!user) return "/";
    switch (user.role) {
      case "DONOR":
        return "/donor-profile";
      case "ADMIN":
        return "/admin-profile";
      case "FUNDRAISER":
        return "/fundraiser-profile";
      default:
        return "/";
    }
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    isActive ? theme.navLinkActive : theme.navLink;

  return (
    <header className={theme.navbar}>
      <div className={theme.navContainer}>
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-black text-[#8A7650] tracking-wide uppercase"
        >
          CrowdFund
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/campaigns" className={navLinkClass}>
            Campaigns
          </NavLink>
          {isAuthenticated && user?.role === "FUNDRAISER" && (
            <NavLink to="/fundraising" className={navLinkClass}>
              Create Campaign
            </NavLink>
          )}
          {isAuthenticated && user?.role === "ADMIN" && (
            <NavLink to="/admin-dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {!isAuthenticated ? (
            <>
              <NavLink to="/login" className={theme.btnSecondary}>
                Sign In
              </NavLink>
              <NavLink to="/register" className={theme.btnPrimary}>
                Get Started
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to={getProfilePath()} className={theme.btnTertiary}>
                Profile
              </NavLink>
              <img
                src={user?.profileImage || "https://i.pravatar.cc/100?u=" + user?.email}
                alt="profile"
                className="w-9 h-9 rounded-full object-cover border-2 border-[#DBCEA5]"
              />
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-[#665A44] hover:text-[#8A7650] hover:bg-[#DBCEA5] rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg text-[#8A7650] hover:bg-[#DBCEA5] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <X size={24} className="text-[#8A7650]" />
          ) : (
            <Menu size={24} className="text-[#8A7650]" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#DBCEA5]/80 bg-white p-4 space-y-3 shadow-lg">
          <NavLink
            to="/"
            className={"block " + theme.navLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/campaigns"
            className={"block " + theme.navLink}
            onClick={() => setMobileMenuOpen(false)}
          >
            Campaigns
          </NavLink>
          {isAuthenticated && user?.role === "FUNDRAISER" && (
            <NavLink
              to="/fundraising"
              className={"block " + theme.navLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              Create Campaign
            </NavLink>
          )}
          {isAuthenticated && user?.role === "ADMIN" && (
            <NavLink
              to="/admin-dashboard"
              className={"block " + theme.navLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
          )}
          <div className="border-t border-[#DBCEA5]/80 pt-3 space-y-2">
            {!isAuthenticated ? (
              <>
                <NavLink
                  to="/login"
                  className={"w-full " + theme.btnSecondary}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className={"w-full " + theme.btnPrimary}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to={getProfilePath()}
                  className={"w-full " + theme.btnTertiary}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
