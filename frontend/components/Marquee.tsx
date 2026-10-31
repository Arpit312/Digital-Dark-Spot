export default function Marquee({ items }: { items: string[] }) {
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
      <div className="flex w-max animate-marquee gap-3">{[...items, ...items].map((t, i) => <span key={i} className="badge whitespace-nowrap">{t}</span>)}</div>
    </div>
  );
}
