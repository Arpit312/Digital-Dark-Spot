import React from "react";
import { View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Header, T, Row, Button, Card, FadeIn, Badge } from "../ui";
import { useAuth } from "../auth";
import { c, r, sp } from "../theme";

export default function Profile({ navigation }: any) {
  const { user, logout } = useAuth();
  const role = user?.role;
  const name =
    user?.user_metadata?.full_name ||
    user?.name ||
    user?.email?.split("@")[0] ||
    "User";
  const email = user?.email || "";
  const go = (s: string) => () => navigation.navigate(s);

  return (
    <Screen>
      <Header eyebrow="PROFILE" title="Account" />

      {/* Profile card */}
      <FadeIn>
        <Card
          style={{
            alignItems: "center",
            paddingVertical: 28,
            marginBottom: 24,
          }}
        >
          {/* Avatar */}
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: c.accent + "20",
              borderWidth: 2,
              borderColor: c.accent + "40",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 14,
            }}
          >
            <T style={{ fontSize: 28, fontWeight: "700", color: c.accent }}>
              {name[0]?.toUpperCase() || "U"}
            </T>
          </View>

          <T s="h2">{name}</T>
          <T s="mut" style={{ marginTop: 4 }}>
            {email}
          </T>

          {role && (
            <Badge color={role === "admin" ? c.danger : c.info}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </Badge>
          )}
        </Card>
      </FadeIn>

      {/* Menu */}
      <FadeIn delay={100}>
        <T s="eyebrow" style={{ marginBottom: 12 }}>
          SETTINGS & TOOLS
        </T>
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: c.line,
          }}
        >
          <Row icon="settings" title="Settings" sub="Language, alerts, privacy" onPress={go("Settings")} />
          <Row icon="bar-chart-2" title="Accuracy" sub="Measured evaluation results" onPress={go("Accuracy")} />
          <Row icon="cpu" title="How it works" sub="8 AI agents explained" onPress={go("HowItWorks")} />
          <Row icon="book-open" title="Campus mode" sub="College notices auditor" onPress={go("Campus")} />
          <Row icon="life-buoy" title="Support" sub="Report issues or get help" onPress={go("Support")} />
          {(role === "officer" || role === "admin") && (
            <Row icon="shield" title="Officer console" sub="Confusion intelligence" onPress={go("Officer")} />
          )}
          {role === "admin" && (
            <Row icon="sliders" title="Admin" sub="Dashboard & verification queue" onPress={go("Admin")} />
          )}
        </View>
      </FadeIn>

      <FadeIn delay={200}>
        <Button
          ghost
          danger
          title="Sign Out"
          icon="log-out"
          onPress={logout}
          style={{ marginTop: 32 }}
        />
      </FadeIn>
    </Screen>
  );
}
