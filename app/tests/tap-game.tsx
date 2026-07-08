import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TestHeader } from "@/components/test-shell";
import { getHighScore, submitScore } from "@/lib/game-score";
import { markTested } from "@/lib/test-history";
import { useAppTheme } from "@/lib/theme";

const { width, height } = Dimensions.get("window");
const GAME_DURATION_S = 30;
const DOT_SIZE = 56;
const DOT_LIFESPAN_MS = 1100;
const SPAWN_MIN_MS = 550;
const SPAWN_MAX_MS = 950;
const DOT_COLORS = ["#ff3b30", "#ff9500", "#34c759", "#007aff", "#af52de", "#ff2d55", "#5ac8fa"];

const GRID_COLS = 8;
const GRID_ROWS = 12;

type Dot = { id: number; x: number; y: number; color: string; spawnedAt: number };
type GameState = "idle" | "playing" | "ended";

export default function TapGame() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();

  const [state, setState] = useState<GameState>("idle");
  const [dots, setDots] = useState<Dot[]>([]);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_S);
  const [highScore, setHighScore] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const coveredRef = useRef<Set<number>>(new Set());
  const [coveredCount, setCoveredCount] = useState(0);

  const nextId = useRef(0);
  const spawnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const expireTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const playTop = 120 + insets.top * 0.3;
  const playBottom = height - insets.bottom - 40;
  const playLeft = 16;
  const playRight = width - 16 - DOT_SIZE;

  useEffect(() => {
    getHighScore().then(setHighScore);
  }, []);

  const clearAllTimers = () => {
    if (spawnTimer.current) clearTimeout(spawnTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    expireTimers.current.forEach((t) => clearTimeout(t));
    expireTimers.current.clear();
  };

  useEffect(() => clearAllTimers, []);

  const markCovered = (x: number, y: number) => {
    const col = Math.floor((x / width) * GRID_COLS);
    const row = Math.floor((y / height) * GRID_ROWS);
    const idx = row * GRID_COLS + col;
    if (!coveredRef.current.has(idx)) {
      coveredRef.current.add(idx);
      setCoveredCount(coveredRef.current.size);
    }
  };

  const spawnDot = () => {
    const id = nextId.current++;
    const x = playLeft + Math.random() * Math.max(1, playRight - playLeft);
    const y = playTop + Math.random() * Math.max(1, playBottom - playTop);
    const color = DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)];
    const dot: Dot = { id, x, y, color, spawnedAt: Date.now() };
    setDots((prev) => [...prev, dot]);

    const expireTimer = setTimeout(() => {
      setDots((prev) => prev.filter((d) => d.id !== id));
      setMisses((m) => m + 1);
      expireTimers.current.delete(id);
    }, DOT_LIFESPAN_MS);
    expireTimers.current.set(id, expireTimer);

    spawnTimer.current = setTimeout(
      spawnDot,
      SPAWN_MIN_MS + Math.random() * (SPAWN_MAX_MS - SPAWN_MIN_MS),
    );
  };

  const startGame = () => {
    clearAllTimers();
    coveredRef.current = new Set();
    setCoveredCount(0);
    setDots([]);
    setScore(0);
    setHits(0);
    setMisses(0);
    setIsNewHigh(false);
    setTimeLeft(GAME_DURATION_S);
    setState("playing");

    spawnDot();
    countdownTimer.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    clearAllTimers();
    setDots([]);
    setState("ended");
    markTested("tap-game");
    setScore((finalScore) => {
      submitScore(finalScore).then(({ highScore: hs, isNewHigh: isNew }) => {
        setHighScore(hs);
        setIsNewHigh(isNew);
      });
      return finalScore;
    });
  };

  const tapDot = (dot: Dot) => {
    const t = expireTimers.current.get(dot.id);
    if (t) clearTimeout(t);
    expireTimers.current.delete(dot.id);
    setDots((prev) => prev.filter((d) => d.id !== dot.id));

    const elapsed = Date.now() - dot.spawnedAt;
    const bonus = Math.round(((DOT_LIFESPAN_MS - elapsed) / DOT_LIFESPAN_MS) * 50);
    setScore((s) => s + 50 + Math.max(0, bonus));
    setHits((h) => h + 1);
    markCovered(dot.x, dot.y);
  };

  const exit = () => {
    clearAllTimers();
    router.back();
  };

  const coveragePct = Math.round((coveredCount / (GRID_COLS * GRID_ROWS)) * 100);

  return (
    <View style={[s.flex, { backgroundColor: colors.bg }]}>
      <TestHeader
        title="Tap the Dot"
        subtitle={state === "playing" ? `Score ${score} · ${timeLeft}s left` : "Reaction & coverage game"}
        onBack={exit}
      />

      {state !== "playing" &&
        (state === "idle" ? (
          <View style={s.center}>
            <Text style={s.emoji}>🎮</Text>
            <Text style={[s.title, { color: colors.text }]}>Tap the Dot</Text>
            <Text style={[s.desc, { color: colors.textDim }]}>
              Dots pop up across the screen for {GAME_DURATION_S} seconds — tap them fast
              before they disappear. This also exercises touch response across the whole
              panel, corners included.
            </Text>
            {highScore > 0 && (
              <Text style={[s.highScore, { color: colors.accent }]}>Best score: {highScore}</Text>
            )}
            <TouchableOpacity style={[s.startBtn, { backgroundColor: colors.accent }]} onPress={startGame}>
              <Text style={s.startBtnTxt}>Start</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={s.center}>
            <Text style={[s.title, { color: colors.text }]}>
              {isNewHigh ? "🏆 New High Score!" : "Time's up"}
            </Text>
            <Text style={[s.finalScore, { color: colors.accent }]}>{score}</Text>
            <View style={s.statsRow}>
              <View style={[s.statBox, { backgroundColor: colors.panel }]}>
                <Text style={[s.statVal, { color: colors.text }]}>{hits}</Text>
                <Text style={[s.statKey, { color: colors.textDim }]}>Hits</Text>
              </View>
              <View style={[s.statBox, { backgroundColor: colors.panel }]}>
                <Text style={[s.statVal, { color: colors.text }]}>{misses}</Text>
                <Text style={[s.statKey, { color: colors.textDim }]}>Missed</Text>
              </View>
              <View style={[s.statBox, { backgroundColor: colors.panel }]}>
                <Text style={[s.statVal, { color: colors.text }]}>{coveragePct}%</Text>
                <Text style={[s.statKey, { color: colors.textDim }]}>Coverage</Text>
              </View>
            </View>
            <Text style={[s.highScore, { color: colors.textDim }]}>Best score: {highScore}</Text>
            <TouchableOpacity style={[s.startBtn, { backgroundColor: colors.accent }]} onPress={startGame}>
              <Text style={s.startBtnTxt}>Play Again</Text>
            </TouchableOpacity>
          </View>
        ))}

      {state === "playing" &&
        dots.map((dot) => (
          <TouchableOpacity
            key={dot.id}
            style={[
              s.dot,
              { left: dot.x, top: dot.y, backgroundColor: dot.color },
            ]}
            onPress={() => tapDot(dot)}
            activeOpacity={0.6}
          />
        ))}
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, gap: 10 },
  emoji: { fontSize: 44, marginBottom: 4 },
  title: { fontSize: 22, fontWeight: "800", textAlign: "center" },
  desc: { fontSize: 13, lineHeight: 19, textAlign: "center", marginBottom: 6 },
  highScore: { fontSize: 13, fontWeight: "700", marginTop: 4, marginBottom: 8 },
  finalScore: { fontSize: 48, fontWeight: "900" },
  statsRow: { flexDirection: "row", gap: 10, marginVertical: 14 },
  statBox: { borderRadius: 12, paddingVertical: 10, paddingHorizontal: 16, alignItems: "center" },
  statVal: { fontSize: 18, fontWeight: "800" },
  statKey: { fontSize: 10, marginTop: 2 },
  startBtn: { paddingHorizontal: 36, paddingVertical: 14, borderRadius: 14 },
  startBtnTxt: { color: "#fff", fontWeight: "800", fontSize: 15 },
  dot: {
    position: "absolute",
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
});
