import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Header, T, Card, Input, Empty, Button, Loading, ErrorBox, Badge, dt, FadeIn, ScaleIn } from "../ui";
import { useFetch } from "../api";
import { c, r, sp } from "../theme";

export default function Reports({ navigation }: any) {
  const { data, loading, error, reload } = useFetch<any[]>("/analyses");
  const [q, setQ] = useState("");

  const list = (data ?? []).filter((r) =>
    (r.question ?? "").toLowerCase().includes(q.toLowerCase())
  );

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 0.8) return c.success;
    if (coverage >= 0.5) return c.warning;
    return c.danger;
  };

  return (
    <Screen
      refresh={{
        refreshing: loading && !!data,
        onRefresh: reload,
      }}
    >
      <Header eyebrow="REPORTS" title="Your reports" />

      {loading && !data ? (
        <Loading />
      ) : error ? (
        <ErrorBox error={error} retry={reload} />
      ) : !data?.length ? (
        <Empty
          icon="file-text"
          title="No reports yet"
          sub="Run an analysis to see your findings here."
          action={
            <Button
              title="New Analysis"
              icon="zap"
              onPress={() => navigation.navigate("Analyze")}
            />
          }
        />
      ) : (
        <FadeIn>
          {/* Search bar */}
          <View style={{ marginBottom: 16, position: "relative" }}>
            <Input
              placeholder="Search reports..."
              value={q}
              onChangeText={setQ}
              style={{ paddingLeft: 44 }}
            />
            <Feather
              name="search"
              size={18}
              color={c.subtle}
              style={{ position: "absolute", left: 14, top: 16 }}
            />
          </View>

          {/* Result count */}
          <T s="sub" style={{ marginBottom: 12 }}>
            {list.length} report{list.length !== 1 ? "s" : ""}
          </T>

          {list.length === 0 ? (
            <Empty icon="search" title="No matches" sub="Try a different search term." />
          ) : (
            <View style={{ gap: 12 }}>
              {list.map((rep, idx) => (
                <ScaleIn key={rep.id} delay={idx * 50}>
                  <Card
                    onPress={() =>
                      navigation.navigate(
                        rep.status && rep.status !== "done"
                          ? "Progress"
                          : "Report",
                        { id: rep.id }
                      )
                    }
                  >
                    {/* Date */}
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <T s="sub">{dt(rep.created_at)}</T>
                      {rep.topic_type && (
                        <Badge>{rep.topic_type}</Badge>
                      )}
                    </View>

                    {/* Title */}
                    <T
                      s="body"
                      style={{ fontWeight: "600", fontSize: 16 }}
                      numberOfLines={2}
                    >
                      {rep.question}
                    </T>

                    {/* Stats row */}
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 14,
                      }}
                    >
                      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                        {rep.status && rep.status !== "done" ? (
                          <Badge color={c.warning}>{rep.status}</Badge>
                        ) : rep.coverage != null ? (
                          <Badge color={getCoverageColor(rep.coverage)}>
                            Coverage {Math.round(rep.coverage * 100)}%
                          </Badge>
                        ) : null}

                        {rep.summary_counts && (
                          <View style={{ flexDirection: "row", gap: 6 }}>
                            {rep.summary_counts.gaps > 0 && (
                              <T s="sub" style={{ color: c.warning }}>
                                {rep.summary_counts.gaps} gaps
                              </T>
                            )}
                            {rep.summary_counts.conflicts > 0 && (
                              <T s="sub" style={{ color: c.danger }}>
                                {rep.summary_counts.conflicts} conflicts
                              </T>
                            )}
                          </View>
                        )}
                      </View>

                      <Feather name="chevron-right" size={18} color={c.subtle} />
                    </View>
                  </Card>
                </ScaleIn>
              ))}
            </View>
          )}
        </FadeIn>
      )}
    </Screen>
  );
}
