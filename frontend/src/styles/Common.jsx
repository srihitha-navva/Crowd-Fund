// src/styles/aestheticTheme.js
// Theme: warm earthy neutrals with sage support

// ─── Layout ───────────────────────────────────────────
export const pageBackground = "bg-[#ECE7D1]/45 min-h-screen";
export const pageWrapper = "max-w-7xl mx-auto px-6 py-16";
export const section = "mb-20";

// ─── Navigation ───────────────────────────────────────
export const navbar = "border-b border-[#DBCEA5]/80 bg-[#ECE7D1]/95 backdrop-blur sticky top-0 z-50 shadow-sm";
export const navContainer = "max-w-7xl mx-auto px-6 py-4 flex items-center justify-between";
export const navBrand = "text-2xl font-bold tracking-wider text-[#8A7650] uppercase letter-spacing-1";
export const navLinks = "flex items-center gap-8";
export const navLink = "text-sm font-semibold text-[#665A44] hover:text-[#8A7650] transition-colors duration-300";
export const navLinkActive = "text-sm font-bold text-[#8A7650] border-b-2 border-[#8A7650]";

// ─── Cards ────────────────────────────────────────────
export const card = "bg-white border border-[#DBCEA5]/80 rounded-lg p-6 hover:shadow-md transition-all duration-300 cursor-pointer hover:border-[#8E977D]";
export const campaignCard = "bg-white rounded-lg overflow-hidden border border-[#DBCEA5]/80 hover:shadow-lg transition-all duration-300 hover:border-[#8E977D]";
export const articleCard = "bg-white border border-[#DBCEA5]/80 rounded-lg p-6 hover:shadow-md transition-all duration-300";
export const articleTitle = "text-lg font-semibold text-[#3D3324] leading-snug";
export const articleExcerpt = "text-sm text-[#675F4D] leading-relaxed";
export const articleMeta = "text-xs uppercase tracking-widest text-[#665A44]";
export const emptyState = "rounded-lg border border-dashed border-[#8E977D] bg-[#ECE7D1]/75 px-8 py-12 text-center text-sm text-[#665A44]";
export const statusActive = "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700";
export const statusPending = "inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700";
export const statusRejected = "inline-flex rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700";

// ─── Typography ───────────────────────────────────────
export const pageTitle = "text-5xl md:text-6xl font-bold text-[#3D3324] tracking-tight leading-tight mb-4";
export const heading = "text-3xl font-semibold text-[#3D3324] tracking-tight";
export const subHeading = "text-xl font-medium text-[#3D3324] tracking-tight";
export const heading2 = "text-2xl font-semibold text-[#3D3324]";
export const body = "text-[#514631] leading-relaxed text-base";
export const bodySmall = "text-sm text-[#675F4D] leading-relaxed";
export const muted = "text-sm text-[#665A44]";
export const link = "text-[#8A7650] font-semibold hover:text-[#665A44] transition-colors";

// ─── Buttons ──────────────────────────────────────────
export const btnPrimary = "inline-flex items-center justify-center bg-[#8A7650] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#6F5F40] focus:outline-none focus:ring-2 focus:ring-[#8A7650]/30 transition-all duration-300 text-sm shadow-sm hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60";
export const btnSecondary = "inline-flex items-center justify-center border-2 border-[#8A7650] bg-white text-[#6F5F40] font-bold px-8 py-3 rounded-lg hover:bg-[#ECE7D1] focus:outline-none focus:ring-2 focus:ring-[#8A7650]/25 transition-all duration-300 text-sm";
export const btnOnDark = "inline-flex items-center justify-center bg-[#ECE7D1] text-[#3D3324] font-bold px-8 py-3 rounded-lg hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#ECE7D1]/60 transition-all duration-300 text-sm shadow-sm";
export const btnOutlineOnDark = "inline-flex items-center justify-center border-2 border-[#ECE7D1] text-[#ECE7D1] font-bold px-8 py-3 rounded-lg hover:bg-[#ECE7D1] hover:text-[#3D3324] focus:outline-none focus:ring-2 focus:ring-[#ECE7D1]/60 transition-all duration-300 text-sm";
export const btnTertiary = "inline-flex items-center justify-center bg-[#DBCEA5] text-[#3D3324] font-semibold px-6 py-2.5 rounded-lg hover:bg-[#8A7650] hover:text-white transition-all duration-300 text-sm";
export const btnGhost = "text-[#8A7650] font-semibold hover:text-[#665A44] transition-colors text-sm";
export const btnDanger = "bg-rose-500 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-rose-600 transition-all text-sm";

// ─── Forms ────────────────────────────────────────────
export const formCard = "bg-white rounded-lg p-8 md:p-10 max-w-2xl mx-auto border border-[#DBCEA5]/90 shadow-sm";
export const formTitle = "text-3xl font-bold text-[#3D3324] text-center mb-3";
export const label = "text-sm font-semibold text-[#8A7650] mb-2 block";
export const input = "w-full bg-[#FBF8EC] border border-[#DBCEA5] rounded-lg px-4 py-3 text-[#3D3324] text-sm placeholder:text-[#8E977D] focus:outline-none focus:border-[#8A7650] focus:ring-2 focus:ring-[#8A7650]/20 transition-all";
export const textarea = "w-full bg-[#FBF8EC] border border-[#DBCEA5] rounded-lg px-4 py-3 text-[#3D3324] text-sm placeholder:text-[#8E977D] focus:outline-none focus:border-[#8A7650] focus:ring-2 focus:ring-[#8A7650]/20 transition-all resize-none";
export const formGroup = "mb-6";
export const divider = "border-t border-[#DBCEA5]/80 my-6";
export const error = "text-xs text-rose-600 mt-1 font-medium";
export const success = "text-xs text-emerald-600 mt-1 font-medium";
export const submit = "w-full bg-[#8A7650] text-white font-bold py-3 rounded-lg hover:bg-[#6F5F40] transition-all duration-300 mt-4 text-sm shadow-sm disabled:cursor-not-allowed disabled:opacity-60";
export const loading = "text-sm text-[#665A44] mt-4 text-center animate-pulse";

// ─── Campaign Listing ──────────────────────────────────
export const campaignGrid = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
export const campaignImage = "w-full h-48 object-cover bg-[#ECE7D1]";
export const campaignMeta = "text-xs uppercase tracking-widest text-[#665A44] font-semibold";
export const campaignAmount = "text-2xl font-bold text-[#8A7650]";
export const progressBar = "bg-[#DBCEA5] rounded-full h-2 overflow-hidden";
export const progressFill = "bg-[#8E977D] h-full transition-all duration-500";
