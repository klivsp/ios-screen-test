import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  PanResponder,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { markTested } from "@/lib/test-history";

const { width, height } = Dimensions.get("window");
const GRID_COLS = 10;
const GRID_ROWS = 18;
const CELL_W = width / GRID_COLS;
const CELL_H = height / GRID_ROWS;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;

type Point = { x: number; y: number };
type Stroke = { points: Point[]; color: string; size: number };

const StrokeView = ({ stroke }: { stroke: Stroke | null }) => {
  if (!stroke || !stroke.points || stroke.points.length < 2) return null;
  return (
    <>
      {stroke.points.map((pt, i) => {
        if (i === 0) return null;
        const prev = stroke.points[i - 1];
        const dx = pt.x - prev.x;
        const dy = pt.y - prev.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 1) return null;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const half = stroke.size / 2;
        return (
          <View
            key={i}
            style={{
              position: "absolute",
              left: prev.x,
              top: prev.y - half,
              width: len,
              height: stroke.size,
              borderRadius: half,
              backgroundColor: stroke.color,
              transformOrigin: "0 50%",
              transform: [{ rotate: `${angle}deg` }],
            }}
          />
        );
      })}
    </>
  );
};

const BRUSH_COLORS = ["#e00", "#ff9500", "#00c853", "#007aff", "#af52de", "#000000"];
const BRUSH_SIZES = [3, 6, 10, 16];

