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

const MT_COLORS = [
  "#ff3b30",
  "#ff9500",
  "#34c759",
  "#007aff",
  "#af52de",
  "#ff2d55",
  "#5ac8fa",
  "#ffcc00",
];

export default function MultitouchTest() {
  const router = useRouter();
  const [mtPoints, setMtPoints] = useState<{ id: number; x: number; y: number }[]>([]);
  const [mtMax, setMtMax] = useState(0);

  const mtPR = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const ts = (e.nativeEvent as any).touches ?? [e.nativeEvent];
        const pts = ts.map((t: any) => ({
          id: t.identifier ?? 0,
          x: t.pageX ?? t.locationX,
          y: t.pageY ?? t.locationY,
        }));
        setMtPoints(pts);
        setMtMax((p) => Math.max(p, pts.length));
      },
      onPanResponderMove: (e) => {
        const ts = (e.nativeEvent as any).touches ?? [e.nativeEvent];
        const pts = ts.map((t: any) => ({
          id: t.identifier ?? 0,
          x: t.pageX ?? t.locationX,
          y: t.pageY ?? t.locationY,
        }));
        setMtPoints(pts);
        setMtMax((p) => Math.max(p, pts.length));
      },
      onPanResponderRelease: (e) => {
        if (((e.nativeEvent as any).touches ?? []).length === 0) setMtPoints([]);
      },
    }),
  ).current;

  const exit = () => {
    markTested("multitouch");
    setMtPoints([]);
    setMtMax(0);
    router.back();
  };

  return (
    <View style={s.flex}>
      <StatusBar hidden />
      <View style={[s.flex, { backgroundColor: "#05080f" }]}>
        <View {...mtPR.panHandlers} style={StyleSheet.absoluteFill} />

        {mtPoints.map((pt, i) => (
          <View
            key={pt.id}
            pointerEvents="none"
            style={[
              s.mtCircle,
              {
                left: pt.x - 44,
                top: pt.y - 44,
                borderColor: MT_COLORS[i % MT_COLORS.length],
                backgroundColor: MT_COLORS[i % MT_COLORS.length] + "30",
              },
            ]}
          >
            <Text style={[s.mtNum, { color: MT_COLORS[i % MT_COLORS.length] }]}>
              {i + 1}
            </Text>
          </View>
        ))}

        <View style={s.mtPanel} pointerEvents="none">
          <Text style={s.mtTitle}>Multitouch Test</Text>
          <Text style={s.mtSub}>Place multiple fingers on the screen</Text>
          <View style={s.mtStats}>
            <View style={s.mtStat}>
              <Text style={s.mtStatVal}>{mtPoints.length}</Text>
              <Text style={s.mtStatKey}>Current</Text>
            </View>
            <View
              style={[
                s.mtStat,
                { borderLeftWidth: 1, borderLeftColor: "rgba(255,255,255,0.1)" },
              ]}
            >
              <Text style={[s.mtStatVal, { color: "#38bdf8" }]}>{mtMax}</Text>
              <Text style={s.mtStatKey}>Max detected</Text>
            </View>
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
  mtCircle: {
    position: "absolute",
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2.5,
    alignItems: "center",
    justifyContent: "center",
  },
  mtNum: { fontSize: 26, fontWeight: "900" },
  mtPanel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 52,
    paddingHorizontal: 20,
  },
  mtTitle: { fontSize: 22, fontWeight: "800", color: "#fff", marginBottom: 4 },
  mtSub: { fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 16 },
  mtStats: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    overflow: "hidden",
  },
  mtStat: { flex: 1, alignItems: "center", paddingVertical: 14 },
  mtStatVal: { fontSize: 32, fontWeight: "900", color: "#fff" },
  mtStatKey: { fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 },
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
