import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { TestHeader } from "@/components/test-shell";
import { useAppTheme } from "@/lib/theme";

const Section = ({
  icon,
  title,
  lines,
}: {
  icon: string;
  title: string;
  lines: string[];
}) => {
  const { colors } = useAppTheme();
  return (
    <View style={[s.section, { backgroundColor: colors.panel, borderColor: colors.panelBorder }]}>
      <Text style={[s.sectionTitle, { color: colors.text }]}>
        {icon} {title}
      </Text>
      {lines.map((line, i) => (
        <Text key={i} style={[s.line, { color: colors.textDim }]}>
          {line}
        </Text>
      ))}
    </View>
  );
};

export default function TipsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <View style={[s.flex, { backgroundColor: colors.bg }]}>
      <TestHeader title="Tips & Tricks" subtitle="Get more life out of your screen" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={s.scroll}>
        <Section
          icon="🔥"
          title="Reduce burn-in risk"
          lines={[
            "• Lower your auto-lock timeout so static content doesn't linger.",
            "• Avoid leaving the same bright UI (navigation bars, keyboards) on screen for hours.",
            "• Dark mode reduces how many pixels stay lit at high brightness.",
          ]}
        />

        <Section
          icon="👁️"
          title="Reduce eye strain"
          lines={[
            "• Enable Night Shift for warmer tones in the evening.",
            "• True Tone adapts white balance to your surroundings — worth leaving on.",
            "• If our Flicker Test showed banding at low brightness, try keeping brightness above ~30% when possible.",
          ]}
        />

        <Section
          icon="🧽"
          title="Clean your screen safely"
          lines={[
            "• Power off and unplug cables before cleaning.",
            "• Use a slightly damp, lint-free microfiber cloth — never spray liquid directly on the screen.",
            "• Avoid bleach, window cleaner, or abrasive materials — they can strip the oleophobic coating.",
          ]}
        />

        <Section
          icon="☀️"
          title="Outdoor & sunlight use"
          lines={[
            "• Direct sunlight can trigger a temperature warning and dim the display to protect the battery.",
            "• Use our Sunlight Test to judge real-world outdoor readability before you head out.",
            "• Avoid leaving your phone on a car dashboard or in direct sun for long periods.",
          ]}
        />

        <Section
          icon="🛡️"
          title="Protect against damage"
          lines={[
            "• A tempered-glass screen protector absorbs most everyday scratches.",
            "• Keep your phone separate from keys and coins in pockets or bags.",
            "• Cold weather can make touch response feel sluggish — this is usually temporary.",
          ]}
        />

        <Section
          icon="🔎"
          title="When to consider a repair"
          lines={[
            "• Stuck or dead pixels that persist across our Dead Pixel and Solid Color tests.",
            "• Touch dead zones that repeat in the same spot on the Touch & Draw Test.",
            "• Visible ghosting on the Burn-in Test that doesn't fade after a few minutes.",
          ]}
        />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 20, gap: 14, paddingBottom: 40 },
  section: { borderRadius: 16, padding: 16, gap: 6, borderWidth: 0.5 },
  sectionTitle: { fontSize: 15, fontWeight: "800", marginBottom: 4 },
  line: { fontSize: 13, lineHeight: 19 },
});
