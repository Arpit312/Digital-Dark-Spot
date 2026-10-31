import React from "react";
import { View } from "react-native";
import { Screen, Header, T, Row, Button } from "../ui";
import { useAuth } from "../auth";
import { c } from "../theme";
export default function Profile({ navigation }: any) {
  const { user, logout } = useAuth(); const role = user?.role;
  const go = (s: string) => () => navigation.navigate(s);
  return (
    <Screen><Header eyebrow="PROFILE" title={user?.name || "Account"} /><T s="mut" style={{ marginTop: -12, marginBottom: 20 }}>{user?.email}</T>
      <View style={{ borderTopWidth: 1, borderTopColor: c.line }}>
        <Row icon="settings" title="Settings" onPress={go("Settings")} />
        <Row icon="bar-chart-2" title="Accuracy" onPress={go("Accuracy")} />
        <Row icon="git-branch" title="How it works" onPress={go("HowItWorks")} />
        <Row icon="book-open" title="Campus mode" onPress={go("Campus")} />
        {(role === "officer" || role === "admin") && <Row icon="shield" title="Officer console" onPress={go("Officer")} />}
        {role === "admin" && <Row icon="sliders" title="Admin" onPress={go("Admin")} />}
      </View>
      <Button ghost title="Sign out" onPress={logout} style={{ marginTop: 32 }} />
    </Screen>
  );
}
