import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TestCloseButton } from "@/components/test-shell";
import { markTested } from "@/lib/test-history";

export default function GradientTest() {
  const { t } = useTranslation();
  const router = useRouter();

  const exit = () => {
    markTested("gradient");
    router.back();
  };

  return (
    <View style={s.flex}>
      <StatusBar hidden />
      <TouchableOpacity style={s.flex} onPress={exit} activeOpacity={1}>
        <LinearGradient colors={["#000000", "#FFFFFF"]} style={s.flex}>
          <TestCloseButton onPress={exit} light />
          <Text style={s.gradientLabel}>{t("gradientInstruction")}</Text>
          <Text style={[s.tapExit, { color: "#888" }]}>{t("tapToExit")}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
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
  tapExit: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    fontSize: 16,
    opacity: 0.6,
  },
});
