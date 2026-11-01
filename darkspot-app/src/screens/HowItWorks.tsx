import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Header, T, Card, FadeIn, GlowCard } from "../ui";
import { c, r, sp } from "../theme";

const steps = [
  { icon: "globe", title: "Source Scout", desc: "Ranks sources by trust tier using domain authority, freshness, and quality signals.", color: c.accent },
  { icon: "type", title: "Extraction", desc: "Turns each source into exact claims with verbatim quotes (≥90% match threshold).", color: c.info },
  { icon: "hash", title: "Normalization", desc: "Converts dates, amounts, and conditions into comparable structured data.", color: c.grad2 },
  { icon: "repeat", title: "Conflict Detector", desc: "Compares claims across sources and flags contradictions with severity scoring.", color: c.danger },
  { icon: "alert-circle", title: "Gap Finder", desc: "Identifies expected information that is missing from all reviewed sources.", color: c.warning },
  { icon: "clock", title: "Freshness Radar", desc: "Flags expired deadlines, superseded circulars, and outdated cycle references.", color: c.info },
  { icon: "shield", title: "Challenger Agent", desc: "Adversarial check — tries to refute every finding using Bayesian log-odds.", color: c.grad4 },
  { icon: "check-square", title: "Evidence Auditor", desc: "Blocks any finding without a valid source quote. No evidence = abstain.", color: c.success },
];

export default function HowItWorks() {
  return (
    <Screen>
      <Header back eyebrow="HOW IT WORKS" title="Eight agents, audited." />

      <T s="mut" style={{ marginBottom: 24, lineHeight: 20 }}>
        DarkSpot Atlas uses an 8-agent pipeline. Each agent has a specific role,
        and the Evidence Auditor ensures no hallucinated findings pass through.
      </T>

      {steps.map((step, i) => (
        <FadeIn key={step.title} delay={i * 60} style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", gap: 14 }}>
            {/* Step number + icon */}
            <View style={{ alignItems: "center", gap: 4 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: step.color + "18",
                  borderWidth: 1,
                  borderColor: step.color + "30",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Feather name={step.icon as any} size={18} color={step.color} />
              </View>
              {i < steps.length - 1 && (
                <View
                  style={{
                    width: 2,
                    height: 20,
                    backgroundColor: c.line,
                    borderRadius: 1,
                  }}
                />
              )}
            </View>

            {/* Content */}
            <View style={{ flex: 1, paddingTop: 2 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <T s="body" style={{ fontWeight: "600" }}>
                  {step.title}
                </T>
                <T s="sub" style={{ color: step.color }}>
                  {i + 1}/8
                </T>
              </View>
              <T s="mut" style={{ marginTop: 4 }}>
                {step.desc}
              </T>
            </View>
          </View>
        </FadeIn>
      ))}

      <FadeIn delay={500}>
        <GlowCard style={{ marginTop: 8 }}>
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <Feather name="info" size={18} color={c.accent} />
            <View style={{ flex: 1 }}>
              <T s="body" style={{ fontWeight: "600" }}>
                Important Limits
              </T>
              <T s="mut" style={{ marginTop: 4 }}>
                Only the sources you add are reviewed. Findings are potential gaps.
                Always confirm on the official source before taking action.
              </T>
            </View>
          </View>
        </GlowCard>
      </FadeIn>
    </Screen>
  );
}
