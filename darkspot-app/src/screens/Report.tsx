import React, { useState } from "react";
import { View, Pressable, Modal, ScrollView, Linking } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Header, T, Card, Badge, Seg, Empty, Loading, ErrorBox, TypeIcon, FadeIn, ScaleIn, StatCard, ProgressBar, GlowCard } from "../ui";
import { api, useFetch } from "../api";
import { c, r, sp } from "../theme";

const LABEL: any = {
  gap: "Potential gap",
  conflict: "Possible conflict",
  outdated: "Possibly outdated",
  unanswered: "Unanswered",
};
const COLORS: any = {
  gap: c.warning,
  conflict: c.danger,
  outdated: c.info,
  unanswered: c.subtle,
};

export default function Report({ route }: any) {
  const { id } = route.params;
  const { data, loading, error, reload } = useFetch<any>(`/analyses/${id}`);
  const [tab, setTab] = useState("All");
  const [sel, setSel] = useState<any>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});

  if (loading)
    return (
      <Screen>
        <Header back title="Report" />
        <Loading />
      </Screen>
    );
  if (error)
    return (
      <Screen>
        <Header back title="Report" />
        <ErrorBox error={error} retry={reload} />
      </Screen>
    );

  const f: any[] = data?.findings ?? [];
  const cl: any[] = data?.checklist ?? [];
  const n = (t: string[]) => f.filter((x) => t.includes(x.type)).length;
  const list = f.filter(
    (x) =>
      tab === "All" ||
      (tab === "Gaps" && ["gap", "unanswered"].includes(x.type)) ||
      (tab === "Conflicts" && x.type === "conflict") ||
      (tab === "Outdated" && x.type === "outdated")
  );
  const isDone = (x: any) => (x.id in done ? done[x.id] : !!x.done);
  const toggle = async (x: any) => {
    const v = !isDone(x);
    setDone({ ...done, [x.id]: v });
    try {
      await api(`/checklist/${x.id}`, { method: "PATCH", body: { done: v } });
    } catch {
      setDone({ ...done, [x.id]: !v });
    }
  };

  const coverage = data?.coverage != null ? Math.round(data.coverage * 100) : null;

  return (
    <Screen>
      <Header back eyebrow="REPORT" title={data?.question || "Report"} />

      {/* Coverage overview */}
      {coverage != null && (
        <FadeIn>
          <GlowCard style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <T s="mut">Information Coverage</T>
              <T s="h2" style={{ color: c.accent }}>{coverage}%</T>
            </View>
            <ProgressBar progress={coverage} />
            <T s="sub" style={{ marginTop: 8 }}>
              {coverage >= 80
                ? "Good coverage — few gaps detected."
                : coverage >= 50
                ? "Moderate coverage — some important gaps found."
                : "Low coverage — significant gaps detected."}
            </T>
          </GlowCard>
        </FadeIn>
      )}

      {/* Stats grid */}
      <FadeIn delay={100}>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
          <StatCard label="Gaps" value={n(["gap", "unanswered"])} icon="alert-circle" color={c.warning} />
          <StatCard label="Conflicts" value={n(["conflict"])} icon="repeat" color={c.danger} />
          <StatCard label="Outdated" value={n(["outdated"])} icon="clock" color={c.info} />
        </View>
      </FadeIn>

      {/* Tab control */}
      <View style={{ marginBottom: 16 }}>
        <Seg
          value={tab}
          onChange={setTab}
          options={["All", "Gaps", "Conflicts", "Outdated", "Checklist"]}
        />
      </View>

      {/* Findings list */}
      {tab !== "Checklist" ? (
        list.length === 0 ? (
          <Empty
            icon="search"
            title="Nothing here"
            sub="No findings of this type in the sources reviewed."
          />
        ) : (
          <View style={{ gap: 12 }}>
            {list.map((x, i) => (
              <ScaleIn key={x.id} delay={i * 50}>
                <Pressable onPress={() => setSel(x)}>
                  <Card
                    style={{
                      borderLeftWidth: 3,
                      borderLeftColor: COLORS[x.type] || c.line,
                    }}
                  >
                    <View style={{ flexDirection: "row", gap: 12 }}>
                      <TypeIcon type={x.type} />
                      <View style={{ flex: 1 }}>
                        <T s="body" style={{ fontWeight: "600" }}>
                          {x.title}
                        </T>
                        <T s="mut" style={{ marginTop: 6 }}>
                          {x.statement}
                        </T>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                            marginTop: 12,
                            flexWrap: "wrap",
                          }}
                        >
                          <Badge color={COLORS[x.type]}>{LABEL[x.type]}</Badge>
                          <T s="sub" style={{ flex: 1 }}>
                            {x.evidence?.length
                              ? `${x.evidence.length} evidence`
                              : "Not in reviewed sources"}
                          </T>
                          {x.confidence != null && (
                            <Badge>
                              {Math.round(x.confidence * 100)}%
                            </Badge>
                          )}
                        </View>
                      </View>
                    </View>
                  </Card>
                </Pressable>
              </ScaleIn>
            ))}
          </View>
        )
      ) : cl.length === 0 ? (
        <Empty icon="check-square" title="No checklist yet" />
      ) : (
        <View style={{ gap: 8 }}>
          {cl.map((x, i) => (
            <ScaleIn key={x.id} delay={i * 40}>
              <Pressable onPress={() => toggle(x)}>
                <Card
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                    padding: 14,
                  }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 7,
                      borderWidth: 2,
                      borderColor: isDone(x) ? c.accent : c.line2,
                      backgroundColor: isDone(x) ? c.accent : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isDone(x) && (
                      <Feather name="check" size={14} color={c.bg} />
                    )}
                  </View>
                  <T
                    style={{
                      flex: 1,
                      color: isDone(x) ? c.subtle : c.fg,
                      textDecorationLine: isDone(x) ? "line-through" : "none",
                    }}
                  >
                    {x.text}
                  </T>
                  {(x.priority || x.p) && (
                    <Badge
                      color={
                        (x.priority || x.p) === "High"
                          ? c.danger
                          : (x.priority || x.p) === "Medium"
                          ? c.warning
                          : c.subtle
                      }
                    >
                      {x.priority || x.p}
                    </Badge>
                  )}
                </Card>
              </Pressable>
            </ScaleIn>
          ))}
        </View>
      )}

      <T s="sub" style={{ marginTop: 28, textAlign: "center" }}>
        AI findings are potential gaps, not guaranteed facts.{"\n"}Verify on the official source.
      </T>

      {/* Evidence bottom sheet modal */}
      <Modal
        visible={!!sel}
        animationType="slide"
        transparent
        onRequestClose={() => setSel(null)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,.7)" }}
          onPress={() => setSel(null)}
        />
        <View
          style={{
            maxHeight: "75%",
            backgroundColor: c.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            borderWidth: 1,
            borderColor: c.line,
            padding: 20,
          }}
        >
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: c.line2,
              alignSelf: "center",
              marginBottom: 16,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <T s="eyebrow">EVIDENCE</T>
            <Pressable onPress={() => setSel(null)} hitSlop={12}>
              <Feather name="x" size={20} color={c.fg} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <T s="h">{sel?.title}</T>
            <T s="mut" style={{ marginTop: 6 }}>
              {sel?.statement}
            </T>

            {!sel?.evidence?.length && (
              <Card style={{ marginTop: 16 }}>
                <Feather
                  name="alert-circle"
                  size={18}
                  color={c.subtle}
                  style={{ marginBottom: 8 }}
                />
                <T s="mut">
                  Not found in the sources reviewed.{"\n"}Check the latest official notice.
                </T>
              </Card>
            )}

            {sel?.evidence?.map((e: any, i: number) => (
              <View key={i} style={{ marginTop: 16 }}>
                <Card style={{ backgroundColor: c.card }}>
                  <T s="mono" style={{ color: c.fg }}>
                    "{e.quote}"
                  </T>
                </Card>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 8,
                    gap: 8,
                  }}
                >
                  <T s="sub" style={{ flex: 1 }}>
                    {[
                      e.source,
                      e.tier != null && `Tier ${e.tier}`,
                      e.location,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </T>
                  {!!e.url && (
                    <Pressable
                      onPress={() => Linking.openURL(e.url)}
                      style={{
                        backgroundColor: c.accentSoft,
                        paddingHorizontal: 12,
                        paddingVertical: 6,
                        borderRadius: r.sm,
                      }}
                    >
                      <T s="sub" style={{ color: c.accent, fontWeight: "600" }}>
                        Open ↗
                      </T>
                    </Pressable>
                  )}
                </View>
              </View>
            ))}

            <View style={{ height: 24 }} />
          </ScrollView>
        </View>
      </Modal>
    </Screen>
  );
}
