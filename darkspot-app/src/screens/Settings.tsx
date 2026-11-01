import React, { useEffect, useState } from "react";
import { View, Alert, Share } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, Header, T, Row, Seg, Toggle, Button, Card, FadeIn, Divider } from "../ui";
import { api, kv } from "../api";
import { useAuth } from "../auth";
import { c, r, sp } from "../theme";

export default function Settings() {
  const { logout } = useAuth();
  const [lang, setLang] = useState("English");
  const [alerts, setAlerts] = useState(true);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    (async () => {
      const s = await kv.get("settings");
      if (s) {
        const j = JSON.parse(s);
        setLang(j.lang ?? "English");
        setAlerts(j.alerts ?? true);
        setMotion(j.motion ?? false);
      }
    })();
  }, []);

  const save = (n: any) =>
    kv.set("settings", JSON.stringify({ lang, alerts, motion, ...n }));

  const exp = async () => {
    try {
      Share.share({
        message: JSON.stringify(await api("/me/export"), null, 2),
      });
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  const del = () =>
    Alert.alert(
      "Delete account?",
      "This permanently removes your account and all reports. This action cannot be undone.",
      [
        { text: "Cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api("/me", { method: "DELETE" });
              await logout();
            } catch (e: any) {
              Alert.alert("Error", e.message);
            }
          },
        },
      ]
    );

  return (
    <Screen>
      <Header back eyebrow="SETTINGS" title="Settings" />

      {/* Language */}
      <FadeIn>
        <T s="eyebrow" style={{ marginBottom: 12 }}>
          PREFERENCES
        </T>
        <Card style={{ gap: 14, marginBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: c.accentSoft,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="globe" size={16} color={c.accent} />
            </View>
            <T style={{ flex: 1, fontWeight: "600" }}>Language</T>
          </View>
          <Seg
            value={lang}
            onChange={(v: string) => {
              setLang(v);
              save({ lang: v });
            }}
            options={["English", "हिन्दी"]}
          />
        </Card>
      </FadeIn>

      {/* Notification & Motion */}
      <FadeIn delay={100}>
        <T s="eyebrow" style={{ marginBottom: 12 }}>
          NOTIFICATIONS
        </T>
        <View
          style={{
            borderTopWidth: 1,
            borderTopColor: c.line,
          }}
        >
          <Row
            icon="bell"
            title="Change alerts"
            sub="Notify me when a tracked source changes"
            right={
              <Toggle
                value={alerts}
                onChange={(v: boolean) => {
                  setAlerts(v);
                  save({ alerts: v });
                }}
              />
            }
          />
          <Row
            icon="zap-off"
            title="Reduce motion"
            sub="Turn off animations throughout the app"
            right={
              <Toggle
                value={motion}
                onChange={(v: boolean) => {
                  setMotion(v);
                  save({ motion: v });
                }}
              />
            }
          />
        </View>
      </FadeIn>

      {/* Data & Account */}
      <FadeIn delay={200}>
        <T s="eyebrow" style={{ marginTop: 28, marginBottom: 12 }}>
          DATA & ACCOUNT
        </T>
        <View style={{ gap: 10 }}>
          <Button ghost title="Export My Data" icon="download" onPress={exp} />
          <Button ghost danger title="Delete Account" icon="trash-2" onPress={del} />
        </View>
      </FadeIn>

      {/* Version */}
      <FadeIn delay={300}>
        <View style={{ alignItems: "center", marginTop: 40, gap: 4 }}>
          <T s="sub">DarkSpot Atlas v1.0.0</T>
          <T s="sub" style={{ color: c.dim }}>
            Built with ♥ by the DarkSpot team
          </T>
        </View>
      </FadeIn>
    </Screen>
  );
}
