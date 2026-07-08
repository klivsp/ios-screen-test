import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TestCloseButton } from "@/components/test-shell";
import { markTested } from "@/lib/test-history";

const { width, height } = Dimensions.get("window");

export default function NotchTest() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showInfo, setShowInfo] = useState(true);

  const exit = () => {
    markTested("notch");
    router.back();
  };

  return (
    <View style={s.flex}>
      <StatusBar hidden />
      <View style={s.stage}>
        {/* Full-screen crosshair for bezel/digitizer symmetry */}
        <View style={[s.hLine, { top: height / 2 }]} />
        <View style={[s.vLine, { left: width / 2 }]} />

        {/* iOS-reported sensor-housing boundary (top) */}
        {insets.top > 0 && <View style={[s.boundaryLine, { top: insets.top }]} />}
        {/* iOS-reported home-indicator boundary (bottom) */}
        {insets.bottom > 0 && (
          <View style={[s.boundaryLine, { bottom: insets.bottom }]} />
        )}

        <TestCloseButton onPress={exit} />

        {showInfo && (
          <TouchableOpacity style={s.infoBanner} onPress={() => setShowInfo(false)} activeOpacity={0.85}>
            <Text style={s.infoTitle}>Notch &amp; Bezel Test</Text>
            <Text style={s.infoText}>
              The dashed lines mark the exact sensor-housing and home-indicator
              boundaries iOS reports for your device. In a dark room, check for light
              bleed or misalignment along these lines and the crosshair — signs of a
              poorly seated or non-original display. Tap to hide this box.
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  stage: { flex: 1, backgroundColor: "#000000" },
  hLine: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: "rgba(255,255,255,0.5)" },
  vLine: { position: "absolute", top: 0, bottom: 0, width: 1, backgroundColor: "rgba(255,255,255,0.5)" },
  boundaryLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#a78bfa",
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
});
