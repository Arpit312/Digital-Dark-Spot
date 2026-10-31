import React, { useEffect, useState } from "react";
import { View, Alert, Share } from "react-native";
import { Screen, Header, T, Row, Seg, Toggle, Button } from "../ui";
import { api, kv } from "../api";
import { useAuth } from "../auth";
import { c } from "../theme";
export default function Settings() {
  const { logout } = useAuth(); const [lang, setLang] = useState("English"), [alerts, setAlerts] = useState(true), [motion, setMotion] = useState(false);
  useEffect(() => { (async () => { const s = await kv.get("settings"); if (s) { const j = JSON.parse(s); setLang(j.lang ?? "English"); setAlerts(j.alerts ?? true); setMotion(j.motion ?? false); } })(); }, []);
  const save = (n: any) => kv.set("settings", JSON.stringify({ lang, alerts, motion, ...n }));
  const exp = async () => { try { Share.share({ message: JSON.stringify(await api("/me/export"), null, 2) }); } catch (e: any) { Alert.alert("Error", e.message); } };
  const del = () => Alert.alert("Delete account?", "This removes your account and reports.", [{ text: "Cancel" }, { text: "Delete", style: "destructive", onPress: async () => { try { await api("/me", { method: "DELETE" }); await logout(); } catch (e: any) { Alert.alert("Error", e.message); } } }]);
  return (
    <Screen><Header back eyebrow="SETTINGS" title="Settings" />
      <View style={{ borderTopWidth: 1, borderTopColor: c.line }}>
        <View style={{ paddingVertical: 16, gap: 10, borderBottomWidth: 1, borderBottomColor: c.line }}><T>Language</T><Seg value={lang} onChange={(v: string) => { setLang(v); save({ lang: v }); }} options={["English", "हिन्दी"]} /></View>
        <Row title="Change alerts" sub="Notify me when a tracked source changes" right={<Toggle value={alerts} onChange={(v: boolean) => { setAlerts(v); save({ alerts: v }); }} />} />
        <Row title="Reduce motion" sub="Turn off animations" right={<Toggle value={motion} onChange={(v: boolean) => { setMotion(v); save({ motion: v }); }} />} />
      </View>
      <View style={{ gap: 10, marginTop: 28 }}><Button ghost title="Export my data" onPress={exp} /><Button ghost title="Delete account" onPress={del} /></View>
    </Screen>
  );
}
