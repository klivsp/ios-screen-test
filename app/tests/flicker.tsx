import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TestCloseButton } from "@/components/test-shell";
import { markTested } from "@/lib/test-history";

const { width } = Dimensions.get("window");
const BAR_WIDTH = 5;

const SPEEDS = [
  { label: "Slow", duration: 3200 },
  { label: "Medium", duration: 1600 },
  { label: "Fast", duration: 750 },
];

export default function FlickerTest() {
  const router = useRouter();
  const [speedIndex, setSpeedIndex] = useState(1);
  const [showInfo, setShowInfo] = useState(true);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: SPEEDS[speedIndex].duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: SPEEDS[speedIndex].duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [speedIndex, progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - BAR_WIDTH],
  });

  const exit = () => {
    markTested("flicker");
    router.back();
  };

  return (
    <View style={s.flex}>
      <StatusBar hidden />
      <View style={s.stage}>
        <Animated.View style={[s.bar, { transform: [{ translateX }] }]} />

        <TestCloseButton onPress={exit} />

        {showInfo && (
          <TouchableOpacity style={s.infoBanner} onPress={() => setShowInfo(false)} activeOpacity={0.85}>
            <Text style={s.infoTitle}>Flicker (PWM) Test</Text>
            <Text style={s.infoText}>
              Lower this screen&apos;s brightness in Control Center, then film it with a
              second phone&apos;s slow-motion camera. Moving dark bands in the recording
              mean this display dims its backlight with PWM. Tap to hide this box.
            </Text>
          </TouchableOpacity>
        )}

        <View style={s.speedRow}>
          {SPEEDS.map((sp, i) => (
            <TouchableOpacity
              key={sp.label}
              style={[s.speedBtn, i === speedIndex && s.speedBtnActive]}
              onPress={() => setSpeedIndex(i)}
            >
              <Text style={[s.speedTxt, i === speedIndex && s.speedTxtActive]}>{sp.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  stage: { flex: 1, backgroundColor: "#000000" },
  bar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: BAR_WIDTH,
    backgroundColor: "#ffffff",
  },
  infoBanner: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: "rgba(20,20,20,0.88)",
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  infoTitle: { color: "#fff", fontSize: 15, fontWeight: "800" },
  infoText: { color: "rgba(255,255,255,0.7)", fontSize: 12, lineHeight: 18 },
  speedRow: {
    position: "absolute",
    bottom: 50,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  speedBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "transparent",
  },
  speedBtnActive: { backgroundColor: "rgba(167,139,250,0.16)", borderColor: "#a78bfa" },
  speedTxt: { color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "600" },
  speedTxtActive: { color: "#a78bfa" },
});
