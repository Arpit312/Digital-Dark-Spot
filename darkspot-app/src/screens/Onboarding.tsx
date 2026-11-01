import React, { useRef, useState, useCallback } from "react";
import { View, FlatList, Dimensions, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { T, Button, FadeIn } from "../ui";
import { c, r, sp } from "../theme";
import { useAuth } from "../auth";

const { width: W, height: H } = Dimensions.get("window");

const slides = [
  {
    icon: "search",
    title: "Find what's\nmissing",
    desc: "Add your sources. See the gaps, conflicts, and outdated information they contain.",
    color: c.accent,
  },
  {
    icon: "repeat",
    title: "Catch\nconflicts",
    desc: "Spot where two sources disagree — with both exact quotes side by side.",
    color: c.warning,
  },
  {
    icon: "shield",
    title: "Evidence-backed\nchecklist",
    desc: "Every finding is verified with quotes. Get a prioritized action checklist.",
    color: c.info,
  },
];

export default function Onboarding({ navigation }: any) {
  const { markSeen } = useAuth();
  const [i, setI] = useState(0);
  const ref = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const done = async () => {
    await markSeen();
    navigation.replace("Login");
  };

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const renderItem = useCallback(
    ({ item, index }: any) => (
      <View
        style={{
          width: W,
          paddingHorizontal: 32,
          paddingTop: H * 0.15,
          paddingBottom: 40,
        }}
      >
        <FadeIn>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: item.color + "18",
              borderWidth: 1,
              borderColor: item.color + "30",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 32,
            }}
          >
            <Feather name={item.icon} size={32} color={item.color} />
          </View>
          <T s="hero">{item.title}</T>
          <T s="mut" style={{ marginTop: 16, fontSize: 16, lineHeight: 24 }}>
            {item.desc}
          </T>
        </FadeIn>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <FlatList
        ref={ref}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(s) => s.icon}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) =>
          setI(Math.round(e.nativeEvent.contentOffset.x / W))
        }
        renderItem={renderItem}
      />

      <View style={{ padding: 24, gap: 20 }}>
        {/* Dot indicators */}
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {slides.map((s, k) => {
            const inputRange = [(k - 1) * W, k * W, (k + 1) * W];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 28, 8],
              extrapolate: "clamp",
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={k}
                style={{
                  height: 4,
                  width: dotWidth,
                  borderRadius: 2,
                  backgroundColor: s.color,
                  opacity,
                }}
              />
            );
          })}
        </View>

        <Button
          title={i === slides.length - 1 ? "Get Started" : "Next"}
          icon={i === slides.length - 1 ? "arrow-right" : undefined}
          onPress={() =>
            i === slides.length - 1
              ? done()
              : ref.current?.scrollToIndex({ index: i + 1 })
          }
        />
        {i < slides.length - 1 && (
          <Button ghost title="Skip" onPress={done} />
        )}
      </View>
    </SafeAreaView>
  );
}