export default function TouchTest() {
  const router = useRouter();

  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [liveStroke, setLiveStroke] = useState<Stroke | null>(null);
  const liveRef = useRef<Stroke | null>(null);
  const [brushColor, setBrushColor] = useState(BRUSH_COLORS[3]);
  const brushColorRef = useRef(BRUSH_COLORS[3]);
  const [brushSize, setBrushSize] = useState(6);
  const brushSizeRef = useRef(6);
  const [strokeCount, setStrokeCount] = useState(0);
  const [activeTouches, setActiveTouches] = useState(0);
  const [maxTouches, setMaxTouches] = useState(0);
  const [coveredCells, setCoveredCells] = useState<Set<number>>(new Set());
  const coveredRef = useRef<Set<number>>(new Set());

  const markCell = (x: number, y: number) => {
    const col = Math.floor(x / CELL_W);
    const row = Math.floor(y / CELL_H);
    if (col < 0 || col >= GRID_COLS || row < 0 || row >= GRID_ROWS) return;
    const idx = row * GRID_COLS + col;
    if (!coveredRef.current.has(idx)) {
      const next = new Set(coveredRef.current);
      next.add(idx);
      coveredRef.current = next;
      setCoveredCells(new Set(next));
    }
  };

  const drawPR = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const { locationX: x, locationY: y } = e.nativeEvent;
        const s: Stroke = {
          points: [{ x, y }],
          color: brushColorRef.current,
          size: brushSizeRef.current,
        };
        liveRef.current = s;
        setLiveStroke({ ...s });
        setActiveTouches(1);
        setMaxTouches((p) => Math.max(p, 1));
        markCell(x, y);
      },
      onPanResponderMove: (e) => {
        const { locationX: x, locationY: y } = e.nativeEvent;
        const tc = (e.nativeEvent as any).touches?.length ?? 1;
        setActiveTouches(tc);
        setMaxTouches((p) => Math.max(p, tc));
        if (!liveRef.current) return;
        const updated: Stroke = {
          ...liveRef.current,
          points: [...liveRef.current.points, { x, y }],
        };
        liveRef.current = updated;
        setLiveStroke({ ...updated });
        markCell(x, y);
      },
      onPanResponderRelease: () => {
        const finished = liveRef.current;
        liveRef.current = null;
        setLiveStroke(null);
        setActiveTouches(0);
        if (finished && finished.points.length > 1) {
          setStrokes((p) => [...p, finished]);
          setStrokeCount((p) => p + 1);
        }
      },
    }),
  ).current;

  const clearCanvas = () => {
    setStrokes([]);
    setLiveStroke(null);
    liveRef.current = null;
    coveredRef.current = new Set();
    setCoveredCells(new Set());
    setStrokeCount(0);
    setActiveTouches(0);
    setMaxTouches(0);
  };

  const exit = () => {
    markTested("touch");
    router.back();
  };

  const coveragePct = Math.round((coveredCells.size / TOTAL_CELLS) * 100);

  return (
    <View style={s.flex}>
      <StatusBar hidden />
      <View style={[s.flex, { backgroundColor: "#FFFFFF" }]}>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {Array.from({ length: GRID_ROWS }).map((_, row) =>
            Array.from({ length: GRID_COLS }).map((_, col) => {
              const idx = row * GRID_COLS + col;
              return (
                <View
                  key={idx}
                  style={{
                    position: "absolute",
                    left: col * CELL_W,
                    top: row * CELL_H,
                    width: CELL_W,
                    height: CELL_H,
                    backgroundColor: coveredCells.has(idx)
                      ? "rgba(0,122,255,0.15)"
                      : "transparent",
                    borderWidth: 0.4,
                    borderColor: "rgba(0,0,0,0.06)",
                  }}
                />
              );
            }),
          )}
        </View>

        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {strokes.map((stroke, i) => (
            <StrokeView key={i} stroke={stroke} />
          ))}
          {liveStroke && liveStroke.points.length >= 2 && (
            <StrokeView stroke={liveStroke} />
          )}
        </View>

        <View {...drawPR.panHandlers} style={StyleSheet.absoluteFill} />

        <View style={s.touchHUD} pointerEvents="none">
          <View style={s.covRow}>
            <Text style={s.covLabel}>Coverage</Text>
            <View style={s.covBg}>
              <View style={[s.covFill, { width: `${coveragePct}%` as any }]} />
            </View>
            <Text style={s.covPct}>{coveragePct}%</Text>
          </View>
          <View style={s.statsRow}>
            {[
              { val: activeTouches, key: "Active" },
              { val: maxTouches, key: "Max fingers" },
              { val: strokeCount, key: "Strokes" },
            ].map((item) => (
              <View key={item.key} style={s.statBox}>
                <Text style={s.statVal}>{item.val}</Text>
                <Text style={s.statKey}>{item.key}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={s.touchToolbar} pointerEvents="box-none">
          <View style={s.colorRow}>
            {BRUSH_COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  s.colorDot,
                  { backgroundColor: c },
                  brushColor === c && s.colorDotActive,
                ]}
                onPress={() => {
                  setBrushColor(c);
                  brushColorRef.current = c;
                }}
              />
            ))}
          </View>
          <View style={s.sizeRow}>
            {BRUSH_SIZES.map((sz) => (
              <TouchableOpacity
                key={sz}
                style={[s.sizeBtn, brushSize === sz && s.sizeBtnActive]}
                onPress={() => {
                  setBrushSize(sz);
                  brushSizeRef.current = sz;
                }}
              >
                <View
                  style={{
                    width: sz * 1.6,
                    height: sz * 1.6,
                    borderRadius: sz,
                    backgroundColor: brushColor,
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={s.bottomBtns} pointerEvents="box-none">
          <TouchableOpacity style={s.btnOrange} onPress={clearCanvas}>
            <Text style={s.btnTxt}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btnBlue} onPress={exit}>
            <Text style={s.btnTxt}>Exit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  touchHUD: { position: "absolute", top: 48, left: 12, right: 12, gap: 8 },
  covRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  covLabel: { fontSize: 11, color: "#555", width: 66 },
  covBg: {
    flex: 1,
    height: 5,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  covFill: { height: "100%", backgroundColor: "#007aff", borderRadius: 3 },
  covPct: {
    fontSize: 11,
    color: "#007aff",
    fontWeight: "700",
    width: 34,
    textAlign: "right",
  },
  statsRow: { flexDirection: "row", gap: 6 },
  statBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 10,
    padding: 8,
    alignItems: "center",
  },
  statVal: { fontSize: 20, fontWeight: "800", color: "#111" },
  statKey: { fontSize: 9, color: "#888", marginTop: 2 },
  touchToolbar: {
    position: "absolute",
    bottom: 70,
    left: 12,
    right: 12,
    gap: 10,
  },
  colorRow: { flexDirection: "row", justifyContent: "center", gap: 10 },
  colorDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: "transparent",
  },
  colorDotActive: { borderColor: "#333", transform: [{ scale: 1.2 }] },
  sizeRow: { flexDirection: "row", justifyContent: "center", gap: 12 },
  sizeBtn: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.07)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  sizeBtnActive: { backgroundColor: "rgba(0,0,0,0.14)", borderColor: "#555" },
  bottomBtns: {
    position: "absolute",
    bottom: 14,
    left: 12,
    right: 12,
    flexDirection: "row",
    gap: 10,
  },
  btnOrange: {
    flex: 1,
    backgroundColor: "#ff9500",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  btnBlue: {
    flex: 1,
    backgroundColor: "#007aff",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  btnTxt: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
