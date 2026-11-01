import React, { useState } from "react";
import { View, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Header, T, Card, Input, Button, Seg, Empty, Loading, ErrorBox, dt, FadeIn, ScaleIn, Badge } from "../ui";
import { api, useFetch } from "../api";
import { c, r, sp } from "../theme";

export default function Watchtower() {
  const w = useFetch<any[]>("/watch");
  const a = useFetch<any[]>("/alerts");
  const [tab, setTab] = useState("Alerts");
  const [url, setUrl] = useState("");
  const [freq, setFreq] = useState("Daily");
  const [busy, setBusy] = useState(false);

  const add = async () => {
    setBusy(true);
    try {
      await api("/watch", {
        body: { url: url.trim(), frequency: freq.toLowerCase() },
      });
      setUrl("");
      w.reload();
    } catch (e: any) {
      Alert.alert("Could not track", e.message);
    } finally {
      setBusy(false);
    }
  };

  const del = (id: string) =>
    Alert.alert("Stop tracking?", "This source will no longer be monitored.", [
      { text: "Cancel" },
      {
        text: "Stop",
        style: "destructive",
        onPress: async () => {
          try {
            await api(`/watch/${id}`, { method: "DELETE" });
            w.reload();
          } catch (e: any) {
            Alert.alert("Error", e.message);
          }
        },
      },
    ]);

  const cur = tab === "Alerts" ? a : w;

  return (
    <Screen
      refresh={{
        refreshing: false,
        onRefresh: () => {
          w.reload();
          a.reload();
        },
      }}
    >
      <Header
        eyebrow="WATCHTOWER"
        title="Source changes"
        right={
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: c.warningDim,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="radio" size={18} color={c.warning} />
          </View>
        }
      />

      <Seg value={tab} onChange={setTab} options={["Alerts", "Tracked"]} />

      <View style={{ height: 16 }} />

      {/* Add tracking form */}
      {tab === "Tracked" && (
        <FadeIn>
          <Card style={{ marginBottom: 16, gap: 12 }}>
            <T s="body" style={{ fontWeight: "600" }}>
              Track a new source
            </T>
            <Input
              placeholder="https://official-portal.gov.in/..."
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
            />
            <Seg
              value={freq}
              onChange={setFreq}
              options={["Hourly", "Daily", "Weekly"]}
            />
            <Button
              icon="plus"
              title="Track Source"
              onPress={add}
              loading={busy}
              disabled={!url.trim()}
            />
          </Card>
        </FadeIn>
      )}

      {/* Content */}
      {cur.loading && !cur.data ? (
        <Loading />
      ) : cur.error ? (
        <ErrorBox error={cur.error} retry={cur.reload} />
      ) : !cur.data?.length ? (
        <Empty
          icon={tab === "Alerts" ? "bell" : "eye"}
          title={tab === "Alerts" ? "No alerts yet" : "Nothing tracked yet"}
          sub={
            tab === "Alerts"
              ? "Alerts will appear when tracked sources change."
              : "Add a URL above to start monitoring it."
          }
        />
      ) : (
        <View style={{ gap: 12 }}>
          {tab === "Alerts"
            ? cur.data.map((x: any, idx: number) => (
                <ScaleIn key={x.id} delay={idx * 50}>
                  <Card>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <Badge color={c.warning}>Change detected</Badge>
                      <T s="sub">{dt(x.created_at)}</T>
                    </View>
                    <T s="body" style={{ fontWeight: "600" }}>
                      {x.title}
                    </T>
                    <T s="sub" style={{ marginTop: 4 }}>
                      {x.source}
                    </T>

                    {/* Diff view */}
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        marginTop: 14,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          borderWidth: 1,
                          borderColor: c.danger + "30",
                          backgroundColor: c.dangerDim,
                          borderRadius: r.md,
                          padding: 10,
                        }}
                      >
                        <T s="sub" style={{ color: c.danger, marginBottom: 4 }}>
                          Before
                        </T>
                        <T
                          s="mono"
                          style={{
                            color: c.subtle,
                            textDecorationLine: "line-through",
                            fontSize: 12,
                          }}
                        >
                          {x.before}
                        </T>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          borderWidth: 1,
                          borderColor: c.accent + "30",
                          backgroundColor: c.accentSoft,
                          borderRadius: r.md,
                          padding: 10,
                        }}
                      >
                        <T s="sub" style={{ color: c.accent, marginBottom: 4 }}>
                          After
                        </T>
                        <T s="mono" style={{ fontSize: 12 }}>
                          {x.after}
                        </T>
                      </View>
                    </View>
                  </Card>
                </ScaleIn>
              ))
            : cur.data.map((x: any, idx: number) => (
                <ScaleIn key={x.id} delay={idx * 50}>
                  <Card
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        backgroundColor: c.accentSoft,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Feather name="eye" size={18} color={c.accent} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <T numberOfLines={1}>{x.url}</T>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                          marginTop: 4,
                        }}
                      >
                        <Badge>{x.frequency}</Badge>
                        {x.last_checked && (
                          <T s="sub">Checked {dt(x.last_checked)}</T>
                        )}
                      </View>
                    </View>
                    <Pressable
                      onPress={() => del(x.id)}
                      hitSlop={10}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        backgroundColor: c.dangerDim,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Feather name="trash-2" size={14} color={c.danger} />
                    </Pressable>
                  </Card>
                </ScaleIn>
              ))}
        </View>
      )}
    </Screen>
  );
}
