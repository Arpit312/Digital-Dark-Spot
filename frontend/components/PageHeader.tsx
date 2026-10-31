import Reveal from "./Reveal";
export default function PageHeader({ eyebrow, title, sub, children }: { eyebrow?: string; title: string; sub?: string; children?: React.ReactNode }) {
  return (
    <div className="relative border-b border-line">
      <div className="dot-grid absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-6xl px-5 py-14">
        <Reveal y={12}>
          {eyebrow && <div className="mb-3 text-xs font-semibold tracking-widest text-subtle">{eyebrow}</div>}
          <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
          {sub && <p className="mt-3 max-w-2xl text-muted">{sub}</p>}
          {children}
        </Reveal>
      </div>
    </div>
  );
}
