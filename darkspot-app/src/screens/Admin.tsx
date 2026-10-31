import React from "react";
import { View, Alert } from "react-native";
import { Screen, Header, T, Card, Button, Empty, Loading, ErrorBox, dt } from "../ui";
import { api, useFetch } from "../api";
import { c } from "../theme";
export default function Admin() {
  const s = useFetch<any[]>("/admin/stats"), q = useFetch<any[]>("/admin/verifications"), l = useFetch<any[]>("/admin/audit");
  const act = async (id: string, a: string) => { try { await api(`/admin/verifications/${id}/${a}`, { method: "POST" }); q.reload(); l.reload(); } catch (e: any) { Alert.alert("Error", e.message); } };
  if (s.error?.status === 403) return <Screen><Header back title="Admin" /><Empty icon="lock" title="Admins only" /></Screen>;
  return (
    <Screen refresh={{ refreshing: false, onRefresh: () => { s.reload(); q.reload(); l.reload(); } }}><Header back eyebrow="ADMIN" title="Dashboard" />
      {s.loading ? <Loading /> : s.error ? <ErrorBox error={s.error} retry={s.reload} /> : <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{(s.data ?? []).map((x) => <Card key={x.label} style={{ flexGrow: 1, minWidth: "45%" }}><T s="sub">{x.label}</T><T s="h" style={{ fontSize: 24, marginTop: 4 }}>{x.value}</T></Card>)}</View>}
      <T s="eyebrow" style={{ marginTop: 28, marginBottom: 10 }}>VERIFICATION QUEUE</T>
      {q.loading ? <Loading /> : !q.data?.length ? <Empty icon="user-check" title="No pending requests" /> : q.data.map((x) => <Card key={x.id} style={{ marginBottom: 10 }}><T>{x.name}</T><T s="sub" style={{ marginTop: 2 }}>{[x.dept, x.email].filter(Boolean).join(" · ")}</T><View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}><Button title="Approve" onPress={() => act(x.id, "approve")} style={{ flex: 1, height: 40 }} /><Button ghost title="Reject" onPress={() => act(x.id, "reject")} style={{ flex: 1, height: 40 }} /></View></Card>)}
      <T s="eyebrow" style={{ marginTop: 28, marginBottom: 10 }}>AUDIT LOG</T>
      {l.loading ? <Loading /> : !l.data?.length ? <Empty icon="list" title="No activity" /> : l.data.map((x) => <View key={x.id} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: c.line }}><T s="mut" style={{ flex: 1 }}>{x.text}</T><T s="sub">{dt(x.created_at)}</T></View>)}
    </Screen>
  );
}
