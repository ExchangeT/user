export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--canvas)] flex">
      {/* Left column — branding */}
      <div className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between p-10 bg-[var(--panel)] border-r border-[var(--line)] flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[var(--brand)] rounded-lg flex items-center justify-center">
            <span className="text-[var(--brand-fg)] font-black text-sm">CC</span>
          </div>
          <span className="text-base font-extrabold text-[var(--ink-1)]">
            Cric<span className="text-[var(--brand)]">Chain</span>
          </span>
        </div>

        {/* Main pitch */}
        <div>
          <p className="text-xs font-semibold text-[var(--brand)] uppercase tracking-widest mb-4">
            Prediction Markets
          </p>
          <h2 className="text-3xl font-bold text-[var(--ink-1)] leading-tight mb-5">
            Institutional-grade cricket prediction markets
          </h2>
          <p className="text-sm text-[var(--ink-2)] leading-relaxed mb-8">
            Trade prediction markets across IPL, T20 World Cup, and international cricket powered by on-chain settlement and real-time AI odds.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { value: "12Cr+", label: "Total Volume" },
              { value: "85K+",   label: "Active Users" },
              { value: "99.9%",  label: "Uptime" },
              { value: "3s",     label: "Settlement" },
            ].map((s) => (
              <div key={s.label} className="p-3 bg-[var(--panel-raised)] rounded-lg border border-[var(--line)]">
                <p className="font-mono font-bold text-lg text-[var(--ink-1)]">
                  {s.value === "12Cr+" ? "₹" + s.value : s.value === "3s" ? "< " + s.value : s.value}
                </p>
                <p className="text-xs text-[var(--ink-3)] font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[var(--ink-3)]">
          &#169; 2026 CricChain &middot; Decentralized &middot; Non-Custodial
        </p>
      </div>

      {/* Right column — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
