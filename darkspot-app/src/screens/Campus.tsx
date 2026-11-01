import React, { useState } from "react";
import { View } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Feather } from "@expo/vector-icons";
import { Screen, Header, T, Card, Button, Empty, FadeIn, ScaleIn, Badge, GlowCard } from "../ui";
import { api } from "../api";
import { c, r, sp } from "../theme";

export default function Campus() {
  const [gaps, setGaps] = useState<any[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  const pick = async () => {
    try {
      const r = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        multiple: true,
      });
      if (r.canceled) return;

      setBusy(true);
      setErr("");
      setFiles(r.assets.map((f) => f.name));

      const form = new FormData();
      r.assets.forEach((f) =>
        form.append("files", {
          uri: f.uri,
          name: f.name,
          type: "application/pdf",
        } as any)
      );
      const res = await api("/campus/check", { form });
      setGaps(res.gaps ?? []);
    } catch (e: any) {
      setErr(e.message || "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen>
      <Header back eyebrow="CAMPUS MODE" title="College notices" />

      <FadeIn>
        <GlowCard style={{ marginBottom: 24 }}>
          <View style={{ flexDirection: "row", gap: 14, alignItems: "center" }}>
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                backgroundColor: c.grad4 + "18",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Feather name="book-open" size={22} color={c.grad4} />
            </View>
            <View style={{ flex: 1 }}>
              <T s="body" style={{ fontWeight: "600" }}>
                Upload & Audit
              </T>
              <T s="mut" style={{ marginTop: 4, fontSize: 13 }}>
                Upload admission, exam, scholarship or hostel notices to find
                gaps and conflicts.
              </T>
            </View>
          </View>
        </GlowCard>
      </FadeIn>

      <FadeIn delay={100}>
        <Button
          icon="upload"
          title="Choose Notices (PDF)"
          onPress={pick}
          loading={busy}
        />
      </FadeIn>

      {/* Uploaded files */}
      {files.length > 0 && (
        <FadeIn delay={150}>
          <T s="sub" style={{ marginTop: 14, marginBottom: 8 }}>
            {files.length} file{files.length > 1 ? "s" : ""} uploaded
          </T>
          {files.map((f, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingVertical: 6,
              }}
            >
              <Feather name="file" size={14} color={c.muted} />
              <T s="mut" numberOfLines={1}>
                {f}
              </T>
            </View>
          ))}
        </FadeIn>
      )}

      {/* Error */}
      {!!err && (
        <View
          style={{
            backgroundColor: c.dangerDim,
            borderRadius: r.md,
            padding: 14,
            marginTop: 12,
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

      {/* Results */}
      <View style={{ marginTop: 24, gap: 12 }}>
        {gaps === null ? (
          <Empty icon="file-text" title="No notices checked" sub="Upload PDFs to scan for gaps and conflicts." />
        ) : gaps.length === 0 ? (
          <Empty
            icon="check-circle"
            title="No gaps found"
            sub="Everything looks consistent in the notices reviewed."
          />
        ) : (
          <>
            <T s="eyebrow" style={{ marginBottom: 4 }}>
              {gaps.length} ISSUE{gaps.length > 1 ? "S" : ""} FOUND
            </T>
            {gaps.map((g, i) => (
              <ScaleIn key={i} delay={i * 60}>
                <Card
                  style={{
                    borderLeftWidth: 3,
                    borderLeftColor: c.warning,
                  }}
                >
                  <T s="body" style={{ fontWeight: "600" }}>
                    {g.title}
                  </T>
                  {!!g.detail && (
                    <T s="mut" style={{ marginTop: 6 }}>
                      {g.detail}
                    </T>
                  )}
                  {g.type && (
                    <Badge
                      color={g.type === "conflict" ? c.danger : c.warning}
                    >
                      {g.type}
                    </Badge>
                  )}
                </Card>
              </ScaleIn>
            ))}
          </>
        )}
      </View>
    </Screen>
  );
}
