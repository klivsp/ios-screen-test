import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  PanResponder,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { markTested } from "@/lib/test-history";

export default function ResponseTest() {
  const router = useRouter();
  const [tapLog, setTapLog] = useState<{ ms: number; x: number; y: number }[]>([]);
  const tapStartRef = useRef(0);

  const respPR = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        tapStartRef.current = Date.now();
      },
      onPanResponderRelease: (e) => {
        const ms = Date.now() - tapStartRef.current;
        const { locationX, locationY } = e.nativeEvent;
        setTapLog((p) => [...p.slice(-19), { ms, x: locationX, y: locationY }]);
      },
    }),
  ).current;

  const exit = () => {
    markTested("response");
    setTapLog([]);
    router.back();
  };

  const avg =
    tapLog.length > 0
      ? Math.round(tapLog.reduce((a, t) => a + t.ms, 0) / tapLog.length)
      : 0;
  const last = tapLog[tapLog.length - 1];

  return (
    <View style={s.flex}>
      <StatusBar hidden />
      <View style={[s.flex, { backgroundColor: "#060a10" }]}>
        <View {...respPR.panHandlers} style={StyleSheet.absoluteFill} />

        {tapLog.slice(-5).map((tap, i) => (
          <View
            key={i}
            pointerEvents="none"
            style={[
              s.ripple,
              { left: tap.x - 30, top: tap.y - 30, opacity: (i + 1) / 5 },
            ]}
          />
        ))}

        <View style={s.respPanel} pointerEvents="none">
          <Text style={s.respTitle}>Response Test</Text>
          <Text style={s.respSub}>Tap anywhere to measure touch latency</Text>
          <View style={s.respStats}>
            {[
              { val: last ? `${last.ms}ms` : "—", key: "Last tap", color: "#facc15" },
              { val: tapLog.length > 0 ? `${avg}ms` : "—", key: "Average", color: "#38bdf8" },
              { val: String(tapLog.length), key: "Taps", color: "#4ade80" },
            ].map((item, i) => (
              <View
                key={item.key}
                style={[
                  s.respStat,
                  i > 0 && { borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.1)" },
                ]}
              >
                <Text style={[s.respVal, { color: item.color }]}>{item.val}</Text>
                <Text style={s.respKey}>{item.key}</Text>
              </View>
            ))}
          </View>
          <View style={s.barChart}>
            {tapLog.slice(-10).map((t, i) => {
              const pct = Math.min(t.ms / 200, 1);
              const col = t.ms < 60 ? "#4ade80" : t.ms < 120 ? "#facc15" : "#f87171";
              return (
                <View key={i} style={s.barWrap}>
                  <View
                    style={[s.bar, { height: Math.max(pct * 52, 4), backgroundColor: col }]}
                  />
                </View>
              );
            })}
          </View>
        </View>

        <TouchableOpacity style={s.centeredExitBtn} onPress={exit}>
          <Text style={s.btnTxt}>Exit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  ripple: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: "rgba(250,204,21,0.7)",
  },
  respPanel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 52,
    paddingHorizontal: 20,
  },
  respTitle: { fontSize: 22, fontWeight: "800", color: "#fff", marginBottom: 4 },
  respSub: { fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 16 },
  respStats: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 14,
  },
  respStat: { flex: 1, alignItems: "center", paddingVertical: 12 },
  respVal: { fontSize: 22, fontWeight: "900" },
  respKey: { fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 },
  barChart: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 60,
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingBottom: 4,
  },
  barWrap: { flex: 1, height: "100%", justifyContent: "flex-end" },
  bar: { width: "100%", borderRadius: 2 },
  centeredExitBtn: {
    position: "absolute",
    bottom: 32,
    alignSelf: "center",
    backgroundColor: "#007aff",
    paddingHorizontal: 48,
    paddingVertical: 15,
    borderRadius: 12,
  },
  btnTxt: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
