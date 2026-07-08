import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TestHeader } from "@/components/test-shell";
import { markTested } from "@/lib/test-history";
import { useAppTheme } from "@/lib/theme";

export default function MicrophoneTest() {
  const router = useRouter();
  const { colors } = useAppTheme();

  if (Platform.OS === "web") {
    return (
      <View style={[s.flex, { backgroundColor: colors.bg }]}>
        <TestHeader title="Microphone Test" onBack={() => router.back()} />
        <View style={s.centerMsg}>
          <Text style={[s.msgText, { color: colors.textDim }]}>
            The microphone test is only available on an iOS device.
          </Text>
        </View>
      </View>
    );
  }

  return <MicrophoneTestNative onExit={() => router.back()} colors={colors} />;
}

function MicrophoneTestNative({
  onExit,
  colors,
}: {
  onExit: () => void;
  colors: ReturnType<typeof useAppTheme>["colors"];
}) {
  const recorder = useAudioRecorder(
    { ...RecordingPresets.HIGH_QUALITY, isMeteringEnabled: true },
  );
  const recorderState = useAudioRecorderState(recorder, 100);
  const player = useAudioPlayer(null);
  const playerStatus = useAudioPlayerStatus(player);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [recordedUri, setRecordedUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const perm = await AudioModule.requestRecordingPermissionsAsync();
      setHasPermission(perm.granted);
      await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    })();
  }, []);

  const startRecording = async () => {
    setRecordedUri(null);
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const stopRecording = async () => {
    await recorder.stop();
    setRecordedUri(recorder.uri);
  };

  const playback = () => {
    if (!recordedUri) return;
    player.replace({ uri: recordedUri });
    player.seekTo(0);
    player.play();
  };

  const exit = () => {
    if (recorderState.isRecording) recorder.stop();
    player.pause();
    markTested("microphone");
    onExit();
  };

  const meteringDb = recorderState.metering ?? -160;
  const levelPct = Math.max(0, Math.min(1, (meteringDb + 60) / 60));

  return (
    <View style={[s.flex, { backgroundColor: colors.bg }]}>
      <TestHeader title="Microphone Test" subtitle="Record, then play it back" onBack={exit} />

      {hasPermission === false ? (
        <View style={s.centerMsg}>
          <Text style={[s.msgText, { color: colors.textDim }]}>
            Microphone access is needed for this test.
          </Text>
        </View>
      ) : (
        <View style={s.body}>
          <View style={s.meterWrap}>
            <View style={s.meterBg}>
              <View style={[s.meterFill, { width: `${levelPct * 100}%` as any }]} />
            </View>
            <Text style={[s.meterLabel, { color: colors.textDim }]}>
              {recorderState.isRecording ? "Listening…" : "Input level"}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              s.recordBtn,
              { backgroundColor: colors.panel },
              recorderState.isRecording && s.recordBtnActive,
            ]}
            onPress={recorderState.isRecording ? stopRecording : startRecording}
            activeOpacity={0.85}
          >
            <Text style={s.recordIcon}>{recorderState.isRecording ? "⏹" : "⏺"}</Text>
            <Text style={[s.recordLabel, { color: colors.text }]}>
              {recorderState.isRecording ? "Stop" : "Record"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              s.playBtn,
              { backgroundColor: colors.panel },
              !recordedUri && s.playBtnDisabled,
            ]}
            onPress={playback}
            disabled={!recordedUri}
          >
            <Text style={[s.playTxt, { color: colors.text }]}>
              {playerStatus.playing ? "Playing…" : "▶ Play back recording"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  centerMsg: { flex: 1, alignItems: "center", justifyContent: "center", padding: 40 },
  msgText: { fontSize: 14, textAlign: "center" },
  body: { flex: 1, padding: 24, gap: 30, justifyContent: "center", alignItems: "center" },
  meterWrap: { width: "100%", gap: 8 },
  meterBg: {
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(128,128,128,0.15)",
    overflow: "hidden",
  },
  meterFill: { height: "100%", backgroundColor: "#4ade80", borderRadius: 7 },
  meterLabel: { fontSize: 12, textAlign: "center" },
  recordBtn: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
  },
  recordBtnActive: { backgroundColor: "rgba(248,113,113,0.16)", borderColor: "#f87171" },
  recordIcon: { fontSize: 36, color: "#f87171" },
  recordLabel: { fontWeight: "800", fontSize: 14 },
  playBtn: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  playBtnDisabled: { opacity: 0.4 },
  playTxt: { fontWeight: "600", fontSize: 14 },
});
