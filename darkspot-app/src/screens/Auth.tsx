import React, { useState } from "react";
import { View, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, T, Input, Button, FadeIn } from "../ui";
import { useAuth } from "../auth";
import { c, r, sp } from "../theme";

function Form({ signup, navigation }: any) {
  const { login, signup: doSignup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const score = [
    pw.length >= 8,
    /[A-Z]/.test(pw),
    /\d/.test(pw),
    /[^A-Za-z0-9]/.test(pw),
  ].filter(Boolean).length;

  const strengthColors = [c.danger, c.warning, c.warning, c.success];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  const go = async () => {
    setBusy(true);
    setErr("");
    try {
      signup ? await doSignup(name, email, pw) : await login(email, pw);
    } catch (e: any) {
      setErr(e.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <FadeIn style={{ paddingTop: 48 }}>
          {/* Brand mark */}
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundColor: c.accentSoft,
              borderWidth: 1,
              borderColor: c.accent + "30",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 28,
            }}
          >
            <View style={{ gap: 4, width: 24 }}>
              <View style={{ height: 2.5, backgroundColor: c.accent, borderRadius: 2 }} />
              <View style={{ flexDirection: "row", gap: 6 }}>
                <View style={{ flex: 1, height: 2.5, backgroundColor: c.accent, borderRadius: 2 }} />
                <View style={{ flex: 1, height: 2.5, backgroundColor: c.accent, borderRadius: 2 }} />
              </View>
              <View style={{ height: 2.5, backgroundColor: c.accent, borderRadius: 2 }} />
            </View>
          </View>

          <T s="title" style={{ fontSize: 30 }}>
            {signup ? "Create your\naccount" : "Welcome\nback"}
          </T>
          <T s="mut" style={{ marginTop: 8, marginBottom: 32 }}>
            {signup
              ? "Start finding the dark spots in public information."
              : "Sign in to see your reports and alerts."}
          </T>

          <View style={{ gap: 14 }}>
            {signup && (
              <View>
                <T s="sub" style={{ marginBottom: 6, color: c.muted }}>
                  FULL NAME
                </T>
                <Input
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View>
              <T s="sub" style={{ marginBottom: 6, color: c.muted }}>
                EMAIL
              </T>
              <Input
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View>
              <T s="sub" style={{ marginBottom: 6, color: c.muted }}>
                PASSWORD
              </T>
              <View>
                <Input
                  placeholder="Enter password"
                  value={pw}
                  onChangeText={setPw}
                  secureTextEntry={!show}
                  autoCapitalize="none"
                />
                <Pressable
                  onPress={() => setShow(!show)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: 16,
                  }}
                >
                  <Feather
                    name={show ? "eye-off" : "eye"}
                    size={18}
                    color={c.muted}
                  />
                </Pressable>
              </View>
            </View>

            {signup && pw.length > 0 && (
              <View style={{ gap: 6 }}>
                <View style={{ flexDirection: "row", gap: 4 }}>
                  {[0, 1, 2, 3].map((i) => (
                    <View
                      key={i}
                      style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 2,
                        backgroundColor:
                          i < score ? strengthColors[score - 1] : c.line,
                      }}
                    />
                  ))}
                </View>
                {score > 0 && (
                  <T
                    s="sub"
                    style={{ color: strengthColors[score - 1] }}
                  >
                    {strengthLabels[score - 1]}
                  </T>
                )}
              </View>
            )}

            {!!err && (
              <View
                style={{
                  backgroundColor: c.dangerDim,
                  borderRadius: r.md,
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Feather name="alert-circle" size={16} color={c.danger} />
                <T s="mut" style={{ color: c.danger, flex: 1 }}>
                  {err}
                </T>
              </View>
            )}

            <Button
              title={signup ? "Create Account" : "Sign In"}
              onPress={go}
              loading={busy}
              disabled={!email || !pw || (signup && !name)}
              style={{ marginTop: 8 }}
            />

            {!signup && (
              <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
                <Pressable
                  onPress={async () => {
                    const e = "demo123@gmail.com";
                    const p = "demo123";
                    setEmail(e);
                    setPw(p);
                    setBusy(true);
                    setErr("");
                    try {
                      await login(e, p);
                    } catch (err: any) {
                      setErr(err.message || "Login failed");
                    } finally {
                      setBusy(false);
                    }
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    paddingHorizontal: 8,
                    borderRadius: r.sm,
                    backgroundColor: c.accentSoft,
                    borderWidth: 1,
                    borderColor: c.accent + "30",
                    alignItems: "center",
                  }}
                >
                  <T s="sub" style={{ color: c.accent, fontWeight: "600" }}>Demo Citizen</T>
                </Pressable>
                <Pressable
                  onPress={async () => {
                    const e = "admin@darkspotatlas.org";
                    const p = "admin123";
                    setEmail(e);
                    setPw(p);
                    setBusy(true);
                    setErr("");
                    try {
                      await login(e, p);
                    } catch (err: any) {
                      setErr(err.message || "Login failed");
                    } finally {
                      setBusy(false);
                    }
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    paddingHorizontal: 8,
                    borderRadius: r.sm,
                    backgroundColor: c.accentSoft,
                    borderWidth: 1,
                    borderColor: c.accent + "30",
                    alignItems: "center",
                  }}
                >
                  <T s="sub" style={{ color: c.accent, fontWeight: "600" }}>Admin Account</T>
                </Pressable>
              </View>
            )}

            <Button
              ghost
              title={
                signup ? "Already have an account" : "Create an account"
              }
              onPress={() =>
                navigation.replace(signup ? "Login" : "Signup")
              }
            />
          </View>
        </FadeIn>
      </KeyboardAvoidingView>
    </Screen>
  );
}

export const Login = (p: any) => <Form {...p} />;
export const Signup = (p: any) => <Form signup {...p} />;
