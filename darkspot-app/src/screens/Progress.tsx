import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Header, T, Card, Button, ErrorBox } from "../ui";
import { api } from "../api";
import { c } from "../theme";
export default function Progress({ route, navigation }: any) {
  const { id } = route.params; const [a, setA] = useState<any>(null), [err, setErr] = useState<any>(null);
  useEffect(() => {
    let on = true, t: any;
    const tick = async () => { try { const r = await api(`/analyses/${id}`); if (!on) return; setA(r); if (r.status === "done") return navigation.replace("Report", { id }); if (r.status === "failed") return setErr(new Error(r.error ?? "Analysis failed")); } catch (e) { if (on) return setErr(e); } t = setTimeout(tick, 1500); };
    tick(); return () => { on = false; clearTimeout(t); };
  }, [id]);
  return (
    <Screen><Header title="Analyzing" eyebrow="PIPELINE" />
      {err ? <ErrorBox error={err} retry={() => navigation.goBack()} /> : <Card>
        {!a?.agents?.length && <View style={{ paddingVertical: 24 }}><ActivityIndicator color={c.fg} /><T s="mut" style={{ textAlign: "center", marginTop: 12 }}>Starting</T></View>}
        {a?.agents?.map((g: any) => <View key={g.name} style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 }}>
          {g.status === "done" ? <Feather name="check" size={16} color={c.fg} /> : g.status === "running" ? <ActivityIndicator size="small" color={c.fg} /> : <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.subtle, marginHorizontal: 5 }} />}
          <T style={{ color: g.status === "pending" ? c.subtle : c.fg }}>{g.name}</T></View>)}
      </Card>}
      <Button ghost title="Back" onPress={() => navigation.goBack()} style={{ marginTop: 20 }} />
    </Screen>
  );
}
