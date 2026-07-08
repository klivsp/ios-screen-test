import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TestHeader } from "@/components/test-shell";
import { markTested } from "@/lib/test-history";
import { useAppTheme } from "@/lib/theme";

// Controls sit on top of the live camera feed, so they intentionally stay
// dark/translucent regardless of the app's light/dark appearance setting.
const PANEL_BG = "rgba(255,255,255,0.10)";
const TEXT_DIM = "rgba(255,255,255,0.5)";

const STROBE_HZ = [2, 5, 10];

export default function FlashlightTest() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [torchOn, setTorchOn] = useState(false);
  const [strobeHz, setStrobeHz] = useState<number | null>(null);
  const strobeTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission, requestPermission]);

  useEffect(() => {
    return () => {
      if (strobeTimer.current) clearInterval(strobeTimer.current);
    };
  }, []);

  const toggleTorch = () => {
    if (strobeHz) stopStrobe();
    setTorchOn((v) => !v);
  };

  const startStrobe = (hz: number) => {
    if (strobeTimer.current) clearInterval(strobeTimer.current);
    setStrobeHz(hz);
    setTorchOn(true);
    let on = true;
    strobeTimer.current = setInterval(() => {
      on = !on;
      setTorchOn(on);
    }, 1000 / (hz * 2));
  };

  const stopStrobe = () => {
    if (strobeTimer.current) clearInterval(strobeTimer.current);
    strobeTimer.current = null;
    setStrobeHz(null);
    setTorchOn(false);
  };

  const exit = () => {
    stopStrobe();
    setTorchOn(false);
    markTested("flashlight");
    router.back();
  };

  const hasPermission = permission?.granted;

  return (
    <View style={[s.flex, { backgroundColor: colors.bg }]}>
      <StatusBar hidden={false} barStyle="light-content" />
      {hasPermission && (
        <CameraView style={StyleSheet.absoluteFillObject} facing="back" enableTorch={torchOn} />
      )}
      <View style={s.overlay}>
        <TestHeader
          title="Flashlight Test"
          subtitle="Check your torch/LED flash"
          onBack={exit}
          forceDark={hasPermission}
        />

        {!hasPermission ? (
          <View style={s.centerMsg}>
            <Text style={[s.msgText, { color: colors.textDim }]}>
              Camera access is needed to control the flashlight.
            </Text>
            <TouchableOpacity style={s.permBtn} onPress={requestPermission}>
              <Text style={s.btnTxt}>Grant Access</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={s.controls}>
            <TouchableOpacity
              style={[s.torchBtn, torchOn && s.torchBtnOn]}
              onPress={toggleTorch}
              activeOpacity={0.8}
            >
              <Text style={s.torchIcon}>🔦</Text>
              <Text style={s.torchLabel}>{torchOn ? "ON" : "OFF"}</Text>
            </TouchableOpacity>

            <Text style={s.strobeLabel}>Strobe</Text>
            <View style={s.strobeRow}>
              {STROBE_HZ.map((hz) => (
                <TouchableOpacity
                  key={hz}
                  style={[s.strobeBtn, strobeHz === hz && s.strobeBtnActive]}
                  onPress={() => startStrobe(hz)}
                >
                  <Text style={s.strobeTxt}>{hz} Hz</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={s.strobeBtn} onPress={stopStrobe}>
                <Text style={s.strobeTxt}>Stop</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  overlay: { flex: 1 },
  centerMsg: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40, gap: 16 },
  msgText: { fontSize: 14, textAlign: "center" },
  permBtn: {
    backgroundColor: "#007aff",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnTxt: { color: "#fff", fontWeight: "700", fontSize: 15 },
  controls: { flex: 1, alignItems: "center", justifyContent: "center", gap: 28 },
  torchBtn: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: PANEL_BG,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
  },
  torchBtnOn: {
    backgroundColor: "rgba(253,224,71,0.18)",
    borderColor: "#fde047",
  },
  torchIcon: { fontSize: 44 },
  torchLabel: { color: "#fff", fontWeight: "800", fontSize: 16, letterSpacing: 1 },
  strobeLabel: { color: TEXT_DIM, fontSize: 11, letterSpacing: 2, fontWeight: "600" },
  strobeRow: { flexDirection: "row", gap: 10 },
  strobeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: PANEL_BG,
    borderWidth: 1,
    borderColor: "transparent",
  },
  strobeBtnActive: { borderColor: "#fde047", backgroundColor: "rgba(253,224,71,0.14)" },
  strobeTxt: { color: "#fff", fontWeight: "600", fontSize: 13 },
});
