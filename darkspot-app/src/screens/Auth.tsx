import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Screen, T, Input, Button, FadeIn } from "../ui";
import { useAuth } from "../auth";
import { c } from "../theme";
function Form({ signup, navigation }: any) {
  const { login, signup: doSignup } = useAuth();
  const [name, setName] = useState(""), [email, setEmail] = useState(""), [pw, setPw] = useState(""), [show, setShow] = useState(false), [busy, setBusy] = useState(false), [err, setErr] = useState("");
  const score = [pw.length >= 8, /[A-Z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw)].filter(Boolean).length;
  const go = async () => { setBusy(true); setErr(""); try { signup ? await doSignup(name, email, pw) : await login(email, pw); } catch (e: any) { setErr(e.message); } finally { setBusy(false); } };
  return (
    <Screen><FadeIn style={{ paddingTop: 48 }}>
      <T s="title" style={{ fontSize: 32 }}>{signup ? "Create your account" : "Welcome back"}</T>
      <T s="mut" style={{ marginTop: 6, marginBottom: 28 }}>{signup ? "Start finding the dark spots." : "Sign in to see your reports."}</T>
      <View style={{ gap: 12 }}>
        {signup && <Input placeholder="Full name" value={name} onChangeText={setName} />}
        <Input placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <View><Input placeholder="Password" value={pw} onChangeText={setPw} secureTextEntry={!show} autoCapitalize="none" /><Pressable onPress={() => setShow(!show)} style={{ position: "absolute", right: 14, top: 15 }}><Feather name={show ? "eye-off" : "eye"} size={18} color={c.muted} /></Pressable></View>
        {signup && <View style={{ flexDirection: "row", gap: 4 }}>{[0, 1, 2, 3].map((i) => <View key={i} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: i < score ? c.fg : c.line2 }} />)}</View>}
        {!!err && <T s="mut" style={{ color: c.fg }}>{err}</T>}
        <Button title={signup ? "Create account" : "Sign in"} onPress={go} loading={busy} disabled={!email || !pw || (signup && !name)} />
        <Button ghost title={signup ? "I already have an account" : "Create an account"} onPress={() => navigation.replace(signup ? "Login" : "Signup")} />
      </View>
    </FadeIn></Screen>
  );
}
export const Login = (p: any) => <Form {...p} />;
export const Signup = (p: any) => <Form signup {...p} />;
