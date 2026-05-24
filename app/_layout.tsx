import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  PanResponder,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../i18n/i18n";

const { width, height } = Dimensions.get("window");

const GRID_COLS = 10;
const GRID_ROWS = 18;
const CELL_W = width / GRID_COLS;
const CELL_H = height / GRID_ROWS;
const TOTAL_CELLS = GRID_COLS * GRID_ROWS;

// ─── Helpers ──────────────────────────────────────────────────────────────────
type Point = { x: number; y: number };
type Stroke = { points: Point[]; color: string; size: number };

/** Render a stroke as a series of rotated View "segments" */
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

const App = () => {
  const { t } = useTranslation();
  const [currentTest, setCurrentTest] = useState("menu");
  const [solidColor, setSolidColor] = useState("#FFFFFF");

  // ─── Touch Draw state ────────────────────────────────────────────────────────
  const BRUSH_COLORS = [
    "#e00",
    "#ff9500",
    "#00c853",
    "#007aff",
    "#af52de",
    "#000000",
  ];
  const BRUSH_SIZES = [3, 6, 10, 16];

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

  const goToMenu = () => {
    clearCanvas();
    setCurrentTest("menu");
  };
  const coveragePct = Math.round((coveredCells.size / TOTAL_CELLS) * 100);

  // ─── Multitouch state ────────────────────────────────────────────────────────
  const [mtPoints, setMtPoints] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const [mtMax, setMtMax] = useState(0);
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
        if (((e.nativeEvent as any).touches ?? []).length === 0)
          setMtPoints([]);
      },
    }),
  ).current;

  // ─── Response state ──────────────────────────────────────────────────────────
  const [tapLog, setTapLog] = useState<{ ms: number; x: number; y: number }[]>(
    [],
  );
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

  // ─── Test list ───────────────────────────────────────────────────────────────
  const tests = [
    {
      id: "solid",
      name: t("solidColors"),
      icon: "🎨",
      desc: "Pure fill test",
      accent: ["#a78bfa", "#7c3aed"],
    },
    {
      id: "gradient",
      name: t("gradientTest"),
      icon: "🌈",
      desc: "Tone transitions",
      accent: ["#60a5fa", "#2563eb"],
    },
    {
      id: "pixel",
      name: t("deadPixelDetection"),
      icon: "🔍",
      desc: "Pixel detection",
      accent: ["#34d399", "#059669"],
    },
    {
      id: "burnin",
      name: t("burninTest"),
      icon: "🔥",
      desc: "OLED burn check",
      accent: ["#fb923c", "#ea580c"],
    },
    {
      id: "grid",
      name: t("gridPattern"),
      icon: "⊞",
      desc: "Alignment lines",
      accent: ["#f87171", "#dc2626"],
    },
    {
      id: "touch",
      name: t("touchDrawTest"),
      icon: "✏️",
      desc: "Draw & coverage",
      accent: ["#c4b5fd", "#8b5cf6"],
    },
    {
      id: "multitouch",
      name: "Multitouch Test",
      icon: "👆",
      desc: "Finger count check",
      accent: ["#38bdf8", "#0ea5e9"],
    },
    {
      id: "response",
      name: "Response Test",
      icon: "⚡",
      desc: "Tap latency check",
      accent: ["#facc15", "#d97706"],
    },
  ];

  const solidColors = [
    "#FFFFFF",
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
  ];

  // ─── MENU ────────────────────────────────────────────────────────────────────
  const renderMenu = () => (
    <View style={s.menuBg}>
      <StatusBar barStyle="light-content" backgroundColor="#0d1117" />
      <View style={[s.orb, s.orb1]} />
      <View style={[s.orb, s.orb2]} />
      <View style={[s.orb, s.orb3]} />
      <SafeAreaView style={s.flex}>
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.header}>
            <View style={s.brand}>
              <View style={s.brandDot} />
              <Text style={s.brandName}>ScreenDoctor</Text>
            </View>
            <Text style={s.heroTitle}>{t("appTitle")}</Text>
            <Text style={s.heroSub}>{t("appSubtitle")}</Text>
          </View>
          <Text style={s.sectionLabel}>TEST MODES</Text>
          <View style={s.cardGrid}>
            {tests.map((test) => (
              <TouchableOpacity
                key={test.id}
                style={s.card}
                onPress={() => setCurrentTest(test.id)}
                activeOpacity={0.75}
              >
                <LinearGradient
                  colors={[test.accent[0] + "33", test.accent[1] + "11"]}
                  style={s.cardIconWrap}
                >
                  <Text style={{ fontSize: 20 }}>{test.icon}</Text>
                </LinearGradient>
                <Text style={s.cardName}>{test.name}</Text>
                <Text style={s.cardDesc}>{test.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={s.infoBanner}>
            <Text style={{ fontSize: 14 }}>ℹ️</Text>
            <Text style={s.infoText}>
              <Text style={s.infoHL}>{t("howToUse")} </Text>
              {t("instructions")}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );

  // ─── SOLID ───────────────────────────────────────────────────────────────────
  const renderSolid = () => (
    <View style={s.flex}>
      <StatusBar hidden />
      <TouchableOpacity
        style={[s.flex, { backgroundColor: solidColor }]}
        onPress={goToMenu}
        activeOpacity={1}
      >
        <View style={s.colorSelector}>
          {solidColors.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                s.colorBtn,
                { backgroundColor: c },
                solidColor === c && s.colorBtnActive,
              ]}
              onPress={() => setSolidColor(c)}
            />
          ))}
        </View>
        <Text
          style={[
            s.tapExit,
            { color: solidColor === "#000000" ? "#FFF" : "#000" },
          ]}
        >
          {t("tapToExit")}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ─── GRADIENT ────────────────────────────────────────────────────────────────
  const renderGradient = () => (
    <View style={s.flex}>
      <StatusBar hidden />
      <TouchableOpacity style={s.flex} onPress={goToMenu} activeOpacity={1}>
        <LinearGradient colors={["#000000", "#FFFFFF"]} style={s.flex}>
          <Text style={s.gradientLabel}>{t("gradientInstruction")}</Text>
          <Text style={[s.tapExit, { color: "#888" }]}>{t("tapToExit")}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  // ─── DEAD PIXEL ──────────────────────────────────────────────────────────────
  const renderPixel = () => {
    const sz = 10;
    const rows = Math.ceil(height / sz);
    const cols = Math.ceil(width / sz);
    return (
      <View style={s.flex}>
        <StatusBar hidden />
        <TouchableOpacity style={s.flex} onPress={goToMenu} activeOpacity={1}>
          <View style={s.flex}>
            {Array.from({ length: rows }).map((_, r) => (
              <View key={r} style={{ flexDirection: "row" }}>
                {Array.from({ length: cols }).map((_, c) => (
                  <View
                    key={c}
                    style={{
                      width: sz,
                      height: sz,
                      backgroundColor: (r + c) % 2 === 0 ? "#FFF" : "#000",
                    }}
                  />
                ))}
              </View>
            ))}
            <View style={s.centeredOverlay}>
              <Text style={s.pixelText}>
                {t("deadPixelTitle")}
                {"\n"}
                {t("deadPixelInstruction")}
              </Text>
              <Text
                style={[
                  s.tapExit,
                  { position: "relative", bottom: 0, marginTop: 16 },
                ]}
              >
                {t("tapToExit")}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // ─── BURN-IN ─────────────────────────────────────────────────────────────────
  const renderBurnin = () => (
    <View style={s.flex}>
      <StatusBar hidden />
      <TouchableOpacity
        style={[s.flex, { backgroundColor: "#808080" }]}
        onPress={goToMenu}
        activeOpacity={1}
      >
        <Text style={s.burninText}>
          {t("burninTitle")}
          {"\n\n"}
          {t("burninInstruction")}
        </Text>
        <Text style={[s.tapExit, { color: "#fff" }]}>{t("tapToExit")}</Text>
      </TouchableOpacity>
    </View>
  );

  // ─── GRID ────────────────────────────────────────────────────────────────────
  const renderGrid = () => {
    const sp = 50;
    return (
      <View style={s.flex}>
        <StatusBar hidden />
        <TouchableOpacity style={s.flex} onPress={goToMenu} activeOpacity={1}>
          <View style={[s.flex, { backgroundColor: "#FFF" }]}>
            {Array.from({ length: Math.ceil(height / sp) }).map((_, i) => (
              <View
                key={`h${i}`}
                style={{
                  position: "absolute",
                  top: i * sp,
                  width: "100%",
                  height: 1,
                  backgroundColor: "#000",
                }}
              />
            ))}
            {Array.from({ length: Math.ceil(width / sp) }).map((_, i) => (
              <View
                key={`v${i}`}
                style={{
                  position: "absolute",
                  left: i * sp,
                  height: "100%",
                  width: 1,
                  backgroundColor: "#000",
                }}
              />
            ))}
            <View style={s.centeredOverlay}>
              <Text style={s.gridText}>
                {t("gridTitle")}
                {"\n"}
                {t("gridInstruction")}
              </Text>
              <Text
                style={[
                  s.tapExit,
                  { position: "relative", bottom: 0, marginTop: 12 },
                ]}
              >
                {t("tapToExit")}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // ─── TOUCH DRAW ──────────────────────────────────────────────────────────────
  const renderTouch = () => (
    <View style={s.flex}>
      <StatusBar hidden />
      {/* White canvas so all brush colors are visible */}
      <View style={[s.flex, { backgroundColor: "#FFFFFF" }]}>
        {/* Coverage grid — faint blue cells fill in as you draw */}
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

        {/* Finished strokes */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          {strokes.map((stroke, i) => (
            <StrokeView key={i} stroke={stroke} />
          ))}
          {liveStroke && liveStroke.points.length >= 2 && (
            <StrokeView stroke={liveStroke} />
          )}
        </View>

        {/* Touch capture layer — MUST be above drawings */}
        <View {...drawPR.panHandlers} style={StyleSheet.absoluteFill} />

        {/* HUD top — coverage + stats — white pill so visible on white canvas */}
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

        {/* Color + size toolbar */}
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

        {/* Bottom buttons */}
        <View style={s.bottomBtns} pointerEvents="box-none">
          <TouchableOpacity style={s.btnOrange} onPress={clearCanvas}>
            <Text style={s.btnTxt}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btnBlue} onPress={goToMenu}>
            <Text style={s.btnTxt}>Exit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // ─── MULTITOUCH ──────────────────────────────────────────────────────────────
  const renderMultitouch = () => (
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
                {
                  borderLeftWidth: 1,
                  borderLeftColor: "rgba(255,255,255,0.1)",
                },
              ]}
            >
              <Text style={[s.mtStatVal, { color: "#38bdf8" }]}>{mtMax}</Text>
              <Text style={s.mtStatKey}>Max detected</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={s.centeredExitBtn}
          onPress={() => {
            setMtPoints([]);
            setMtMax(0);
            goToMenu();
          }}
        >
          <Text style={s.btnTxt}>Exit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // ─── RESPONSE ────────────────────────────────────────────────────────────────
  const renderResponse = () => {
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
                {
                  val: last ? `${last.ms}ms` : "—",
                  key: "Last tap",
                  color: "#facc15",
                },
                {
                  val: tapLog.length > 0 ? `${avg}ms` : "—",
                  key: "Average",
                  color: "#38bdf8",
                },
                { val: String(tapLog.length), key: "Taps", color: "#4ade80" },
              ].map((item, i) => (
                <View
                  key={item.key}
                  style={[
                    s.respStat,
                    i > 0 && {
                      borderLeftWidth: 1,
                      borderLeftColor: "rgba(255,255,255,0.1)",
                    },
                  ]}
                >
                  <Text style={[s.respVal, { color: item.color }]}>
                    {item.val}
                  </Text>
                  <Text style={s.respKey}>{item.key}</Text>
                </View>
              ))}
            </View>
            <View style={s.barChart}>
              {tapLog.slice(-10).map((t, i) => {
                const pct = Math.min(t.ms / 200, 1);
                const col =
                  t.ms < 60 ? "#4ade80" : t.ms < 120 ? "#facc15" : "#f87171";
                return (
                  <View key={i} style={s.barWrap}>
                    <View
                      style={[
                        s.bar,
                        { height: Math.max(pct * 52, 4), backgroundColor: col },
                      ]}
                    />
                  </View>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            style={s.centeredExitBtn}
            onPress={() => {
              setTapLog([]);
              goToMenu();
            }}
          >
            <Text style={s.btnTxt}>Exit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // ─── ROUTER ──────────────────────────────────────────────────────────────────
  switch (currentTest) {
    case "solid":
      return renderSolid();
    case "gradient":
      return renderGradient();
    case "pixel":
      return renderPixel();
    case "burnin":
      return renderBurnin();
    case "grid":
      return renderGrid();
    case "touch":
      return renderTouch();
    case "multitouch":
      return renderMultitouch();
    case "response":
      return renderResponse();
    default:
      return renderMenu();
  }
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const CARD_GAP = 10;
const CARD_W = (width - 56 - CARD_GAP) / 2;

const s = StyleSheet.create({
  flex: { flex: 1 },

  // ── Menu ──
  menuBg: { flex: 1, backgroundColor: "#0d1117" },
  orb: { position: "absolute", borderRadius: 999 },
  orb1: {
    width: 260,
    height: 260,
    backgroundColor: "rgba(120,60,220,0.22)",
    top: -80,
    right: -80,
  },
  orb2: {
    width: 200,
    height: 200,
    backgroundColor: "rgba(60,120,220,0.18)",
    top: 100,
    left: -80,
  },
  orb3: {
    width: 120,
    height: 120,
    backgroundColor: "rgba(160,80,255,0.14)",
    top: 240,
    right: 30,
  },
  scrollContent: { paddingBottom: 40 },
  header: { paddingHorizontal: 28, paddingTop: 24, paddingBottom: 28 },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  brandDot: {
    width: 9,
    height: 9,
    borderRadius: 99,
    backgroundColor: "#a78bfa",
  },
  brandName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.3,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: 10,
  },
  heroSub: { fontSize: 13, color: "rgba(255,255,255,0.42)", lineHeight: 20 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2,
    color: "rgba(255,255,255,0.28)",
    paddingHorizontal: 28,
    marginBottom: 12,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 28,
    gap: CARD_GAP,
  },
  card: {
    width: CARD_W,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.09)",
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  cardIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardName: {
    fontSize: 13,
    fontWeight: "700",
    color: "rgba(255,255,255,0.9)",
    lineHeight: 17,
  },
  cardDesc: { fontSize: 11, color: "rgba(255,255,255,0.32)", lineHeight: 15 },
  infoBanner: {
    marginHorizontal: 28,
    marginTop: 20,
    backgroundColor: "rgba(167,139,250,0.07)",
    borderWidth: 0.5,
    borderColor: "rgba(167,139,250,0.22)",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: "rgba(255,255,255,0.38)",
    lineHeight: 18,
  },
  infoHL: { color: "rgba(167,139,250,0.85)", fontWeight: "600" },

  // ── Shared ──
  tapExit: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    fontSize: 16,
    opacity: 0.6,
  },
  centeredOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  colorSelector: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  colorBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#888",
  },
  colorBtnActive: { borderWidth: 4, borderColor: "#007AFF" },
  gradientLabel: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 10,
    borderRadius: 8,
  },
  pixelText: {
    fontSize: 16,
    color: "#e00",
    textAlign: "center",
    backgroundColor: "rgba(255,255,255,0.93)",
    padding: 18,
    borderRadius: 12,
  },
  burninText: {
    fontSize: 17,
    color: "#fff",
    textAlign: "center",
    padding: 40,
    marginTop: 100,
  },
  gridText: {
    fontSize: 17,
    color: "#333",
    textAlign: "center",
    backgroundColor: "rgba(255,255,255,0.93)",
    padding: 18,
    borderRadius: 12,
  },

  // ── Touch Draw HUD ──
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

  // ── Touch toolbar ──
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

  // ── Multitouch ──
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

  // ── Response ──
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
  respTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
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
});

export default App;
