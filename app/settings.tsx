import Constants from "expo-constants";
import { useRouter } from "expo-router";
import * as StoreReview from "expo-store-review";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, Share, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TestHeader } from "@/components/test-shell";
import { useTestHistory } from "@/hooks/use-test-history";
import { clearHistory } from "@/lib/test-history";
import { ThemePreference, useAppTheme } from "@/lib/theme";

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const LANGUAGES: { code: string; label: string }[] = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" },
  { code: "zh", label: "中文" },
  { code: "ru", label: "Русский" },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const { preference, setPreference, colors } = useAppTheme();
  const history = useTestHistory();
  const testedCount = Object.keys(history).length;

  const cardStyle = [s.card, { backgroundColor: colors.panel, borderColor: colors.panelBorder }];
  const cardTitleStyle = [s.cardTitle, { color: colors.text }];

  const shareApp = () => {
    Share.share({ message: "Check out ScreenDoctor — a screen & hardware diagnostic app for iPhone." });
  };

  const rateApp = async () => {
    if (await StoreReview.isAvailableAsync()) {
      StoreReview.requestReview();
    }
  };

  const resetHistory = () => {
    Alert.alert("Reset test history?", "This clears the ✓ marks on the menu.", [
      { text: "Cancel", style: "cancel" },
      { text: "Reset", style: "destructive", onPress: () => clearHistory() },
    ]);
  };

  return (
    <View style={[s.flex, { backgroundColor: colors.bg }]}>
      <TestHeader title="Settings" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={cardStyle}>
          <Text style={cardTitleStyle}>Appearance</Text>
          <View style={s.segmented}>
            {THEME_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  s.segment,
                  { borderColor: colors.panelBorder },
                  preference === opt.value && { backgroundColor: colors.accent + "22", borderColor: colors.accent },
                ]}
                onPress={() => setPreference(opt.value)}
              >
                <Text
                  style={[
                    s.segmentTxt,
                    { color: preference === opt.value ? colors.accent : colors.textDim },
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={cardStyle}>
          <Text style={cardTitleStyle}>Language</Text>
          <View style={s.langGrid}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  s.langChip,
                  { borderColor: colors.panelBorder },
                  i18n.language === lang.code && {
                    backgroundColor: colors.accent + "22",
                    borderColor: colors.accent,
                  },
                ]}
                onPress={() => i18n.changeLanguage(lang.code)}
              >
                <Text
                  style={[
                    s.langTxt,
                    { color: i18n.language === lang.code ? colors.accent : colors.textDim },
                  ]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={cardStyle}>
          <Text style={cardTitleStyle}>Diagnostics</Text>
          <Text style={[s.rowText, { color: colors.textDim }]}>
            {testedCount} test{testedCount === 1 ? "" : "s"} completed
          </Text>
          <TouchableOpacity onPress={resetHistory}>
            <Text style={s.destructiveTxt}>Reset test history</Text>
          </TouchableOpacity>
        </View>

        <View style={cardStyle}>
          <Text style={cardTitleStyle}>ScreenDoctor</Text>
          <TouchableOpacity style={s.actionRow} onPress={rateApp}>
            <Text style={[s.rowText, { color: colors.text }]}>⭐ Rate this app</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.actionRow} onPress={shareApp}>
            <Text style={[s.rowText, { color: colors.text }]}>↗ Share ScreenDoctor</Text>
          </TouchableOpacity>
          <Text style={[s.versionTxt, { color: colors.textFaint }]}>
            Version {Constants.expoConfig?.version ?? "1.0.0"}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 20, gap: 14, paddingBottom: 40 },
  card: { borderRadius: 16, padding: 16, gap: 10, borderWidth: 0.5 },
  cardTitle: { fontSize: 14, fontWeight: "800" },
  segmented: { flexDirection: "row", gap: 8 },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  segmentTxt: { fontSize: 12, fontWeight: "700" },
  langGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  langChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  langTxt: { fontSize: 12, fontWeight: "600" },
  rowText: { fontSize: 13 },
  destructiveTxt: { color: "#f87171", fontSize: 13, fontWeight: "600", marginTop: 2 },
  actionRow: { paddingVertical: 4 },
  versionTxt: { fontSize: 11, marginTop: 6 },
});
