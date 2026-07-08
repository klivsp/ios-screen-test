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

export default function PixelTest() {
  const { t } = useTranslation();
  const router = useRouter();
  const sz = 10;
  const rows = Math.ceil(height / sz);
  const cols = Math.ceil(width / sz);

  const exit = () => {
    markTested("pixel");
    router.back();
  };

  return (
    <View style={s.flex}>
      <StatusBar hidden />
      <TouchableOpacity style={s.flex} onPress={exit} activeOpacity={1}>
        <View style={s.flex}>
          <TestCloseButton onPress={exit} />
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
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  centeredOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  pixelText: {
    fontSize: 16,
    color: "#e00",
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
