import React from "react";
import { View, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Header, T, Card, Button, Empty, Loading, ErrorBox, dt, FadeIn, ScaleIn, StatCard, Badge } from "../ui";
import { api, useFetch } from "../api";
import { c, r, sp } from "../theme";

export default function Admin() {
  const s = useFetch<any[]>("/admin/stats");
  const q = useFetch<any[]>("/admin/verifications");
  const l = useFetch<any[]>("/admin/audit");

  const act = async (id: string, a: string) => {
    try {
      await api(`/admin/verifications/${id}/${a}`, { method: "POST" });
      q.reload();
      l.reload();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  if (s.error?.status === 403)
    return (
      <Screen>
        <Header back title="Admin" />
        <Empty icon="lock" title="Admins only" sub="You need admin privileges to access this dashboard." />
      </Screen>
    );

  return (
    <Screen
      refresh={{
        refreshing: false,
        onRefresh: () => {
          s.reload();
          q.reload();
          l.reload();
        },
      }}
    >
      <Header
        back
        eyebrow="ADMIN"
        title="Dashboard"
        right={
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: c.danger + "18",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="sliders" size={18} color={c.danger} />
          </View>
        }
      />

      {/* Stats */}
      <FadeIn>
        <T s="eyebrow" style={{ marginBottom: 12 }}>
          PLATFORM STATS
        </T>
        {s.loading ? (
          <Loading />
        ) : s.error ? (
          <ErrorBox error={s.error} retry={s.reload} />
        ) : (
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              marginBottom: 8,
            }}
          >
            {(s.data ?? []).map((x: any, idx: number) => (
              <StatCard
                key={x.label}
                label={x.label}
                value={x.value}
                icon={
                  idx === 0
                    ? "users"
                    : idx === 1
                    ? "file-text"
                    : idx === 2
                    ? "activity"
                    : "database"
                }
                color={
                  idx === 0
                    ? c.accent
                    : idx === 1
                    ? c.info
                    : idx === 2
                    ? c.success
                    : c.warning
                }
              />
            ))}
          </View>
        )}
      </FadeIn>

      {/* Verification Queue */}
      <FadeIn delay={100}>
        <T s="eyebrow" style={{ marginTop: 28, marginBottom: 12 }}>
          VERIFICATION QUEUE
        </T>
        {q.loading ? (
          <Loading />
        ) : !q.data?.length ? (
          <Card style={{ alignItems: "center", paddingVertical: 24 }}>
            <Feather name="check-circle" size={24} color={c.success} />
            <T s="mut" style={{ marginTop: 10, textAlign: "center" }}>
              No pending verification requests
            </T>
          </Card>
        ) : (
          q.data.map((x: any, idx: number) => (
            <ScaleIn key={x.id} delay={idx * 60}>
              <Card style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
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
                    <Feather name="user" size={18} color={c.warning} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <T style={{ fontWeight: "600" }}>{x.name}</T>
                    <T s="sub" style={{ marginTop: 2 }}>
                      {[x.dept, x.email].filter(Boolean).join(" · ")}
                    </T>
                  </View>
                  <Badge color={c.warning}>Pending</Badge>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    marginTop: 14,
                  }}
                >
                  <Button
                    title="Approve"
                    icon="check"
                    onPress={() => act(x.id, "approve")}
                    style={{ flex: 1, height: 42 }}
                    small
                  />
                  <Button
                    ghost
                    danger
                    title="Reject"
                    icon="x"
                    onPress={() => act(x.id, "reject")}
                    style={{ flex: 1, height: 42 }}
                    small
                  />
                </View>
              </Card>
            </ScaleIn>
          ))
        )}
      </FadeIn>

      {/* Audit Log */}
      <FadeIn delay={200}>
        <T s="eyebrow" style={{ marginTop: 28, marginBottom: 12 }}>
          AUDIT LOG
        </T>
        {l.loading ? (
          <Loading />
        ) : !l.data?.length ? (
          <Card style={{ alignItems: "center", paddingVertical: 24 }}>
            <Feather name="list" size={24} color={c.subtle} />
            <T s="mut" style={{ marginTop: 10 }}>
              No activity recorded
            </T>
          </Card>
        ) : (
          <Card style={{ padding: 0 }}>
            {l.data.map((x: any, idx: number) => (
              <View
                key={x.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 14,
                  paddingHorizontal: 16,
                  borderBottomWidth: idx < l.data.length - 1 ? 1 : 0,
                  borderBottomColor: c.line,
                }}
              >
                <T s="mut" style={{ flex: 1 }}>
                  {x.text}
                </T>
                <T s="sub">{dt(x.created_at)}</T>
              </View>
            ))}
          </Card>
        )}
      </FadeIn>
    </Screen>
  );
}
