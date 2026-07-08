import { useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TestHeader } from "@/components/test-shell";
import { useAppTheme } from "@/lib/theme";

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const { colors } = useAppTheme();
  return (
    <View style={[s.section, { backgroundColor: colors.panel, borderColor: colors.panelBorder }]}>
      <Text style={[s.sectionTitle, { color: colors.text }]}>{title}</Text>
      {children}
    </View>
  );
};

const Line = ({ children }: { children: React.ReactNode }) => {
  const { colors } = useAppTheme();
  return <Text style={[s.line, { color: colors.textDim }]}>{children}</Text>;
};

const Subhead = ({ children }: { children: React.ReactNode }) => {
  const { colors } = useAppTheme();
  return <Text style={[s.subhead, { color: colors.text }]}>{children}</Text>;
};

export default function ScreenOriginalGuide() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <View style={[s.flex, { backgroundColor: colors.bg }]}>
      <TestHeader title={t("isScreenOriginal")} onBack={() => router.back()} />
      <ScrollView contentContainerStyle={s.scroll}>
        <Text style={[s.intro, { color: colors.textDim }]}>{t("infoSubtitle")}</Text>

        <Section title={t("method1Title")}>
          <Line>
            {t("method1Step1", { settings: t("settings") })}
          </Line>
          <Line>
            {t("method1Step2", { general: t("general"), about: t("about") })}
          </Line>
          <Line>{t("method1Step3", { importantDisplay: t("importantDisplay") })}</Line>
          <Text style={s.warning}>{t("method1Warning")}</Text>
          <TouchableOpacity style={s.settingsBtn} onPress={() => Linking.openSettings()}>
            <Text style={s.settingsBtnTxt}>{t("openSettings")}</Text>
          </TouchableOpacity>
        </Section>

        <Section title={t("method2Title")}>
          <Subhead>{t("signsOfNonOriginal")}</Subhead>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <Line key={n}>{t(`sign${n}`)}</Line>
          ))}
        </Section>

        <Section title={t("method3Title")}>
          <Line>
            {t("method3Step1", {
              settings: t("settings"),
              displayBrightness: t("displayBrightness"),
            })}
          </Line>
          <Line>{t("method3Step2", { trueTone: t("trueTone") })}</Line>
          <Line>{t("method3Step3")}</Line>
          <Text style={s.tip}>{t("trueToneTip")}</Text>
        </Section>

        <Section title={t("method4Title")}>
          <Subhead>{t("mostReliableMethod")}</Subhead>
          {[1, 2, 3, 4].map((n) => (
            <Line key={n}>{t(`method4Item${n}`)}</Line>
          ))}
        </Section>

        <Section title={t("whyCantDetectTitle")}>
          <Line>{t("whyCantDetect")}</Line>
          {[1, 2, 3, 4].map((n) => (
            <Line key={n}>{t(`whyCantItem${n}`)}</Line>
          ))}
          <Text style={s.tip}>{t("privacyNote")}</Text>
        </Section>

        <Section title={t("whatAppCanDoTitle")}>
          <Line>{t("whatAppCanDo", { qualityIssues: t("qualityIssues") })}</Line>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Line key={n}>{t(`canDo${n}`)}</Line>
          ))}
        </Section>

        <View style={s.disclaimer}>
          <Text style={s.disclaimerTitle}>{t("disclaimerTitle")}</Text>
          <Text style={[s.disclaimerText, { color: colors.textDim }]}>
            {t("disclaimerText")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 48, gap: 18 },
  intro: { fontSize: 13, lineHeight: 19, marginBottom: 4 },
  section: { borderRadius: 16, padding: 16, gap: 6, borderWidth: 0.5 },
  sectionTitle: { fontSize: 15, fontWeight: "800", marginBottom: 4 },
  subhead: { fontSize: 12, fontWeight: "700", marginTop: 2 },
  line: { fontSize: 13, lineHeight: 19 },
  warning: { color: "#facc15", fontSize: 12, lineHeight: 18, marginTop: 6 },
  tip: { color: "#5eead4", fontSize: 12, lineHeight: 18, marginTop: 6 },
  settingsBtn: {
    marginTop: 10,
    backgroundColor: "#007aff",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  settingsBtnTxt: { color: "#fff", fontWeight: "700", fontSize: 13 },
  disclaimer: {
    backgroundColor: "rgba(250,204,21,0.06)",
    borderWidth: 0.5,
    borderColor: "rgba(250,204,21,0.22)",
    borderRadius: 14,
    padding: 14,
    gap: 4,
  },
  disclaimerTitle: { color: "#facc15", fontWeight: "800", fontSize: 13 },
  disclaimerText: { fontSize: 12, lineHeight: 18 },
});
