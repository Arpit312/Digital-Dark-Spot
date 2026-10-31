import React, { useState } from "react";
import { View, Pressable, Modal, ScrollView, Linking } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Header, T, Card, Badge, Seg, Empty, Loading, ErrorBox, TypeIcon, FadeIn } from "../ui";
import { api, useFetch } from "../api";
import { c } from "../theme";
const LABEL: any = { gap: "Potential gap", conflict: "Possible conflict", outdated: "Possibly outdated", unanswered: "Unanswered" };
const BS: any = { gap: "dashed", conflict: "solid", outdated: "dotted", unanswered: "solid" };
export default function Report({ route }: any) {
  const { id } = route.params; const { data, loading, error, reload } = useFetch<any>(`/analyses/${id}`);
  const [tab, setTab] = useState("All"), [sel, setSel] = useState<any>(null), [done, setDone] = useState<Record<string, boolean>>({});
  if (loading) return <Screen><Header back title="Report" /><Loading /></Screen>;
  if (error) return <Screen><Header back title="Report" /><ErrorBox error={error} retry={reload} /></Screen>;
  const f: any[] = data.findings ?? [], cl: any[] = data.checklist ?? [];
  const n = (t: string[]) => f.filter((x) => t.includes(x.type)).length;
  const list = f.filter((x) => tab === "All" || (tab === "Gaps" && ["gap", "unanswered"].includes(x.type)) || (tab === "Conflicts" && x.type === "conflict") || (tab === "Outdated" && x.type === "outdated"));
  const isDone = (x: any) => (x.id in done ? done[x.id] : !!x.done);
  const toggle = async (x: any) => { const v = !isDone(x); setDone({ ...done, [x.id]: v }); try { await api(`/checklist/${x.id}`, { method: "PATCH", body: { done: v } }); } catch { setDone({ ...done, [x.id]: !v }); } };
  const stats = [["Gaps", n(["gap", "unanswered"])], ["Conflicts", n(["conflict"])], ["Outdated", n(["outdated"])], ...(data.coverage != null ? [["Coverage", Math.round(data.coverage * 100) + "%"]] : [])];
  return (
    <Screen><Header back eyebrow="REPORT" title={data.question || "Report"} />
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>{stats.map(([l, v]: any) => <Card key={l} style={{ flexGrow: 1, minWidth: "30%", padding: 14 }}><T s="sub">{l}</T><T s="h" style={{ fontSize: 22, marginTop: 4 }}>{v}</T></Card>)}</View>
      <View style={{ marginVertical: 16 }}><Seg value={tab} onChange={setTab} options={["All", "Gaps", "Conflicts", "Outdated", "Checklist"].slice(0, 5)} /></View>
      {tab !== "Checklist" ? (list.length === 0 ? <Empty icon="search" title="Nothing here" sub="No findings of this type in the sources reviewed." /> :
        <View style={{ gap: 10 }}>{list.map((x, i) => <FadeIn key={x.id} delay={i * 50}><Pressable onPress={() => setSel(x)}><Card style={{ borderStyle: BS[x.type], borderColor: c.line2 }}>
          <View style={{ flexDirection: "row", gap: 12 }}><View style={{ paddingTop: 2 }}><TypeIcon type={x.type} /></View><View style={{ flex: 1 }}><T s="h" style={{ fontSize: 16 }}>{x.title}</T><T s="mut" style={{ marginTop: 4 }}>{x.statement}</T>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 12 }}><Badge>{LABEL[x.type]}</Badge><T s="sub" style={{ flex: 1 }}>{x.evidence?.length ? `${x.evidence.length} evidence` : "Not found in sources reviewed"}</T>{x.confidence != null && <T s="sub">{Math.round(x.confidence * 100)}%</T>}</View></View></View></Card></Pressable></FadeIn>)}</View>
      ) : cl.length === 0 ? <Empty icon="check-square" title="No checklist yet" /> : <View style={{ gap: 8 }}>{cl.map((x) => <Pressable key={x.id} onPress={() => toggle(x)}><Card style={{ flexDirection: "row", alignItems: "center", gap: 14, padding: 14 }}>
        <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 1.5, borderColor: isDone(x) ? c.fg : c.line2, backgroundColor: isDone(x) ? c.fg : "transparent", alignItems: "center", justifyContent: "center" }}>{isDone(x) && <Feather name="check" size={14} color={c.bg} />}</View>
        <T style={{ flex: 1, color: isDone(x) ? c.subtle : c.fg, textDecorationLine: isDone(x) ? "line-through" : "none" }}>{x.text}</T>{x.priority && <Badge>{x.priority}</Badge>}</Card></Pressable>)}</View>}
      <T s="sub" style={{ marginTop: 28 }}>AI findings are potential gaps, not guaranteed facts. Verify on the official source.</T>
      <Modal visible={!!sel} animationType="slide" transparent onRequestClose={() => setSel(null)}><Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,.7)" }} onPress={() => setSel(null)} />
        <View style={{ maxHeight: "75%", backgroundColor: c.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, borderColor: c.line, padding: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}><T s="eyebrow">EVIDENCE</T><Pressable onPress={() => setSel(null)} hitSlop={12}><Feather name="x" size={20} color={c.fg} /></Pressable></View>
          <ScrollView><T s="h">{sel?.title}</T><T s="mut" style={{ marginTop: 4 }}>{sel?.statement}</T>
            {!sel?.evidence?.length && <Card style={{ marginTop: 16 }}><T s="mut">Not found in the sources reviewed. Check the latest official notice.</T></Card>}
            {sel?.evidence?.map((e: any, i: number) => <View key={i} style={{ marginTop: 16 }}><Card style={{ backgroundColor: c.card }}><T s="mono">“{e.quote}”</T></Card><View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}><T s="sub" style={{ flex: 1 }}>{[e.source, e.tier != null && `tier ${e.tier}`, e.location].filter(Boolean).join(" · ")}</T>{!!e.url && <Pressable onPress={() => Linking.openURL(e.url)}><T s="sub" style={{ color: c.fg }}>Open</T></Pressable>}</View></View>)}
            <View style={{ height: 24 }} /></ScrollView></View></Modal>
    </Screen>
  );
}
