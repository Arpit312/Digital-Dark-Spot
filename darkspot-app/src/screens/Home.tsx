import React, { useEffect, useRef, useState } from "react";
import { View, Pressable, Animated, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, T, Card, GlowCard, Button, FadeIn, ScaleIn, Badge, StatCard } from "../ui";
import { useAuth } from "../auth";
import { useFetch, api } from "../api";
import { c, r, sp } from "../theme";

const { width: W } = Dimensions.get("window");

// Animated hero logo
function L3Logo() {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const gapOpacity = anim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3, 1, 0.3] });

  return (
    <View style={{ alignItems: "center", marginBottom: 4 }}>
      <View style={{ width: 48, height: 48, justifyContent: "center", gap: 5 }}>
        <View style={{ height: 3, backgroundColor: c.fg, borderRadius: 2 }} />
        <View style={{ flexDirection: "row", gap: 8 }}>
          <View style={{ flex: 1, height: 3, backgroundColor: c.fg, borderRadius: 2 }} />
          <Animated.View
            style={{
              width: 14,
              height: 3,
              borderRadius: 2,
              backgroundColor: c.accent,
              opacity: gapOpacity,
            }}
          />
          <View style={{ flex: 1, height: 3, backgroundColor: c.fg, borderRadius: 2 }} />
        </View>
        <View style={{ height: 3, backgroundColor: c.fg, borderRadius: 2 }} />
      </View>
    </View>
  );
}

// Quick action button component
function QuickAction({ icon, label, onPress, color }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        alignItems: "center",
        gap: 8,
        flex: 1,
        opacity: pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.95 : 1 }],
      })}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          backgroundColor: (color || c.accent) + "15",
          borderWidth: 1,
          borderColor: (color || c.accent) + "25",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather name={icon} size={22} color={color || c.accent} />
      </View>
      <T s="sub" style={{ fontSize: 11, textAlign: "center" }}>
        {label}
      </T>
    </Pressable>
  );
}

