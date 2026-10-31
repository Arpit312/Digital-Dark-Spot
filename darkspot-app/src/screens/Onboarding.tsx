import React, { useRef, useState } from "react";
import { View, FlatList, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { T, Button, FadeIn } from "../ui";
import { c } from "../theme";
import { useAuth } from "../auth";
const W = Dimensions.get("window").width;
const slides = [["search", "Find what is missing", "Add your sources. See the gaps they leave."], ["repeat", "Catch conflicts", "Spot where two sources disagree, with both quotes."], ["check-circle", "Know what to verify", "Get a checklist backed by evidence."]];
export default function Onboarding({ navigation }: any) {
  const { markSeen } = useAuth(); const [i, setI] = useState(0); const ref = useRef<FlatList>(null);
  const done = async () => { await markSeen(); navigation.replace("Login"); };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <FlatList ref={ref} data={slides} horizontal pagingEnabled showsHorizontalScrollIndicator={false} keyExtractor={(s) => s[0]} onMomentumScrollEnd={(e) => setI(Math.round(e.nativeEvent.contentOffset.x / W))}
        renderItem={({ item }) => <View style={{ width: W, padding: 32, justifyContent: "center" }}><FadeIn><Feather name={item[0] as any} size={40} color={c.fg} /><T s="title" style={{ marginTop: 28, fontSize: 34 }}>{item[1]}</T><T s="mut" style={{ marginTop: 12, fontSize: 16 }}>{item[2]}</T></FadeIn></View>} />
      <View style={{ padding: 24, gap: 20 }}>
        <View style={{ flexDirection: "row", gap: 6, justifyContent: "center" }}>{slides.map((_, k) => <View key={k} style={{ height: 4, width: k === i ? 24 : 8, borderRadius: 2, backgroundColor: k === i ? c.fg : c.line2 }} />)}</View>
        <Button title={i === slides.length - 1 ? "Get started" : "Next"} onPress={() => (i === slides.length - 1 ? done() : ref.current?.scrollToIndex({ index: i + 1 }))} />
        {i < slides.length - 1 && <Button ghost title="Skip" onPress={done} />}
      </View>
    </SafeAreaView>
  );
}
