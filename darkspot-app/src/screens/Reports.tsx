import React, { useState } from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Header, T, Card, Input, Empty, Button, Loading, ErrorBox, Badge, dt } from "../ui";
import { useFetch } from "../api";
import { c } from "../theme";
export default function Reports({ navigation }: any) {
  const { data, loading, error, reload } = useFetch<any[]>("/analyses"); const [q, setQ] = useState("");
  const list = (data ?? []).filter((r) => (r.question ?? "").toLowerCase().includes(q.toLowerCase()));
  return (
    <Screen refresh={{ refreshing: loading && !!data, onRefresh: reload }}><Header eyebrow="REPORTS" title="Your reports" />
      {loading && !data ? <Loading /> : error ? <ErrorBox error={error} retry={reload} /> : !data?.length ? <Empty icon="file-text" title="No reports yet" sub="Run an analysis to see it here." action={<Button title="New analysis" onPress={() => navigation.navigate("Analyze")} />} /> : <>
        <Input placeholder="Search reports" value={q} onChangeText={setQ} style={{ marginBottom: 16 }} />
        {list.length === 0 ? <Empty icon="search" title="No matches" /> : <View style={{ gap: 10 }}>{list.map((r) => <Card key={r.id} onPress={() => navigation.navigate(r.status && r.status !== "done" ? "Progress" : "Report", { id: r.id })}>
          <T s="sub">{dt(r.created_at)}</T><T s="h" style={{ marginTop: 6, fontSize: 16 }} numberOfLines={2}>{r.question}</T>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>{r.status && r.status !== "done" ? <Badge>{r.status}</Badge> : <T s="sub">{r.coverage != null ? `Coverage ${Math.round(r.coverage * 100)}%` : ""}</T>}<Feather name="chevron-right" size={16} color={c.subtle} /></View></Card>)}</View>}</>}
    </Screen>
  );
}
