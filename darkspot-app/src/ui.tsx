import React, { useEffect, useRef, memo } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Animated,
  ScrollView,
  RefreshControl,
  Platform,
  Switch,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { c, r, sp } from "./theme";

// Text style presets
const st = StyleSheet.create({
  hero: {
    color: c.fg,
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -1.2,
    lineHeight: 40,
  },
  title: {
    color: c.fg,
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.8,
  },
  h: { color: c.fg, fontSize: 17, fontWeight: "600" },
  h2: { color: c.fg, fontSize: 20, fontWeight: "700", letterSpacing: -0.4 },
  body: { color: c.fg, fontSize: 15, lineHeight: 22 },
  mut: { color: c.muted, fontSize: 14, lineHeight: 20 },
  sub: { color: c.subtle, fontSize: 12, lineHeight: 16 },
  eyebrow: {
    color: c.accent,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
  },
  mono: {
    color: c.fg,
    fontSize: 13,
    lineHeight: 20,
    fontFamily: Platform.select({ ios: "Menlo", android: "monospace" }),
  },
  accent: { color: c.accent, fontSize: 15, fontWeight: "600" },
});

// Optimized Text component
export const T = memo(({ children, s = "body", style, ...p }: any) => (
  <Text {...p} style={[st[s as keyof typeof st], style]}>
    {children}
  </Text>
));

