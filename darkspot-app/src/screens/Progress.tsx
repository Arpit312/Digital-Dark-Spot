import React, { useEffect, useRef, useState } from "react";
import { View, ActivityIndicator, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Header, T, Card, Button, ErrorBox, FadeIn, GlowCard, ProgressBar } from "../ui";
import { api } from "../api";
import { c, r, sp } from "../theme";

const agentIcons: any = {
  "Source Scout": "globe",
  "Extraction": "type",
  "Normalization": "hash",
  "Conflict": "repeat",
  "Gap": "alert-circle",
  "Freshness": "clock",
  "Challenger": "shield",
  "Auditor": "check-square",
  "Planner": "list",
};

export default function Progress({ route, navigation }: any) {
  const { id } = route.params;
  const [a, setA] = useState<any>(null);
  const [err, setErr] = useState<any>(null);
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  // Pulse animation for active agent
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  useEffect(() => {
    let on = true;
    let t: any;
    const tick = async () => {
      try {
        const r = await api(`/analyses/${id}`, { noCache: true });
        if (!on) return;
        setA(r);
        if (r.status === "done") return navigation.replace("Report", { id });
        if (r.status === "failed")
          return setErr(new Error(r.error ?? "Analysis failed"));
      } catch (e) {
        if (on) return setErr(e);
      }
      t = setTimeout(tick, 2000);
    };
    tick();
    return () => {
      on = false;
      clearTimeout(t);
    };
  }, [id]);

  const agents = a?.agents ?? [];
  const doneCount = agents.filter((g: any) => g.status === "done").length;
  const progress = agents.length > 0 ? (doneCount / agents.length) * 100 : 0;

  return (
    <Screen>
      <Header title="Analyzing" eyebrow="PIPELINE" />

      {err ? (
        <ErrorBox error={err} retry={() => navigation.goBack()} />
      ) : (
        <FadeIn>
          {/* Progress overview */}
          <GlowCard style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
              <T s="mut">Analysis progress</T>
              <T s="body" style={{ fontWeight: "600", color: c.accent }}>
                {agents.length > 0 ? `${doneCount}/${agents.length}` : "Starting..."}
              </T>
            </View>
            <ProgressBar progress={progress} />
          </GlowCard>

          {/* Agent list */}
          <Card>
            {!agents.length && (
              <View style={{ paddingVertical: 24, alignItems: "center" }}>
                <ActivityIndicator size="large" color={c.accent} />
                <T s="mut" style={{ textAlign: "center", marginTop: 14 }}>
                  Initializing agents...
                </T>
              </View>
            )}

            {agents.map((g: any, idx: number) => {
              const iconName = (Object.entries(agentIcons).find(([key]) =>
                g.name.toLowerCase().includes(key.toLowerCase())
              )?.[1] || "cpu") as any;

              return (
                <View
                  key={g.name}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                    paddingVertical: 14,
                    borderBottomWidth: idx < agents.length - 1 ? 1 : 0,
                    borderBottomColor: c.line,
                  }}
                >
                  {/* Status indicator */}
                  {g.status === "done" ? (
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        backgroundColor: c.successDim,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Feather name="check" size={16} color={c.success} />
                    </View>
                  ) : g.status === "running" ? (
                    <Animated.View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        backgroundColor: c.accentSoft,
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: pulseAnim,
                      }}
                    >
                      <ActivityIndicator size="small" color={c.accent} />
                    </Animated.View>
                  ) : (
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 10,
                        backgroundColor: c.surface,
                        borderWidth: 1,
                        borderColor: c.line,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Feather name={iconName} size={14} color={c.subtle} />
                    </View>
                  )}

                  <View style={{ flex: 1 }}>
                    <T
                      style={{
                        color: g.status === "pending" ? c.subtle : c.fg,
                        fontWeight: g.status === "running" ? "600" : "400",
                      }}
                    >
                      {g.name}
                    </T>
                    {g.status === "running" && (
                      <T s="sub" style={{ color: c.accent, marginTop: 2 }}>
                        Processing...
                      </T>
                    )}
                  </View>

                  {g.status === "done" && (
                    <T s="sub" style={{ color: c.success }}>
                      Done
                    </T>
                  )}
                </View>
              );
            })}
          </Card>

          <Button
            ghost
            title="Back"
            icon="arrow-left"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 20 }}
          />
        </FadeIn>
      )}
    </Screen>
  );
}
