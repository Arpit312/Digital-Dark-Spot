import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Header, T, Card, Seg, Empty, Loading, ErrorBox, FadeIn, Badge } from "../ui";
import { useFetch } from "../api";
import { c, r, sp } from "../theme";

function Module({ k }: any) {
  const { data, loading, error, reload } = useFetch<any>(`/officer/${k}`);

  if (loading) return <Loading />;
  if (error)
    return error.status === 403 ? (
      <Empty
        icon="lock"
        title="Verified officers only"
        sub="Your account is not verified for this module."
      />
    ) : (
      <ErrorBox error={error} retry={reload} />
    );
  if (!data?.rows?.length) return <Empty icon="inbox" title="No data available" />;

  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header row */}
          {!!data.columns && (
            <View
              style={{
                flexDirection: "row",
                padding: 14,
                borderBottomWidth: 1,
                borderBottomColor: c.line,
                backgroundColor: c.surface,
              }}
            >
              {data.columns.map((h: string) => (
                <T
                  key={h}
                  s="sub"
                  style={{
                    width: 140,
                    fontWeight: "600",
                    color: c.accent,
                  }}
                >
                  {h}
                </T>
              ))}
            </View>
          )}
          {/* Data rows */}
          {data.rows.map((row: any[], i: number) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                padding: 14,
                borderBottomWidth: i < data.rows.length - 1 ? 1 : 0,
                borderBottomColor: c.line,
                backgroundColor: i % 2 === 0 ? "transparent" : c.surface,
              }}
            >
              {row.map((x, j) => (
                <T
                  key={j}
                  s="mut"
                  style={{
                    width: 140,
                    color: j === 0 ? c.fg : c.muted,
                    fontWeight: j === 0 ? "500" : "400",
                  }}
                >
                  {String(x)}
                </T>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </Card>
  );
}

export default function Officer() {
  const m = useFetch<any[]>("/officer/modules");
  const [k, setK] = useState("");

  useEffect(() => {
    if (m.data?.length && !k) setK(m.data[0].key);
  }, [m.data]);

  return (
    <Screen>
      <Header
        back
        eyebrow="OFFICER"
        title="Officer console"
        right={
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: c.grad2 + "18",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="shield" size={18} color={c.grad2} />
          </View>
        }
      />

      {m.loading ? (
        <Loading />
      ) : m.error ? (
        m.error.status === 403 ? (
          <Empty icon="lock" title="Verified officers only" sub="Request access from your admin." />
        ) : (
          <ErrorBox error={m.error} retry={m.reload} />
        )
      ) : !m.data?.length ? (
        <Empty icon="inbox" title="No modules available" />
      ) : (
        <FadeIn>
          <View style={{ gap: 16 }}>
            <Seg
              value={m.data.find((x) => x.key === k)?.title ?? ""}
              onChange={(t: string) =>
                setK(m.data!.find((x) => x.title === t).key)
              }
              options={m.data.map((x) => x.title)}
            />
            {!!k && <Module key={k} k={k} />}
            <T s="sub" style={{ textAlign: "center" }}>
              Insights are aggregated and anonymised.{"\n"}Small groups (k {"<"} 10)
              are hidden for privacy.
            </T>
          </View>
        </FadeIn>
      )}
    </Screen>
  );
}
