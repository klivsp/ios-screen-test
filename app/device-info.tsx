import * as Battery from "expo-battery";
import * as Device from "expo-device";
import * as FileSystem from "expo-file-system/legacy";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, PixelRatio, ScrollView, StyleSheet, Text, View } from "react-native";
import { TestHeader } from "@/components/test-shell";
import { useTestHistory } from "@/hooks/use-test-history";
import { useAppTheme } from "@/lib/theme";

const { width, height } = Dimensions.get("window");
const scale = PixelRatio.get();

function formatBytes(bytes: number) {
  if (!bytes || bytes <= 0) return "—";
  const gb = bytes / 1024 ** 3;
  return `${gb.toFixed(1)} GB`;
}

const batteryStateLabel = (state: Battery.BatteryState) => {
  switch (state) {
    case Battery.BatteryState.CHARGING:
      return "Charging";
    case Battery.BatteryState.FULL:
      return "Full";
    case Battery.BatteryState.UNPLUGGED:
      return "Unplugged";
    default:
      return "Unknown";
  }
};

const Row = ({
  label,
  value,
  textDim,
  text,
  borderColor,
}: {
  label: string;
  value: string;
  textDim: string;
  text: string;
  borderColor: string;
}) => (
  <View style={[s.row, { borderTopColor: borderColor }]}>
    <Text style={[s.rowLabel, { color: textDim }]}>{label}</Text>
    <Text style={[s.rowValue, { color: text }]}>{value}</Text>
  </View>
);

export default function DeviceInfoScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const history = useTestHistory();
  const [battery, setBattery] = useState({ level: -1, state: Battery.BatteryState.UNKNOWN, lowPower: false });
  const [storage, setStorage] = useState({ free: 0, total: 0 });

  useEffect(() => {
    (async () => {
      const [level, state, lowPower] = await Promise.all([
        Battery.getBatteryLevelAsync(),
        Battery.getBatteryStateAsync(),
        Battery.isLowPowerModeEnabledAsync(),
      ]);
      setBattery({ level, state, lowPower });
    })();
    (async () => {
      const [free, total] = await Promise.all([
        FileSystem.getFreeDiskStorageAsync(),
        FileSystem.getTotalDiskCapacityAsync(),
      ]);
      setStorage({ free, total });
    })();
  }, []);

  const testedCount = Object.keys(history).length;

  const row = (label: string, value: string) => (
    <Row
      key={label}
      label={label}
      value={value}
      textDim={colors.textDim}
      text={colors.text}
      borderColor={colors.panelBorder}
    />
  );
  const cardStyle = [s.card, { backgroundColor: colors.panel, borderColor: colors.panelBorder }];
  const cardTitleStyle = [s.cardTitle, { color: colors.text }];

  return (
    <View style={[s.flex, { backgroundColor: colors.bg }]}>
      <TestHeader title="Device Info" subtitle="Model, battery, resolution & storage" onBack={() => router.back()} />
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={cardStyle}>
          <Text style={cardTitleStyle}>📱 Device</Text>
          {row("Model", Device.modelName ?? "Unknown")}
          {row("OS", `${Device.osName ?? "iOS"} ${Device.osVersion ?? ""}`)}
          {row("Device name", Device.deviceName ?? "—")}
        </View>

        <View style={cardStyle}>
          <Text style={cardTitleStyle}>🔋 Battery</Text>
          {row("Level", battery.level >= 0 ? `${Math.round(battery.level * 100)}%` : "—")}
          {row("State", batteryStateLabel(battery.state))}
          {row("Low Power Mode", battery.lowPower ? "On" : "Off")}
        </View>

        <View style={cardStyle}>
          <Text style={cardTitleStyle}>🖥️ Display</Text>
          {row("Points", `${Math.round(width)} × ${Math.round(height)}`)}
          {row("Pixels", `${Math.round(width * scale)} × ${Math.round(height * scale)}`)}
          {row("Scale factor", `${scale}×`)}
        </View>

        <View style={cardStyle}>
          <Text style={cardTitleStyle}>💾 Storage</Text>
          {row("Free", formatBytes(storage.free))}
          {row("Total", formatBytes(storage.total))}
        </View>

        <View style={cardStyle}>
          <Text style={cardTitleStyle}>✓ Diagnostics</Text>
          {row("Tests completed", String(testedCount))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 20, gap: 14, paddingBottom: 40 },
  card: { borderRadius: 16, padding: 16, gap: 4, borderWidth: 0.5 },
  cardTitle: { fontSize: 14, fontWeight: "800", marginBottom: 6 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: { fontSize: 12 },
  rowValue: { fontSize: 12, fontWeight: "600" },
});
