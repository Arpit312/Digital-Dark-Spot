import React, { useEffect, useRef } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator, Animated, ScrollView, RefreshControl, Platform, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { c } from "./theme";
const st: any = {
  title: { color: c.fg, fontSize: 28, fontWeight: "600", letterSpacing: -0.8 }, h: { color: c.fg, fontSize: 17, fontWeight: "600" }, body: { color: c.fg, fontSize: 15 },
  mut: { color: c.muted, fontSize: 14, lineHeight: 20 }, sub: { color: c.subtle, fontSize: 12 }, eyebrow: { color: c.subtle, fontSize: 11, fontWeight: "600", letterSpacing: 1.5 },
  mono: { color: c.fg, fontSize: 13, lineHeight: 20, fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }) },
};
export const T = ({ children, s = "body", style, ...p }: any) => <Text {...p} style={[st[s], style]}>{children}</Text>;
export function FadeIn({ children, delay = 0, style }: any) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(v, { toValue: 1, duration: 450, delay, useNativeDriver: true }).start(); }, []);
  return <Animated.View style={[{ opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }, style]}>{children}</Animated.View>;
}
export function Screen({ children, scroll = true, refresh, noPad }: any) {
  const body = scroll ? <ScrollView contentContainerStyle={{ padding: noPad ? 0 : 20, paddingBottom: 48 }} keyboardShouldPersistTaps="handled" refreshControl={refresh ? <RefreshControl refreshing={!!refresh.refreshing} onRefresh={refresh.onRefresh} tintColor={c.fg} /> : undefined}>{children}</ScrollView> : <View style={{ flex: 1, padding: noPad ? 0 : 20 }}>{children}</View>;
  return <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>{body}</SafeAreaView>;
}
export function Header({ title, eyebrow, back }: any) {
  const nav: any = useNavigation();
  return <View style={{ marginBottom: 20 }}>{back && <Pressable onPress={() => nav.goBack()} style={{ marginBottom: 12, alignSelf: "flex-start" }} hitSlop={12}><Feather name="arrow-left" size={22} color={c.fg} /></Pressable>}{eyebrow && <T s="eyebrow" style={{ marginBottom: 6 }}>{eyebrow}</T>}<T s="title">{title}</T></View>;
}
export const Card = ({ children, style, onPress }: any) => { const P: any = onPress ? Pressable : View; return <P onPress={onPress} style={[{ backgroundColor: c.card, borderColor: c.line, borderWidth: 1, borderRadius: 16, padding: 16 }, style]}>{children}</P>; };
export function Button({ title, onPress, ghost, loading, disabled, icon, style }: any) {
  const off = disabled || loading;
  return <Pressable onPress={onPress} disabled={off} style={({ pressed }: any) => [{ height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, backgroundColor: ghost ? "transparent" : c.fg, borderWidth: ghost ? 1 : 0, borderColor: c.line2, opacity: off ? 0.4 : pressed ? 0.8 : 1 }, style]}>
    {loading ? <ActivityIndicator color={ghost ? c.fg : c.bg} /> : <>{icon && <Feather name={icon} size={16} color={ghost ? c.fg : c.bg} />}<Text style={{ color: ghost ? c.fg : c.bg, fontWeight: "600", fontSize: 15 }}>{title}</Text></>}</Pressable>;
}
export const Input = (p: any) => <TextInput placeholderTextColor={c.subtle} selectionColor={c.fg} {...p} style={[{ minHeight: 48, borderRadius: 12, borderWidth: 1, borderColor: c.line2, backgroundColor: c.surface, color: c.fg, paddingHorizontal: 14, fontSize: 15 }, p.multiline && { paddingTop: 12, minHeight: 96, textAlignVertical: "top" }, p.style]} />;
export const Badge = ({ children }: any) => <View style={{ borderWidth: 1, borderColor: c.line2, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4, alignSelf: "flex-start" }}><Text style={{ color: c.muted, fontSize: 11, fontWeight: "500" }}>{children}</Text></View>;
export function Seg({ value, onChange, options }: any) {
  return <View style={{ flexDirection: "row", backgroundColor: c.surface, borderWidth: 1, borderColor: c.line2, borderRadius: 12, padding: 3 }}>{options.map((o: string) => <Pressable key={o} onPress={() => onChange(o)} style={{ flex: 1, paddingVertical: 8, borderRadius: 9, alignItems: "center", backgroundColor: value === o ? c.fg : "transparent" }}><Text style={{ color: value === o ? c.bg : c.muted, fontSize: 13, fontWeight: "500" }}>{o}</Text></Pressable>)}</View>;
}
export const Toggle = ({ value, onChange }: any) => <Switch value={value} onValueChange={onChange} trackColor={{ false: c.line2, true: c.fg }} thumbColor={value ? c.bg : c.muted} ios_backgroundColor={c.line2} />;
export const Empty = ({ icon = "inbox", title, sub, action }: any) => <View style={{ alignItems: "center", paddingVertical: 56, paddingHorizontal: 24 }}><Feather name={icon} size={28} color={c.subtle} /><T s="h" style={{ marginTop: 16, textAlign: "center" }}>{title}</T>{sub && <T s="mut" style={{ marginTop: 6, textAlign: "center" }}>{sub}</T>}{action && <View style={{ marginTop: 20, alignSelf: "stretch" }}>{action}</View>}</View>;
export const Loading = () => <View style={{ paddingVertical: 56 }}><ActivityIndicator color={c.fg} /></View>;
export const ErrorBox = ({ error, retry }: any) => <Empty icon="alert-circle" title="Something went wrong" sub={error?.message} action={retry && <Button ghost title="Try again" onPress={retry} />} />;
export const Row = ({ title, sub, right, onPress, icon }: any) => <Pressable onPress={onPress} disabled={!onPress} style={{ flexDirection: "row", alignItems: "center", gap: 14, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: c.line }}>{icon && <Feather name={icon} size={18} color={c.muted} />}<View style={{ flex: 1 }}><T>{title}</T>{sub && <T s="sub" style={{ marginTop: 2 }}>{sub}</T>}</View>{right ?? (onPress && <Feather name="chevron-right" size={18} color={c.subtle} />)}</Pressable>;
export function TypeIcon({ type }: any) {
  if (type === "gap") return <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderStyle: "dashed", borderColor: c.fg }} />;
  return <Feather name={type === "conflict" ? "repeat" : type === "outdated" ? "clock" : "help-circle"} size={18} color={c.fg} />;
}
export const dt = (x?: string) => (x ? new Date(x).toLocaleDateString() : "");
