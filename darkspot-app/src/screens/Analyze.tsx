import React, { useState } from "react";
import { View, Pressable } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Feather } from "@expo/vector-icons";
import { Screen, Header, T, Input, Button, Seg, Card, FadeIn } from "../ui";
import { api } from "../api";
import { c } from "../theme";
export default function Analyze({ navigation }: any) {
  const [q, setQ] = useState(""), [topic, setTopic] = useState("Auto"), [depth, setDepth] = useState("Standard"), [tab, setTab] = useState("URL"), [val, setVal] = useState("");
  const [src, setSrc] = useState<any[]>([]), [busy, setBusy] = useState(false), [err, setErr] = useState("");
  const add = () => { if (val.trim()) { setSrc([...src, { type: tab === "URL" ? "url" : "text", value: val.trim() }]); setVal(""); } };
  const pick = async () => {
    const r = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (r.canceled) return;
    try { const f = r.assets[0]; const form = new FormData(); form.append("file", { uri: f.uri, name: f.name, type: "application/pdf" } as any); const up = await api("/sources/upload", { form }); setSrc((s) => [...s, { type: "pdf", id: up.id, value: f.name }]); } catch (e: any) { setErr(e.message); }
  };
  const run = async () => { setBusy(true); setErr(""); try { const r = await api("/analyze", { body: { question: q, topic, depth, sources: src } }); setQ(""); setSrc([]); navigation.navigate("Progress", { id: r.id }); } catch (e: any) { setErr(e.message); } finally { setBusy(false); } };
  return (
    <Screen><Header eyebrow="ANALYZE" title="Ask. Add sources." />
      <FadeIn style={{ gap: 20 }}>
        <Input multiline placeholder="What should I verify before applying?" value={q} onChangeText={setQ} maxLength={300} />
        <View style={{ gap: 8 }}><T s="sub">TOPIC</T><Seg value={topic} onChange={setTopic} options={["Auto", "Scholarship", "Admission", "Scheme"]} /></View>
        <View style={{ gap: 8 }}><T s="sub">DEPTH</T><Seg value={depth} onChange={setDepth} options={["Quick", "Standard", "Deep"]} /></View>
        <View style={{ gap: 10 }}><T s="sub">SOURCES</T><Seg value={tab} onChange={setTab} options={["URL", "PDF", "Paste"]} />
          {tab === "PDF" ? <Button ghost icon="upload" title="Choose a PDF" onPress={pick} /> : <View style={{ flexDirection: "row", gap: 8 }}><Input style={{ flex: 1 }} placeholder={tab === "URL" ? "https://..." : "Paste text"} value={val} onChangeText={setVal} autoCapitalize="none" onSubmitEditing={add} /><Button ghost title="Add" onPress={add} style={{ width: 72 }} /></View>}
          {src.map((s, i) => <Card key={i} style={{ flexDirection: "row", alignItems: "center", padding: 12 }}><Feather name={s.type === "pdf" ? "file" : s.type === "url" ? "link" : "type"} size={16} color={c.muted} /><T style={{ flex: 1, marginHorizontal: 10 }} numberOfLines={1}>{s.value}</T><Pressable onPress={() => setSrc(src.filter((_, j) => j !== i))} hitSlop={10}><Feather name="x" size={16} color={c.muted} /></Pressable></Card>)}
        </View>
        {!!err && <T s="mut">{err}</T>}
        <Button icon="play" title="Run analysis" onPress={run} loading={busy} disabled={!q.trim() && !src.length} />
        <T s="sub" style={{ textAlign: "center" }}>Findings are potential gaps, not guaranteed facts.</T>
      </FadeIn></Screen>
  );
}
