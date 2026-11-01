import React, { useState } from "react";
import { View, Pressable } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Feather } from "@expo/vector-icons";
import { Screen, Header, T, Input, Button, Seg, Card, FadeIn, ScaleIn, Badge } from "../ui";
import { api } from "../api";
import { c, r, sp } from "../theme";

export default function Analyze({ navigation }: any) {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("Auto");
  const [depth, setDepth] = useState("Standard");
  const [tab, setTab] = useState("URL");
  const [val, setVal] = useState("");
  const [src, setSrc] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const add = () => {
    if (val.trim()) {
      setSrc([...src, { type: tab === "URL" ? "url" : "text", value: val.trim() }]);
      setVal("");
    }
  };

  const pick = async () => {
    try {
      const r = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
      if (r.canceled) return;
      const f = r.assets[0];
      const form = new FormData();
      form.append("file", {
        uri: f.uri,
        name: f.name,
        type: "application/pdf",
      } as any);
      const up = await api("/sources/upload", { form });
      setSrc((s) => [...s, { type: "pdf", id: up.id, value: f.name }]);
    } catch (e: any) {
      setErr(e.message || "Failed to upload PDF");
    }
  };

  const run = async () => {
    setBusy(true);
    setErr("");
    try {
      const r = await api("/analyze", {
        body: { question: q, topic, depth, sources: src },
      });
      setQ("");
      setSrc([]);
      navigation.navigate("Progress", { id: r.id });
    } catch (e: any) {
      setErr(e.message || "Analysis failed");
    } finally {
      setBusy(false);
    }
  };

  const sourceIcons: any = { pdf: "file", url: "link", text: "type" };
  const sourceColors: any = { pdf: c.danger, url: c.info, text: c.muted };

  return (
    <Screen>
      <Header eyebrow="ANALYZE" title="Ask. Add sources." />
      <FadeIn style={{ gap: 22 }}>
        {/* Question input */}
        <View>
          <T s="sub" style={{ marginBottom: 8, color: c.muted }}>
            YOUR QUESTION
          </T>
          <Input
            multiline
            placeholder="What should I verify before applying for NSP scholarship?"
            value={q}
            onChangeText={setQ}
            maxLength={300}
          />
          <T s="sub" style={{ marginTop: 4, textAlign: "right" }}>
            {q.length}/300
          </T>
        </View>

        {/* Topic selector */}
        <View style={{ gap: 8 }}>
          <T s="sub" style={{ color: c.muted }}>
            TOPIC
          </T>
          <Seg
            value={topic}
            onChange={setTopic}
            options={["Auto", "Scholarship", "Admission", "Scheme"]}
          />
        </View>

        {/* Depth selector */}
        <View style={{ gap: 8 }}>
          <T s="sub" style={{ color: c.muted }}>
            ANALYSIS DEPTH
          </T>
          <Seg
            value={depth}
            onChange={setDepth}
            options={["Quick", "Standard", "Deep"]}
          />
          <T s="sub">
            {depth === "Quick"
              ? "⚡ Fast scan, basic coverage"
              : depth === "Standard"
              ? "🔍 Balanced depth and speed"
              : "🔬 Thorough multi-agent deep analysis"}
          </T>
        </View>

        {/* Sources */}
        <View style={{ gap: 10 }}>
          <T s="sub" style={{ color: c.muted }}>
            SOURCES ({src.length} added)
          </T>
          <Seg
            value={tab}
            onChange={setTab}
            options={["URL", "PDF", "Paste"]}
          />

          {tab === "PDF" ? (
            <Button ghost icon="upload" title="Choose a PDF" onPress={pick} />
          ) : (
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Input
                style={{ flex: 1 }}
                placeholder={tab === "URL" ? "https://..." : "Paste text content"}
                value={val}
                onChangeText={setVal}
                autoCapitalize="none"
                onSubmitEditing={add}
              />
              <Button
                ghost
                title="Add"
                onPress={add}
                style={{ width: 72 }}
                disabled={!val.trim()}
              />
            </View>
          )}

          {src.map((s, i) => (
            <ScaleIn key={i} delay={i * 40}>
              <Card
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 12,
                  gap: 10,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    backgroundColor: (sourceColors[s.type] || c.muted) + "18",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Feather
                    name={sourceIcons[s.type] || "file"}
                    size={14}
                    color={sourceColors[s.type] || c.muted}
                  />
                </View>
                <T style={{ flex: 1 }} numberOfLines={1}>
                  {s.value}
                </T>
                <Badge color={sourceColors[s.type]}>{s.type.toUpperCase()}</Badge>
                <Pressable
                  onPress={() => setSrc(src.filter((_, j) => j !== i))}
                  hitSlop={10}
                >
                  <Feather name="x" size={16} color={c.muted} />
                </Pressable>
              </Card>
            </ScaleIn>
          ))}
        </View>

        {/* Error */}
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

        {/* Submit */}
        <Button
          icon="zap"
          title="Run Analysis"
          onPress={run}
          loading={busy}
          disabled={!q.trim() && !src.length}
        />

        <T s="sub" style={{ textAlign: "center", marginTop: 4 }}>
          Findings are potential gaps, not guaranteed facts. Always verify on the official source.
        </T>
      </FadeIn>
    </Screen>
  );
}
