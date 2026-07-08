import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ChevronRight, Settings as SettingsIcon } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTestHistory } from "@/hooks/use-test-history";
import { useAppTheme } from "@/lib/theme";

const { width } = Dimensions.get("window");
const CARD_GAP = 10;
const CARD_W = (width - 56 - CARD_GAP) / 2;

type TestDef = {
  id: string;
  route: string;
  name: string;
  icon: string;
  desc: string;
  accent: [string, string];
};

const SECTIONS: { label: string; tests: TestDef[] }[] = [
  {
    label: "DISPLAY TESTS",
    tests: [
      {
        id: "solid",
        route: "/tests/solid",
        name: "Solid Colors",
        icon: "🎨",
        desc: "Pure fill test",
        accent: ["#a78bfa", "#7c3aed"],
      },
      {
        id: "gradient",
        route: "/tests/gradient",
        name: "Gradient Test",
        icon: "🌈",
        desc: "Tone transitions",
        accent: ["#60a5fa", "#2563eb"],
      },
      {
        id: "pixel",
        route: "/tests/pixel",
        name: "Dead Pixel Detection",
        icon: "🔍",
        desc: "Pixel detection",
        accent: ["#34d399", "#059669"],
      },
      {
        id: "burnin",
        route: "/tests/burnin",
        name: "Burn-in Test",
        icon: "🔥",
        desc: "OLED burn check",
        accent: ["#fb923c", "#ea580c"],
      },
      {
        id: "grid",
        route: "/tests/grid",
        name: "Grid Pattern",
        icon: "⊞",
        desc: "Alignment lines",
        accent: ["#f87171", "#dc2626"],
      },
    ],
  },
  {
    label: "TOUCH & INPUT",
    tests: [
      {
        id: "touch",
        route: "/tests/touch",
        name: "Touch & Draw Test",
        icon: "✏️",
        desc: "Draw & coverage",
        accent: ["#c4b5fd", "#8b5cf6"],
      },
      {
        id: "multitouch",
        route: "/tests/multitouch",
        name: "Multitouch Test",
        icon: "👆",
        desc: "Finger count check",
        accent: ["#38bdf8", "#0ea5e9"],
      },
      {
        id: "response",
        route: "/tests/response",
        name: "Response Test",
        icon: "⚡",
        desc: "Tap latency check",
        accent: ["#facc15", "#d97706"],
      },
    ],
  },
  {
    label: "HARDWARE",
    tests: [
      {
        id: "flashlight",
        route: "/tests/flashlight",
        name: "Flashlight Test",
        icon: "🔦",
        desc: "Torch check",
        accent: ["#fde047", "#ca8a04"],
      },
      {
        id: "sensors",
        route: "/tests/sensors",
        name: "Sensors Test",
        icon: "📡",
        desc: "Motion & proximity",
        accent: ["#5eead4", "#0d9488"],
      },
      {
        id: "speaker",
        route: "/tests/speaker",
        name: "Speaker Test",
        icon: "🔊",
        desc: "L/R channel check",
        accent: ["#f9a8d4", "#db2777"],
      },
      {
        id: "microphone",
        route: "/tests/microphone",
        name: "Microphone Test",
        icon: "🎤",
        desc: "Record & playback",
        accent: ["#93c5fd", "#2563eb"],
      },
    ],
  },
];

const MORE_LINKS = [
  {
    route: "/screen-original",
    icon: "🛡️",
    title: "Is My Screen Original?",
    desc: "How to verify a genuine Apple display",
  },
  {
    route: "/device-info",
    icon: "📱",
    title: "Device Info",
    desc: "Model, battery, resolution & storage",
  },
];

