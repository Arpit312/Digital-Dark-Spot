import React, { useState } from "react";
import { View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Screen, Header, T, Card, Button, Empty } from "../ui";
import { api } from "../api";
export default function Campus() {
  const [gaps, setGaps] = useState<any[] | null>(null), [busy, setBusy] = useState(false), [err, setErr] = useState("");
  const pick = async () => {
    const r = await DocumentPicker.getDocumentAsync({ type: "application/pdf", multiple: true }); if (r.canceled) return;
    setBusy(true); setErr("");
    try { const form = new FormData(); r.assets.forEach((f) => form.append("files", { uri: f.uri, name: f.name, type: "application/pdf" } as any)); const res = await api("/campus/check", { form }); setGaps(res.gaps ?? []); } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  };
  return (
    <Screen><Header back eyebrow="CAMPUS MODE" title="Check college notices" />
      <T s="mut" style={{ marginBottom: 16 }}>Upload admission, exam, scholarship or hostel notices to find gaps and conflicts.</T>
      <Button icon="upload" title="Choose notices (PDF)" onPress={pick} loading={busy} />
      {!!err && <T s="mut" style={{ marginTop: 12 }}>{err}</T>}
      <View style={{ marginTop: 20, gap: 10 }}>{gaps === null ? <Empty icon="file-text" title="No notices checked" /> : gaps.length === 0 ? <Empty icon="check" title="No gaps found" sub="In the notices reviewed." /> : gaps.map((g, i) => <Card key={i}><T s="h" style={{ fontSize: 15 }}>{g.title}</T>{!!g.detail && <T s="mut" style={{ marginTop: 4 }}>{g.detail}</T>}</Card>)}</View>
    </Screen>
  );
}
