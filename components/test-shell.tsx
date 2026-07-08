import { ChevronLeft, X } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "@/lib/theme";

/** Small corner close button for the fullscreen color tests (solid, gradient, pixel, burn-in, grid) — sits alongside tap-to-exit without covering the color field. */
export const TestCloseButton = ({
  onPress,
  light,
}: {
  onPress: () => void;
  light?: boolean;
}) => (
  <SafeAreaView style={s.closeWrap} pointerEvents="box-none">
    <TouchableOpacity
      style={[s.closeBtn, light && s.closeBtnLight]}
      onPress={onPress}
      hitSlop={12}
    >
      <X size={16} color={light ? "#111" : "#fff"} strokeWidth={2.5} />
    </TouchableOpacity>
  </SafeAreaView>
);

/**
 * Header (back chevron + title) for panel-style hardware/utility test screens.
 * Pass `forceDark` for screens whose backdrop isn't the app theme (e.g. a live
 * camera feed) so the chrome stays legible regardless of the appearance setting.
 */
export const TestHeader = ({
  title,
  subtitle,
  onBack,
  forceDark,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
  forceDark?: boolean;
}) => {
  const { colors } = useAppTheme();
  const text = forceDark ? "#ffffff" : colors.text;
  const textDim = forceDark ? "rgba(255,255,255,0.5)" : colors.textDim;
  const panel = forceDark ? "rgba(255,255,255,0.12)" : colors.panel;
  return (
    <SafeAreaView edges={["top"]} style={s.header}>
      <TouchableOpacity
        style={[s.backBtn, { backgroundColor: panel }]}
        onPress={onBack}
        hitSlop={12}
      >
        <ChevronLeft size={22} color={text} strokeWidth={2.5} />
      </TouchableOpacity>
      <View style={s.headerText}>
        <Text style={[s.headerTitle, { color: text }]}>{title}</Text>
        {subtitle ? <Text style={[s.headerSub, { color: textDim }]}>{subtitle}</Text> : null}
      </View>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  closeWrap: { position: "absolute", top: 0, right: 0, left: 0 },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnLight: { backgroundColor: "rgba(255,255,255,0.6)" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: "800" },
  headerSub: { fontSize: 12, marginTop: 2 },
});
