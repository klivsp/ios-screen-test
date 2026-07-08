import * as Brightness from "expo-brightness";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TestCloseButton } from "@/components/test-shell";
import { markTested } from "@/lib/test-history";

export default function SunlightTest() {
  const router = useRouter();
  const [showInfo, setShowInfo] = useState(true);
  const originalBrightness = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      originalBrightness.current = await Brightness.getBrightnessAsync();
      await Brightness.setBrightnessAsync(1);
    })();
    return () => {
      if (originalBrightness.current !== null) {
        Brightness.setBrightnessAsync(originalBrightness.current);
      }
    };
  }, []);

  const exit = () => {
    if (originalBrightness.current !== null) {
      Brightness.setBrightnessAsync(originalBrightness.current);
    }
    markTested("sunlight");
    router.back();
  };

  return (
    <View style={s.flex}>
      <StatusBar hidden />
      <TouchableOpacity style={s.stage} onPress={() => setShowInfo(false)} activeOpacity={1}>
        <TestCloseButton onPress={exit} light />

        {showInfo && (
          <View style={s.infoBanner}>
            <Text style={s.infoTitle}>☀️ Sunlight Readability Test</Text>
            <Text style={s.infoText}>
              Brightness is forced to maximum. Take your phone outside into direct
              sunlight and check whether this text stays readable — a dim or
              washed-out result usually means low outdoor brightness or heavy glare
              from the screen coating. Tap anywhere to hide this box.
            </Text>
          </View>
        )}

        <Text style={s.tapExit}>Tap the ✕ to exit and restore your brightness</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  stage: { flex: 1, backgroundColor: "#ffffff" },
  infoBanner: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 14,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.08)",
  },
  infoTitle: { color: "#111", fontSize: 15, fontWeight: "800" },
  infoText: { color: "#333", fontSize: 12, lineHeight: 18 },
  tapExit: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    fontSize: 13,
    color: "#666",
  },
});