export default function MenuScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const history = useTestHistory();
  const { colors, resolved } = useAppTheme();
  const testedCount = Object.keys(history).length;
  const totalTests = SECTIONS.reduce((n, s) => n + s.tests.length, 0);

  return (
    <View style={[s.menuBg, { backgroundColor: colors.bg }]}>
      <StatusBar
        barStyle={resolved === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.bg}
      />
      {resolved === "dark" && (
        <>
          <View style={[s.orb, s.orb1]} />
          <View style={[s.orb, s.orb2]} />
          <View style={[s.orb, s.orb3]} />
        </>
      )}
      <SafeAreaView style={s.flex}>
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={s.header}>
            <View style={s.brandRow}>
              <View style={s.brand}>
                <View style={[s.brandDot, { backgroundColor: colors.accent }]} />
                <Text style={[s.brandName, { color: colors.text }]}>ScreenDoctor</Text>
              </View>
              <TouchableOpacity
                style={[s.settingsBtn, { backgroundColor: colors.panel }]}
                onPress={() => router.push("/settings")}
                hitSlop={10}
              >
                <SettingsIcon size={18} color={colors.textDim} />
              </TouchableOpacity>
            </View>
            <Text style={[s.heroTitle, { color: colors.text }]}>{t("appTitle")}</Text>
            <Text style={[s.heroSub, { color: colors.textDim }]}>{t("appSubtitle")}</Text>
            {testedCount > 0 && (
              <Text style={[s.progressText, { color: colors.accent }]}>
                ✓ Tested {testedCount} of {totalTests}
              </Text>
            )}
          </View>

          {SECTIONS.map((section) => (
            <View key={section.label}>
              <Text style={[s.sectionLabel, { color: colors.textFaint }]}>{section.label}</Text>
              <View style={s.cardGrid}>
                {section.tests.map((test) => (
                  <TouchableOpacity
                    key={test.id}
                    style={[s.card, { backgroundColor: colors.card, borderColor: colors.panelBorder }]}
                    onPress={() => router.push(test.route as any)}
                    activeOpacity={0.75}
                  >
                    <View style={s.cardTop}>
                      <LinearGradient
                        colors={[test.accent[0] + "33", test.accent[1] + "11"]}
                        style={s.cardIconWrap}
                      >
                        <Text style={{ fontSize: 20 }}>{test.icon}</Text>
                      </LinearGradient>
                      {history[test.id] && <Text style={s.checkBadge}>✓</Text>}
                    </View>
                    <Text style={[s.cardName, { color: colors.text }]}>{test.name}</Text>
                    <Text style={[s.cardDesc, { color: colors.textFaint }]}>{test.desc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <Text style={[s.sectionLabel, { color: colors.textFaint }]}>MORE</Text>
          <View style={s.moreList}>
            {MORE_LINKS.map((link) => (
              <TouchableOpacity
                key={link.route}
                style={[s.moreRow, { backgroundColor: colors.card, borderColor: colors.panelBorder }]}
                onPress={() => router.push(link.route as any)}
                activeOpacity={0.75}
              >
                <Text style={{ fontSize: 20 }}>{link.icon}</Text>
                <View style={s.moreText}>
                  <Text style={[s.moreTitle, { color: colors.text }]}>{link.title}</Text>
                  <Text style={[s.moreDesc, { color: colors.textFaint }]}>{link.desc}</Text>
                </View>
                <ChevronRight size={18} color={colors.textFaint} />
              </TouchableOpacity>
            ))}
          </View>

          <View style={s.infoBanner}>
            <Text style={{ fontSize: 14 }}>ℹ️</Text>
            <Text style={[s.infoText, { color: colors.textDim }]}>
              <Text style={s.infoHL}>{t("howToUse")} </Text>
              {t("instructions")}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  menuBg: { flex: 1 },
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
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandDot: { width: 9, height: 9, borderRadius: 99 },
  brandName: { fontSize: 16, fontWeight: "800", letterSpacing: -0.3 },
  settingsBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 40,
    marginBottom: 10,
  },
  heroSub: { fontSize: 13, lineHeight: 20 },
  progressText: { fontSize: 12, fontWeight: "600", marginTop: 12 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2,
    paddingHorizontal: 28,
    marginBottom: 12,
    marginTop: 8,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 28,
    gap: CARD_GAP,
    marginBottom: 4,
  },
  card: {
    width: CARD_W,
    borderWidth: 0.5,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  cardTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  cardIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  checkBadge: { color: "#34d399", fontSize: 13, fontWeight: "800" },
  cardName: { fontSize: 13, fontWeight: "700", lineHeight: 17 },
  cardDesc: { fontSize: 11, lineHeight: 15 },
  moreList: { paddingHorizontal: 28, gap: 8, marginBottom: 4 },
  moreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 0.5,
    borderRadius: 14,
    padding: 14,
  },
  moreText: { flex: 1 },
  moreTitle: { fontSize: 13, fontWeight: "700" },
  moreDesc: { fontSize: 11, marginTop: 2 },
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
    lineHeight: 18,
  },
  infoHL: { color: "rgba(167,139,250,0.85)", fontWeight: "600" },
});
