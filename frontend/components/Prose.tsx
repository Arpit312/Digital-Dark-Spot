import PageHeader from "./PageHeader";
export default function Prose({ title, sections }: { title: string; sections: string[][] }) {
  return (
    <div>
      <PageHeader title={title} />
      <div className="mx-auto max-w-3xl space-y-8 px-5 py-12">{sections.map(([h, t]) => <section key={h}><h2 className="text-lg font-medium">{h}</h2><p className="mt-2 leading-relaxed text-muted">{t}</p></section>)}</div>
    </div>
  );
}
