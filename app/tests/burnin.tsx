import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TestCloseButton } from "@/components/test-shell";
import { markTested } from "@/lib/test-history";

export default function BurninTest() {
  const { t } = useTranslation();
  const router = useRouter();

  const exit = () => {
    markTested("burnin");
    router.back();
  };

  return (
    <View style={s.flex}>
      <StatusBar hidden />
      <TouchableOpacity
        style={[s.flex, { backgroundColor: "#808080" }]}
        onPress={exit}
        activeOpacity={1}
      >
        <TestCloseButton onPress={exit} />
        <Text style={s.burninText}>
          {t("burninTitle")}
          {"\n\n"}
          {t("burninInstruction")}
        </Text>
        <Text style={[s.tapExit, { color: "#fff" }]}>{t("tapToExit")}</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  burninText: {
    fontSize: 17,
    color: "#fff",
    textAlign: "center",
    padding: 40,
    marginTop: 100,
  },
  tapExit: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    fontSize: 16,
    opacity: 0.6,
  },
});
