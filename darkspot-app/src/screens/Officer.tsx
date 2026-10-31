import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Screen, Header, T, Card, Seg, Empty, Loading, ErrorBox } from "../ui";
import { useFetch } from "../api";
import { c } from "../theme";
function Module({ k }: any) {
  const { data, loading, error, reload } = useFetch<any>(`/officer/${k}`);
  if (loading) return <Loading />; if (error) return error.status === 403 ? <Empty icon="lock" title="Verified officers only" sub="Your account is not verified for this module." /> : <ErrorBox error={error} retry={reload} />;
  if (!data?.rows?.length) return <Empty icon="inbox" title="No data" />;
  return <Card style={{ padding: 0 }}><ScrollView horizontal>{<View>{!!data.columns && <View style={{ flexDirection: "row", padding: 14, borderBottomWidth: 1, borderBottomColor: c.line }}>{data.columns.map((h: string) => <T key={h} s="sub" style={{ width: 130 }}>{h}</T>)}</View>}{data.rows.map((r: any[], i: number) => <View key={i} style={{ flexDirection: "row", padding: 14, borderBottomWidth: 1, borderBottomColor: c.line }}>{r.map((x, j) => <T key={j} s="mut" style={{ width: 130, color: j ? c.muted : c.fg }}>{String(x)}</T>)}</View>)}</View>}</ScrollView></Card>;
}
export default function Officer() {
  const m = useFetch<any[]>("/officer/modules"); const [k, setK] = useState("");
  useEffect(() => { if (m.data?.length && !k) setK(m.data[0].key); }, [m.data]);
  return (
    <Screen><Header back eyebrow="OFFICER" title="Officer console" />
      {m.loading ? <Loading /> : m.error ? (m.error.status === 403 ? <Empty icon="lock" title="Verified officers only" /> : <ErrorBox error={m.error} retry={m.reload} />) : !m.data?.length ? <Empty icon="inbox" title="No modules available" /> : <View style={{ gap: 16 }}>
        <Seg value={m.data.find((x) => x.key === k)?.title ?? ""} onChange={(t: string) => setK(m.data!.find((x) => x.title === t).key)} options={m.data.map((x) => x.title)} />
        {!!k && <Module key={k} k={k} />}<T s="sub">Insights are aggregated and anonymised. Small groups are hidden.</T></View>}
    </Screen>
  );
}
