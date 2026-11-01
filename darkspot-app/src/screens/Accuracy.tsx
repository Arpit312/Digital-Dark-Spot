import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Header, T, Card, Empty, Loading, ErrorBox, FadeIn, StatCard, ProgressBar } from "../ui";
import { useFetch } from "../api";
import { c, r, sp } from "../theme";

export default function Accuracy() {
  const { data, loading, error, reload } = useFetch<any>("/eval/report");
  const empty = data && !data.metrics?.length && !data.ablation?.length;

  return (
    <Screen>
      <Header back eyebrow="ACCURACY" title="Measured results" />

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorBox error={error} retry={reload} />
      ) : empty ? (
        <Empty
          icon="bar-chart-2"
          title="No evaluation yet"
          sub="Results appear after an evaluation run with gold-set benchmarks."
        />
      ) : (
        <View style={{ gap: 16 }}>
          {/* Metrics grid */}
          <FadeIn>
            <T s="eyebrow" style={{ marginBottom: 12 }}>
              CORE METRICS
            </T>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {data?.metrics?.map((m: any) => (
                <StatCard
                  key={m.label}
                  label={m.label}
                  value={m.value}
                  icon={
                    m.label.toLowerCase().includes("precision")
                      ? "target"
                      : m.label.toLowerCase().includes("recall")
                      ? "layers"
                      : m.label.toLowerCase().includes("f1")
                      ? "award"
                      : "activity"
                  }
                  color={
                    m.label.toLowerCase().includes("precision")
                      ? c.accent
                      : m.label.toLowerCase().includes("recall")
                      ? c.info
                      : c.success
                  }
                />
              ))}
            </View>
          </FadeIn>

          {/* Ablation study */}
          {!!data?.ablation?.length && (
            <FadeIn delay={100}>
              <T s="eyebrow" style={{ marginBottom: 12 }}>
                ABLATION STUDY
              </T>
              <Card>
                {data.ablation.map((a: any, idx: number) => (
                  <View
                    key={a.label}
                    style={{
                      marginBottom: idx < data.ablation.length - 1 ? 16 : 0,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <T s="body" style={{ fontSize: 14 }}>
                        {a.label}
                      </T>
                      <T s="body" style={{ fontWeight: "600", color: c.accent }}>
                        {a.value}
                      </T>
                    </View>
                    <ProgressBar
                      progress={Math.min(100, Number(a.value))}
                      color={
                        Number(a.value) >= 80
                          ? c.success
                          : Number(a.value) >= 50
                          ? c.warning
                          : c.danger
                      }
                    />
                  </View>
                ))}
              </Card>
            </FadeIn>
          )}

          {/* By finding type */}
          {!!data?.by_type?.length && (
            <FadeIn delay={200}>
              <T s="eyebrow" style={{ marginBottom: 12 }}>
                BY FINDING TYPE
              </T>
              <Card>
                {/* Header row */}
                <View
                  style={{
                    flexDirection: "row",
                    paddingBottom: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: c.line,
                  }}
                >
                  <T s="sub" style={{ flex: 1 }}>
                    Type
                  </T>
                  <T s="sub" style={{ width: 70, textAlign: "center" }}>
                    Precision
                  </T>
                  <T s="sub" style={{ width: 70, textAlign: "center" }}>
                    Recall
                  </T>
                </View>
                {data.by_type.map((row: any) => (
                  <View
                    key={row.type}
                    style={{
                      flexDirection: "row",
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: c.line,
                      alignItems: "center",
                    }}
                  >
                    <T style={{ flex: 1, textTransform: "capitalize" }}>
                      {row.type}
                    </T>
                    <T
                      s="mono"
                      style={{ width: 70, textAlign: "center", color: c.accent }}
                    >
                      {row.precision}
                    </T>
                    <T
                      s="mono"
                      style={{ width: 70, textAlign: "center", color: c.info }}
                    >
                      {row.recall}
                    </T>
                  </View>
                ))}
              </Card>
            </FadeIn>
          )}

          {!!data?.note && (
            <T s="sub" style={{ textAlign: "center" }}>
              {data.note}
            </T>
          )}
        </View>
      )}
    </Screen>
  );
}
