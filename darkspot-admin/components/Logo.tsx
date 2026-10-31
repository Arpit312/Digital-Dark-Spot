export default function Logo({ small }: { small?: boolean }) {
  return (<span className="flex items-center gap-2.5"><svg width="24" height="24" viewBox="0 0 48 48" fill="none" aria-hidden="true"><circle cx="24" cy="24" r="16" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="78 22.5" transform="rotate(-55 24 24)" /><circle cx="24" cy="24" r="4.5" fill="#fff" /></svg>{!small && <span className="text-[15px] font-semibold tracking-tight">DarkSpot <span className="text-muted">Admin</span></span>}</span>);
}
