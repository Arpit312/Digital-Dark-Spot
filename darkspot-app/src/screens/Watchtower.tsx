import React, { useState } from "react";
import { View, Pressable, Alert } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Header, T, Card, Input, Button, Seg, Empty, Loading, ErrorBox, dt } from "../ui";
import { api, useFetch } from "../api";
import { c } from "../theme";
export default function Watchtower() {
  const w = useFetch<any[]>("/watch"), a = useFetch<any[]>("/alerts");
  const [tab, setTab] = useState("Alerts"), [url, setUrl] = useState(""), [freq, setFreq] = useState("Daily"), [busy, setBusy] = useState(false);
  const add = async () => { setBusy(true); try { await api("/watch", { body: { url: url.trim(), frequency: freq.toLowerCase() } }); setUrl(""); w.reload(); } catch (e: any) { Alert.alert("Could not track", e.message); } finally { setBusy(false); } };
  const del = (id: string) => Alert.alert("Stop tracking?", "", [{ text: "Cancel" }, { text: "Stop", style: "destructive", onPress: async () => { try { await api(`/watch/${id}`, { method: "DELETE" }); w.reload(); } catch (e: any) { Alert.alert("Error", e.message); } } }]);
  const cur = tab === "Alerts" ? a : w;
  return (
    <Screen refresh={{ refreshing: false, onRefresh: () => { w.reload(); a.reload(); } }}><Header eyebrow="WATCHTOWER" title="Source changes" />
      <Seg value={tab} onChange={setTab} options={["Alerts", "Tracked"]} />
      <View style={{ height: 16 }} />
      {tab === "Tracked" && <View style={{ gap: 10, marginBottom: 16 }}><Input placeholder="https://..." value={url} onChangeText={setUrl} autoCapitalize="none" /><Seg value={freq} onChange={setFreq} options={["Hourly", "Daily", "Weekly"]} /><Button icon="plus" title="Track source" onPress={add} loading={busy} disabled={!url.trim()} /></View>}
      {cur.loading && !cur.data ? <Loading /> : cur.error ? <ErrorBox error={cur.error} retry={cur.reload} /> : !cur.data?.length ? <Empty icon={tab === "Alerts" ? "bell" : "eye"} title={tab === "Alerts" ? "No alerts" : "Nothing tracked"} sub={tab === "Alerts" ? "You will see changes in tracked sources here." : "Add a URL to watch it for changes."} /> :
        <View style={{ gap: 10 }}>{tab === "Alerts" ? cur.data.map((x: any) => <Card key={x.id}><View style={{ flexDirection: "row", justifyContent: "space-between" }}><T s="h" style={{ fontSize: 15 }}>{x.title}</T><T s="sub">{dt(x.created_at)}</T></View><T s="sub" style={{ marginTop: 4 }}>{x.source}</T>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 12 }}><View style={{ flex: 1, borderWidth: 1, borderColor: c.line, borderRadius: 10, padding: 10 }}><T s="mono" style={{ color: c.subtle, textDecorationLine: "line-through" }}>{x.before}</T></View><View style={{ flex: 1, borderWidth: 1, borderColor: c.line2, borderRadius: 10, padding: 10 }}><T s="mono">{x.after}</T></View></View></Card>) :
          cur.data.map((x: any) => <Card key={x.id} style={{ flexDirection: "row", alignItems: "center" }}><View style={{ flex: 1 }}><T numberOfLines={1}>{x.url}</T><T s="sub" style={{ marginTop: 2 }}>{x.frequency}{x.last_checked ? ` · checked ${dt(x.last_checked)}` : ""}</T></View><Pressable onPress={() => del(x.id)} hitSlop={10}><Feather name="trash-2" size={16} color={c.muted} /></Pressable></Card>)}</View>}
    </Screen>
  );
}
