import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TestCloseButton } from "@/components/test-shell";
import { markTested } from "@/lib/test-history";

const SOLID_COLORS = [
  "#FFFFFF",
  "#000000",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
];

export default function SolidTest() {
  const { t } = useTranslation();
  const router = useRouter();
  const [solidColor, setSolidColor] = useState("#FFFFFF");

  const exit = () => {
    markTested("solid");
    router.back();
  };

  return (
    <View style={s.flex}>
      <StatusBar hidden />
      <TouchableOpacity
        style={[s.flex, { backgroundColor: solidColor }]}
        onPress={exit}
        activeOpacity={1}
      >
        <TestCloseButton onPress={exit} light={solidColor !== "#000000"} />
        <View style={s.colorSelector}>
          {SOLID_COLORS.map((c) => (
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
}

const s = StyleSheet.create({
  flex: { flex: 1 },
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
  tapExit: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    fontSize: 16,
    opacity: 0.6,
  },
});
