import React from "react";
import { View } from "react-native";
import { Screen, Header, T, Card, Empty, Loading, ErrorBox } from "../ui";
import { useFetch } from "../api";
import { c } from "../theme";
export default function Accuracy() {
  const { data, loading, error, reload } = useFetch<any>("/eval/report");
  const empty = data && !data.metrics?.length && !data.ablation?.length;
  return (
    <Screen><Header back eyebrow="ACCURACY" title="Measured results" />
      {loading ? <Loading /> : error ? <ErrorBox error={error} retry={reload} /> : empty ? <Empty icon="bar-chart-2" title="No evaluation yet" sub="Results appear after an evaluation run." /> : <View style={{ gap: 12 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>{data.metrics?.map((m: any) => <Card key={m.label} style={{ flexGrow: 1, minWidth: "45%" }}><T s="sub">{m.label}</T><T s="h" style={{ fontSize: 26, marginTop: 4 }}>{m.value}</T></Card>)}</View>
        {!!data.ablation?.length && <Card><T s="h" style={{ marginBottom: 14 }}>Ablation</T>{data.ablation.map((a: any) => <View key={a.label} style={{ marginBottom: 12 }}><View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}><T s="sub">{a.label}</T><T s="sub">{a.value}</T></View><View style={{ height: 6, borderRadius: 3, backgroundColor: c.line }}><View style={{ height: 6, borderRadius: 3, backgroundColor: c.fg, width: `${Math.min(100, Number(a.value))}%` }} /></View></View>)}</Card>}
        {!!data.by_type?.length && <Card><T s="h" style={{ marginBottom: 10 }}>By finding type</T>{data.by_type.map((r: any) => <View key={r.type} style={{ flexDirection: "row", paddingVertical: 8, borderTopWidth: 1, borderTopColor: c.line }}><T style={{ flex: 1 }}>{r.type}</T><T s="mono" style={{ width: 60 }}>{r.precision}</T><T s="mono" style={{ width: 60 }}>{r.recall}</T></View>)}</Card>}
        {!!data.note && <T s="sub">{data.note}</T>}</View>}
    </Screen>
  );
}
