import React, { useState } from "react";
import { View, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Header, T, Card, Input, Button, Seg, FadeIn, ScaleIn, Badge, GlowCard, Empty, Loading } from "../ui";
import { api, useFetch } from "../api";
import { c, r, sp } from "../theme";

export default function Support({ navigation }: any) {
  const [tab, setTab] = useState("New");
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Bug Report");
  const [priority, setPriority] = useState("Medium");
  const [desc, setDesc] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const tickets = useFetch<any[]>("/support/tickets");

  const submit = async () => {
    if (!subject.trim() || !desc.trim()) {
      Alert.alert("Missing info", "Please fill in subject and description.");
      return;
    }
    setBusy(true);
    try {
      await api("/support/ticket", {
        body: {
          subject: subject.trim(),
          category,
          priority,
          description: desc.trim(),
          source: "app",
        },
      });
      setSent(true);
      setSubject("");
      setDesc("");
      tickets.reload();
    } catch (e: any) {
      Alert.alert("Error", e.message || "Could not submit ticket.");
    } finally {
      setBusy(false);
    }
  };

  const priorityColors: any = {
    Low: c.subtle,
    Medium: c.warning,
    High: c.danger,
    Critical: c.danger,
  };

  const statusColors: any = {
    "In Triage": c.warning,
    "Under Investigation": c.info,
    Resolved: c.success,
    Closed: c.subtle,
  };

  return (
    <Screen>
      <Header
        back
        eyebrow="SUPPORT"
        title="Help & Support"
        right={
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: c.info + "18",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="life-buoy" size={18} color={c.info} />
          </View>
        }
      />

      <Seg
        value={tab}
        onChange={(v: string) => {
          setTab(v);
          if (v === "Tickets") tickets.reload();
        }}
        options={["New", "Tickets", "FAQ"]}
      />

      <View style={{ height: 20 }} />

      {tab === "New" && (
        <FadeIn>
          {sent ? (
            <GlowCard style={{ alignItems: "center", paddingVertical: 32 }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: c.successDim,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Feather name="check" size={28} color={c.success} />
              </View>
              <T s="h" style={{ textAlign: "center" }}>
                Ticket submitted!
              </T>
              <T s="mut" style={{ marginTop: 8, textAlign: "center" }}>
                Our team will respond within the SLA window.{"\n"}Check the
                Tickets tab for updates.
              </T>
              <Button
                ghost
                title="Submit Another"
                onPress={() => setSent(false)}
                style={{ marginTop: 20 }}
              />
            </GlowCard>
          ) : (
            <View style={{ gap: 18 }}>
              {/* Subject */}
              <View>
                <T s="sub" style={{ marginBottom: 6, color: c.muted }}>
                  SUBJECT
                </T>
                <Input
                  placeholder="Brief summary of the issue"
                  value={subject}
                  onChangeText={setSubject}
                />
              </View>

              {/* Category */}
              <View style={{ gap: 8 }}>
                <T s="sub" style={{ color: c.muted }}>
                  CATEGORY
                </T>
                <Seg
                  value={category}
                  onChange={setCategory}
                  options={["Bug Report", "Feature", "Question"]}
                />
              </View>

              {/* Priority */}
              <View style={{ gap: 8 }}>
                <T s="sub" style={{ color: c.muted }}>
                  PRIORITY
                </T>
                <Seg
                  value={priority}
                  onChange={setPriority}
                  options={["Low", "Medium", "High"]}
                />
              </View>

              {/* Description */}
              <View>
                <T s="sub" style={{ marginBottom: 6, color: c.muted }}>
                  DESCRIPTION
                </T>
                <Input
                  multiline
                  placeholder="Describe the issue in detail..."
                  value={desc}
                  onChangeText={setDesc}
                  maxLength={1000}
                />
                <T s="sub" style={{ marginTop: 4, textAlign: "right" }}>
                  {desc.length}/1000
                </T>
              </View>

              <Button
                title="Submit Ticket"
                icon="send"
                onPress={submit}
                loading={busy}
                disabled={!subject.trim() || !desc.trim()}
              />
            </View>
          )}
        </FadeIn>
      )}

      {tab === "Tickets" && (
        <FadeIn>
          {tickets.loading && !tickets.data ? (
            <Loading />
          ) : !tickets.data?.length ? (
            <Empty
              icon="inbox"
              title="No tickets"
              sub="Submit a support ticket to get help."
            />
          ) : (
            <View style={{ gap: 12 }}>
              {tickets.data.map((t: any, idx: number) => (
                <ScaleIn key={t.id} delay={idx * 50}>
                  <Card>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <T s="sub" style={{ color: c.muted }}>
                        {t.id}
                      </T>
                      <Badge color={statusColors[t.status] || c.info}>
                        {t.status}
                      </Badge>
                    </View>
                    <T style={{ fontWeight: "600" }}>{t.subject}</T>
                    <T s="mut" style={{ marginTop: 4 }} numberOfLines={2}>
                      {t.description}
                    </T>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        marginTop: 12,
                      }}
                    >
                      <Badge color={priorityColors[t.priority] || c.subtle}>
                        {t.priority}
                      </Badge>
                      <T s="sub" style={{ flex: 1 }}>
                        {t.created_at}
                      </T>
                      {t.sla && (
                        <T s="sub" style={{ color: c.accent }}>
                          SLA: {t.sla}
                        </T>
                      )}
                    </View>
                  </Card>
                </ScaleIn>
              ))}
            </View>
          )}
        </FadeIn>
      )}

      {tab === "FAQ" && (
        <FadeIn>
          <View style={{ gap: 12 }}>
            {[
              {
                q: "What is DarkSpot Atlas?",
                a: "A multi-agent AI platform that detects gaps, conflicts, and outdated info in public documents — with quote-verified evidence.",
              },
              {
                q: "How accurate are the findings?",
                a: "Every finding requires a verbatim quote match (≥90%). The Evidence Auditor blocks any unverified claims.",
              },
              {
                q: "What file formats are supported?",
                a: "Currently PDF documents. URLs and pasted text content are also supported as sources.",
              },
              {
                q: "Is my data private?",
                a: "Yes. Row-level security protects your data. k-anonymity (k≥10) is applied on aggregated views.",
              },
              {
                q: "How does Campus Mode work?",
                a: "Upload college notices (admission, exam, hostel) and the system scans for gaps and contradictions between them.",
              },
              {
                q: "What is the Watchtower?",
                a: "It monitors tracked URLs for changes and alerts you when content is modified, using SimHash and CUSUM detection.",
              },
            ].map((item, idx) => (
              <ScaleIn key={idx} delay={idx * 40}>
                <Card>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 12,
                      alignItems: "flex-start",
                    }}
                  >
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        backgroundColor: c.accentSoft,
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 2,
                      }}
                    >
                      <T
                        s="sub"
                        style={{
                          color: c.accent,
                          fontWeight: "700",
                          fontSize: 13,
                        }}
                      >
                        Q
                      </T>
                    </View>
                    <View style={{ flex: 1 }}>
                      <T style={{ fontWeight: "600" }}>{item.q}</T>
                      <T s="mut" style={{ marginTop: 6 }}>
                        {item.a}
                      </T>
                    </View>
                  </View>
                </Card>
              </ScaleIn>
            ))}
          </View>
        </FadeIn>
      )}
    </Screen>
  );
}