// Fade-in animation
export function FadeIn({ children, delay = 0, style }: any) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration: 400,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={[
        {
          opacity: v,
          transform: [
            {
              translateY: v.interpolate({
                inputRange: [0, 1],
                outputRange: [12, 0],
              }),
            },
          ],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

// Scale-in animation for cards
export function ScaleIn({ children, delay = 0, style }: any) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(v, {
      toValue: 1,
      delay,
      useNativeDriver: true,
      damping: 15,
      stiffness: 150,
    }).start();
  }, []);
  return (
    <Animated.View
      style={[
        {
          opacity: v,
          transform: [
            {
              scale: v.interpolate({
                inputRange: [0, 1],
                outputRange: [0.92, 1],
              }),
            },
          ],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

// Screen wrapper
export function Screen({ children, scroll = true, refresh, noPad }: any) {
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={{
        padding: noPad ? 0 : sp.xl,
        paddingBottom: 48,
      }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      refreshControl={
        refresh ? (
          <RefreshControl
            refreshing={!!refresh.refreshing}
            onRefresh={refresh.onRefresh}
            tintColor={c.accent}
          />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  ) : (
    <View style={{ flex: 1, padding: noPad ? 0 : sp.xl }}>{children}</View>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      {body}
    </SafeAreaView>
  );
}

// Header component
export function Header({ title, eyebrow, back, right }: any) {
  const nav: any = useNavigation();
  return (
    <View style={{ marginBottom: sp.xl }}>
      {back && (
        <Pressable
          onPress={() => nav.goBack()}
          style={{
            marginBottom: sp.md,
            alignSelf: "flex-start",
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: c.surface,
            borderWidth: 1,
            borderColor: c.line,
            alignItems: "center",
            justifyContent: "center",
          }}
          hitSlop={12}
        >
          <Feather name="arrow-left" size={18} color={c.fg} />
        </Pressable>
      )}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          {eyebrow && (
            <T s="eyebrow" style={{ marginBottom: 6 }}>
              {eyebrow}
            </T>
          )}
          <T s="title">{title}</T>
        </View>
        {right}
      </View>
    </View>
  );
}

// Premium Card component with subtle glow border
export const Card = memo(({ children, style, onPress, accent: isAccent }: any) => {
  const baseStyle = {
    backgroundColor: c.card,
    borderColor: isAccent ? c.accent + "40" : c.line,
    borderWidth: 1,
    borderRadius: r.lg,
    padding: sp.lg,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }: any) => [
          {
            ...baseStyle,
            ...(pressed ? { opacity: 0.85, transform: [{ scale: 0.98 }] } : {}),
          },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[baseStyle, style]}>
      {children}
    </View>
  );
});

// Gradient-like accent card (using border glow)
export function GlowCard({ children, style, onPress }: any) {
  const baseStyle = {
    backgroundColor: c.accentSoft,
    borderColor: c.accent + "30",
    borderWidth: 1,
    borderRadius: r.lg,
    padding: sp.lg,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }: any) => [
          { ...baseStyle, ...(pressed ? { opacity: 0.85 } : {}) },
          style,
        ]}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[baseStyle, style]}>
      {children}
    </View>
  );
}

// Primary button with accent gradient feel
export function Button({ title, onPress, ghost, loading, disabled, icon, style, danger, small }: any) {
  const off = disabled || loading;
  const h = small ? 40 : 50;
  const bg = danger ? c.danger : ghost ? "transparent" : c.accent;
  const fg = ghost ? c.fg : danger ? c.fg : c.bg;
  const border = ghost ? c.line2 : "transparent";

  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      style={({ pressed }) => [
        {
          height: h,
          borderRadius: r.md,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
          backgroundColor: bg,
          borderWidth: ghost ? 1 : 0,
          borderColor: border,
          opacity: off ? 0.4 : pressed ? 0.8 : 1,
          transform: [{ scale: pressed && !off ? 0.97 : 1 }],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon && <Feather name={icon} size={small ? 14 : 16} color={fg} />}
          <Text
            style={{
              color: fg,
              fontWeight: "700",
              fontSize: small ? 13 : 15,
              letterSpacing: 0.2,
            }}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

// Modern Input
export const Input = (p: any) => (
  <TextInput
    placeholderTextColor={c.subtle}
    selectionColor={c.accent}
    {...p}
    style={[
      {
        minHeight: 50,
        borderRadius: r.md,
        borderWidth: 1,
        borderColor: c.line,
        backgroundColor: c.surface,
        color: c.fg,
        paddingHorizontal: 16,
        fontSize: 15,
      },
      p.multiline && {
        paddingTop: 14,
        minHeight: 100,
        textAlignVertical: "top",
      },
      p.style,
    ]}
  />
);

// Badge
export const Badge = ({ children, color }: any) => (
  <View
    style={{
      backgroundColor: color ? color + "18" : c.accentDim,
      borderRadius: r.full,
      paddingHorizontal: 10,
      paddingVertical: 4,
      alignSelf: "flex-start",
    }}
  >
    <Text
      style={{
        color: color || c.accent,
        fontSize: 11,
        fontWeight: "600",
      }}
    >
      {children}
    </Text>
  </View>
);

// Segment control
export function Seg({ value, onChange, options }: any) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: c.surface,
        borderWidth: 1,
        borderColor: c.line,
        borderRadius: r.md,
        padding: 3,
      }}
    >
      {options.map((o: string) => (
        <Pressable
          key={o}
          onPress={() => onChange(o)}
          style={{
            flex: 1,
            paddingVertical: 9,
            borderRadius: r.sm,
            alignItems: "center",
            backgroundColor: value === o ? c.accent : "transparent",
          }}
        >
          <Text
            style={{
              color: value === o ? c.bg : c.muted,
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            {o}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// Toggle switch
export const Toggle = ({ value, onChange }: any) => (
  <Switch
    value={value}
    onValueChange={onChange}
    trackColor={{ false: c.line2, true: c.accent }}
    thumbColor={value ? c.bg : c.muted}
    ios_backgroundColor={c.line2}
  />
);

// Empty state
export const Empty = ({ icon = "inbox", title, sub, action }: any) => (
  <View
    style={{
      alignItems: "center",
      paddingVertical: 56,
      paddingHorizontal: 24,
    }}
  >
    <View
      style={{
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: c.surface,
        borderWidth: 1,
        borderColor: c.line,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
      }}
    >
      <Feather name={icon} size={24} color={c.subtle} />
    </View>
    <T s="h" style={{ textAlign: "center" }}>
      {title}
    </T>
    {sub && (
      <T s="mut" style={{ marginTop: 6, textAlign: "center" }}>
        {sub}
      </T>
    )}
    {action && (
      <View style={{ marginTop: 20, alignSelf: "stretch" }}>{action}</View>
    )}
  </View>
);

// Loading spinner
export const Loading = () => (
  <View style={{ paddingVertical: 56, alignItems: "center" }}>
    <ActivityIndicator size="large" color={c.accent} />
  </View>
);

// Error box – graceful, not harsh
export const ErrorBox = ({ error, retry }: any) => (
  <Empty
    icon="wifi-off"
    title="Connection issue"
    sub={error?.message || "Could not reach the server. Check your connection."}
    action={retry && <Button ghost title="Retry" icon="refresh-cw" onPress={retry} />}
  />
);

// List row
export const Row = ({ title, sub, right, onPress, icon }: any) => (
  <Pressable
    onPress={onPress}
    disabled={!onPress}
    style={({ pressed }) => ({
      flexDirection: "row",
      alignItems: "center",
      gap: 14,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: c.line,
      opacity: pressed ? 0.7 : 1,
    })}
  >
    {icon && (
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: c.surface,
          borderWidth: 1,
          borderColor: c.line,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Feather name={icon} size={16} color={c.accent} />
      </View>
    )}
    <View style={{ flex: 1 }}>
      <T>{title}</T>
      {sub && (
        <T s="sub" style={{ marginTop: 2 }}>
          {sub}
        </T>
      )}
    </View>
    {right ??
      (onPress && <Feather name="chevron-right" size={18} color={c.subtle} />)}
  </Pressable>
);

// Finding type icon
export function TypeIcon({ type }: any) {
  const iconMap: any = {
    gap: "alert-circle",
    conflict: "repeat",
    outdated: "clock",
    unanswered: "help-circle",
  };
  const colorMap: any = {
    gap: c.warning,
    conflict: c.danger,
    outdated: c.info,
    unanswered: c.subtle,
  };
  return (
    <View
      style={{
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: (colorMap[type] || c.subtle) + "18",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Feather
        name={iconMap[type] || "help-circle"}
        size={16}
        color={colorMap[type] || c.subtle}
      />
    </View>
  );
}

// Date formatter
export const dt = (x?: string) =>
  x
    ? new Date(x).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

// Stat card
export const StatCard = ({ label, value, icon, color }: any) => (
  <Card style={{ flexGrow: 1, minWidth: "45%", padding: 14 }}>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      {icon && (
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            backgroundColor: (color || c.accent) + "18",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name={icon} size={14} color={color || c.accent} />
        </View>
      )}
      <T s="sub">{label}</T>
    </View>
    <T s="h2" style={{ marginTop: 8, fontSize: 24 }}>
      {value}
    </T>
  </Card>
);

// Divider
export const Divider = ({ label }: { label?: string }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      marginVertical: sp.lg,
      gap: 12,
    }}
  >
    <View style={{ flex: 1, height: 1, backgroundColor: c.line }} />
    {label && <T s="sub">{label}</T>}
    <View style={{ flex: 1, height: 1, backgroundColor: c.line }} />
  </View>
);

// Progress bar
export function ProgressBar({ progress, color }: { progress: number; color?: string }) {
  const w = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(w, {
      toValue: Math.min(100, Math.max(0, progress)),
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View
      style={{
        height: 6,
        borderRadius: 3,
        backgroundColor: c.line,
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={{
          height: 6,
          borderRadius: 3,
          backgroundColor: color || c.accent,
          width: w.interpolate({
            inputRange: [0, 100],
            outputRange: ["0%", "100%"],
          }),
        }}
      />
    </View>
  );
}
