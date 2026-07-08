import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TestHeader } from "@/components/test-shell";
import { markTested } from "@/lib/test-history";
import { useAppTheme } from "@/lib/theme";

const TONES = {
  left: require("../../assets/audio/left.wav"),
  right: require("../../assets/audio/right.wav"),
  both: require("../../assets/audio/both.wav"),
} as const;

type Channel = keyof typeof TONES;

export default function SpeakerTest() {
  const router = useRouter();
  const { colors } = useAppTheme();

  if (Platform.OS === "web") {
    return (
      <View style={[s.flex, { backgroundColor: colors.bg }]}>
        <TestHeader title="Speaker Test" onBack={() => router.back()} />
        <View style={s.body}>
          <Text style={[s.hint, { color: colors.textDim }]}>
            The speaker test is only available on an iOS device.
          </Text>
        </View>
      </View>
    );
  }

  return <SpeakerTestNative onExit={() => router.back()} colors={colors} />;
}

function SpeakerTestNative({
  onExit,
  colors,
}: {
  onExit: () => void;
  colors: ReturnType<typeof useAppTheme>["colors"];
}) {
  const player = useAudioPlayer(TONES.both);
  const status = useAudioPlayerStatus(player);
  const [active, setActive] = useState<Channel | null>(null);

  const play = (channel: Channel) => {
    player.replace(TONES[channel]);
    player.seekTo(0);
    player.play();
    setActive(channel);
  };

  const exit = () => {
    player.pause();
    markTested("speaker");
    onExit();
  };

  const isPlaying = status.playing;

  return (
    <View style={[s.flex, { backgroundColor: colors.bg }]}>
      <TestHeader title="Speaker Test" subtitle="Play a tone through each channel" onBack={exit} />
      <View style={s.body}>
        <Text style={[s.hint, { color: colors.textDim }]}>
          Put on headphones or listen closely to your device speakers, then play each
          channel to confirm both sides work.
        </Text>

        <View style={s.channels}>
          {(["left", "both", "right"] as Channel[]).map((channel) => (
            <TouchableOpacity
              key={channel}
              style={[
                s.channelBtn,
                { backgroundColor: colors.panel },
                active === channel && isPlaying && s.channelBtnActive,
              ]}
              onPress={() => play(channel)}
              activeOpacity={0.8}
            >
              <Text style={s.channelIcon}>{channel === "both" ? "🔊" : "🔉"}</Text>
              <Text style={[s.channelLabel, { color: colors.text }]}>
                {channel === "left" ? "Left" : channel === "right" ? "Right" : "Both"}
              </Text>
              {active === channel && isPlaying && <Text style={s.playingTag}>Playing…</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  body: { flex: 1, padding: 24, gap: 28, justifyContent: "center" },
  hint: { fontSize: 13, lineHeight: 19, textAlign: "center" },
  channels: { flexDirection: "row", gap: 12, justifyContent: "center" },
  channelBtn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  channelBtnActive: { borderColor: "#38bdf8", backgroundColor: "rgba(56,189,248,0.12)" },
  channelIcon: { fontSize: 30 },
  channelLabel: { fontWeight: "700", fontSize: 14 },
  playingTag: { color: "#38bdf8", fontSize: 10, fontWeight: "700" },
});
