import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TestCloseButton } from "@/components/test-shell";
import { markTested } from "@/lib/test-history";

const { width, height } = Dimensions.get("window");

export default function GridTest() {
  const { t } = useTranslation();
  const router = useRouter();
  const sp = 50;

  const exit = () => {
    markTested("grid");
    router.back();
  };

  return (
    <View style={s.flex}>
      <StatusBar hidden />
      <TouchableOpacity style={s.flex} onPress={exit} activeOpacity={1}>
        <View style={[s.flex, { backgroundColor: "#FFF" }]}>
          <TestCloseButton onPress={exit} light />
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
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  centeredOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  gridText: {
    fontSize: 17,
    color: "#333",
    textAlign: "center",
    backgroundColor: "rgba(255,255,255,0.93)",
    padding: 18,
    borderRadius: 12,
  },
  tapExit: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    fontSize: 16,
    opacity: 0.6,
  },
});