export default function Home({ navigation }: any) {
  const { user } = useAuth();
  const reports = useFetch<any[]>("/analyses");
  const name =
    user?.user_metadata?.full_name ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "User";
  const firstName = name.split(" ")[0];
  const recentReports = (reports.data ?? []).slice(0, 3);
  const totalReports = (reports.data ?? []).length;

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <Screen
      refresh={{
        refreshing: reports.loading && !!reports.data,
        onRefresh: reports.reload,
      }}
    >
      {/* Hero Section */}
      <FadeIn>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <View style={{ flex: 1 }}>
            <T s="mut" style={{ marginBottom: 4 }}>
              {greeting} 👋
            </T>
            <T s="title" style={{ fontSize: 26 }}>
              {firstName}
            </T>
          </View>
          <Pressable
            onPress={() => navigation.navigate("Profile")}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: c.accent + "20",
              borderWidth: 1.5,
              borderColor: c.accent + "40",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <T style={{ fontSize: 18, fontWeight: "700", color: c.accent }}>
              {firstName[0]?.toUpperCase() || "U"}
            </T>
          </Pressable>
        </View>
      </FadeIn>

      {/* Brand Hero Card */}
      <ScaleIn delay={100}>
        <GlowCard
          style={{
            marginBottom: 20,
            paddingVertical: 20,
            paddingHorizontal: 18,
          }}
        >
          <L3Logo />
          <T
            s="h"
            style={{
              textAlign: "center",
              marginTop: 12,
              color: c.fg,
              fontSize: 18,
            }}
          >
            DarkSpot Atlas
          </T>
          <T
            s="mut"
            style={{
              textAlign: "center",
              marginTop: 6,
              fontSize: 13,
              lineHeight: 18,
            }}
          >
            Find what's missing, outdated, or conflicting{"\n"}in any public
            information — with evidence.
          </T>
          <Button
            title="New Analysis"
            icon="zap"
            onPress={() => navigation.navigate("Analyze")}
            style={{ marginTop: 18 }}
          />
        </GlowCard>
      </ScaleIn>

      {/* Quick Actions Grid */}
      <FadeIn delay={200}>
        <T s="eyebrow" style={{ marginBottom: 14 }}>
          QUICK ACTIONS
        </T>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <QuickAction
            icon="search"
            label="Analyze"
            color={c.accent}
            onPress={() => navigation.navigate("Analyze")}
          />
          <QuickAction
            icon="file-text"
            label="Reports"
            color={c.info}
            onPress={() => navigation.navigate("Reports")}
          />
          <QuickAction
            icon="bell"
            label="Watchtower"
            color={c.warning}
            onPress={() => navigation.navigate("Watchtower")}
          />
          <QuickAction
            icon="book-open"
            label="Campus"
            color={c.grad4}
            onPress={() => navigation.navigate("Campus")}
          />
        </View>
      </FadeIn>

      {/* Stats Overview */}
      <FadeIn delay={300}>
        <T s="eyebrow" style={{ marginBottom: 14 }}>
          OVERVIEW
        </T>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginBottom: 24,
          }}
        >
          <StatCard
            label="Reports"
            value={totalReports}
            icon="file-text"
            color={c.accent}
          />
          <StatCard
            label="Coverage"
            value={
              recentReports.length > 0 && recentReports[0]?.coverage != null
                ? Math.round(recentReports[0].coverage * 100) + "%"
                : "—"
            }
            icon="shield"
            color={c.success}
          />
        </View>
      </FadeIn>

      {/* Recent Reports */}
      <FadeIn delay={400}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <T s="eyebrow">RECENT REPORTS</T>
          {recentReports.length > 0 && (
            <Pressable onPress={() => navigation.navigate("Reports")}>
              <T s="accent" style={{ fontSize: 13 }}>
                View all →
              </T>
            </Pressable>
          )}
        </View>

        {recentReports.length === 0 ? (
          <Card
            style={{
              alignItems: "center",
              paddingVertical: 32,
            }}
          >
            <Feather name="inbox" size={28} color={c.subtle} />
            <T s="mut" style={{ marginTop: 12, textAlign: "center" }}>
              No reports yet.{"\n"}Run your first analysis to get started.
            </T>
          </Card>
        ) : (
          <View style={{ gap: 10 }}>
            {recentReports.map((rep: any, idx: number) => (
              <ScaleIn key={rep.id} delay={idx * 80}>
                <Card
                  onPress={() =>
                    navigation.navigate(
                      rep.status && rep.status !== "done"
                        ? "Progress"
                        : "Report",
                      { id: rep.id }
                    )
                  }
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: c.accentSoft,
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 2,
                      }}
                    >
                      <Feather name="file-text" size={16} color={c.accent} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <T
                        s="body"
                        style={{ fontWeight: "600" }}
                        numberOfLines={2}
                      >
                        {rep.question}
                      </T>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                          marginTop: 8,
                        }}
                      >
                        {rep.status && rep.status !== "done" ? (
                          <Badge color={c.warning}>{rep.status}</Badge>
                        ) : rep.coverage != null ? (
                          <Badge>
                            Coverage {Math.round(rep.coverage * 100)}%
                          </Badge>
                        ) : null}
                        {rep.summary_counts && (
                          <T s="sub">
                            {(rep.summary_counts.gaps || 0) +
                              (rep.summary_counts.conflicts || 0)}{" "}
                            findings
                          </T>
                        )}
                      </View>
                    </View>
                    <Feather name="chevron-right" size={18} color={c.subtle} />
                  </View>
                </Card>
              </ScaleIn>
            ))}
          </View>
        )}
      </FadeIn>

      {/* How It Works CTA */}
      <FadeIn delay={500}>
        <Card
          onPress={() => navigation.navigate("HowItWorks")}
          style={{
            marginTop: 24,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
          }}
        >
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
            <Feather name="cpu" size={18} color={c.grad2} />
          </View>
          <View style={{ flex: 1 }}>
            <T style={{ fontWeight: "600" }}>How It Works</T>
            <T s="sub" style={{ marginTop: 2 }}>
              8 AI agents audit your sources
            </T>
          </View>
          <Feather name="chevron-right" size={18} color={c.subtle} />
        </Card>
      </FadeIn>

      {/* Support CTA */}
      <FadeIn delay={600}>
        <Card
          onPress={() => navigation.navigate("Support")}
          style={{
            marginTop: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              backgroundColor: c.info + "18",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Feather name="life-buoy" size={18} color={c.info} />
          </View>
          <View style={{ flex: 1 }}>
            <T style={{ fontWeight: "600" }}>Support & Help</T>
            <T s="sub" style={{ marginTop: 2 }}>
              Report issues or get help
            </T>
          </View>
          <Feather name="chevron-right" size={18} color={c.subtle} />
        </Card>
      </FadeIn>

      <View style={{ height: 20 }} />
    </Screen>
  );
}
