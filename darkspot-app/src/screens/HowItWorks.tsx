import React from "react";
import { View } from "react-native";
import { Screen, Header, T, Card, FadeIn } from "../ui";
import { c } from "../theme";
const steps = [["Source Scout", "Ranks sources by trust tier."], ["Extraction", "Turns each source into claims with exact quotes."], ["Normalization", "Dates and amounts become comparable by code."], ["Conflict and Gap", "Compares claims and finds what is expected but missing."], ["Freshness", "Flags expired deadlines and earlier cycles."], ["Challenger", "Tries to refute every finding."], ["Evidence Auditor", "Blocks any finding without a valid quote."], ["Planner", "Ranks what you should verify next."]];
export default function HowItWorks() {
  return (
    <Screen><Header back eyebrow="HOW IT WORKS" title="Eight agents, audited." />
      {steps.map(([t, d], i) => <FadeIn key={t} delay={i * 60} style={{ flexDirection: "row", gap: 14, marginBottom: 20 }}><View style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: c.line2, alignItems: "center", justifyContent: "center" }}><T s="sub">{i + 1}</T></View><View style={{ flex: 1 }}><T s="h" style={{ fontSize: 16 }}>{t}</T><T s="mut" style={{ marginTop: 2 }}>{d}</T></View></FadeIn>)}
      <Card><T s="h">Limits</T><T s="mut" style={{ marginTop: 6 }}>Only the sources you add are reviewed. Findings are potential gaps. Always confirm on the official source.</T></Card>
    </Screen>
  );
}
