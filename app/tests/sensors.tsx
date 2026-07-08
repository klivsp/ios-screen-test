import { useRouter } from "expo-router";
import { Accelerometer, Gyroscope, Magnetometer } from "expo-sensors";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { TestHeader } from "@/components/test-shell";
import { markTested } from "@/lib/test-history";
import { useAppTheme } from "@/lib/theme";

type Vec3 = { x: number; y: number; z: number };
const ZERO: Vec3 = { x: 0, y: 0, z: 0 };
const UPDATE_MS = 120;

function useSensor(sensor: typeof Accelerometer) {
  const [value, setValue] = useState<Vec3>(ZERO);
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    let sub: { remove: () => void } | null = null;
    sensor.isAvailableAsync().then((ok) => {
      setAvailable(ok);
      if (!ok) return;
      sensor.setUpdateInterval(UPDATE_MS);
      sub = sensor.addListener(setValue);
    });
    return () => sub?.remove();
  }, [sensor]);

  return { value, available };
}

const AxisRow = ({
  label,
  value,
  textDim,
  text,
}: {
  label: string;
  value: Vec3;
  textDim: string;
  text: string;
}) => (
  <View style={s.axisRow}>
    <Text style={[s.axisLabel, { color: textDim }]}>{label}</Text>
    {(["x", "y", "z"] as const).map((axis) => (
      <View key={axis} style={s.axisCell}>
        <Text style={[s.axisKey, { color: textDim }]}>{axis.toUpperCase()}</Text>
        <Text style={[s.axisVal, { color: text }]}>{value[axis].toFixed(2)}</Text>
      </View>
    ))}
  </View>
);

export default function SensorsTest() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const accel = useSensor(Accelerometer);
  const gyro = useSensor(Gyroscope);
  const mag = useSensor(Magnetometer);

  const exit = () => {
    markTested("sensors");
    router.back();
  };

  const cardStyle = [s.card, { backgroundColor: colors.panel, borderColor: colors.panelBorder }];

  return (
    <View style={[s.flex, { backgroundColor: colors.bg }]}>
      <TestHeader title="Sensors Test" subtitle="Live accelerometer, gyroscope & compass" onBack={exit} />
      <ScrollView contentContainerStyle={s.scroll}>
        <View style={cardStyle}>
          <Text style={[s.cardTitle, { color: colors.text }]}>📈 Accelerometer</Text>
          <Text style={[s.cardSub, { color: colors.textDim }]}>Tilt or shake the device</Text>
          {accel.available ? (
            <AxisRow label="g-force" value={accel.value} textDim={colors.textDim} text={colors.text} />
          ) : (
            <Text style={s.unavailable}>Not available on this device</Text>
          )}
        </View>

        <View style={cardStyle}>
          <Text style={[s.cardTitle, { color: colors.text }]}>🌀 Gyroscope</Text>
          <Text style={[s.cardSub, { color: colors.textDim }]}>Rotate the device around each axis</Text>
          {gyro.available ? (
            <AxisRow label="rad/s" value={gyro.value} textDim={colors.textDim} text={colors.text} />
          ) : (
            <Text style={s.unavailable}>Not available on this device</Text>
          )}
        </View>

        <View style={cardStyle}>
          <Text style={[s.cardTitle, { color: colors.text }]}>🧭 Magnetometer</Text>
          <Text style={[s.cardSub, { color: colors.textDim }]}>
            Move near a magnet to see values change
          </Text>
          {mag.available ? (
            <AxisRow label="µT" value={mag.value} textDim={colors.textDim} text={colors.text} />
          ) : (
            <Text style={s.unavailable}>Not available on this device</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { padding: 20, gap: 14, paddingBottom: 40 },
  card: { borderRadius: 16, padding: 16, gap: 10, borderWidth: 0.5 },
  cardTitle: { fontSize: 15, fontWeight: "800" },
  cardSub: { fontSize: 11 },
  unavailable: { color: "#f87171", fontSize: 12, marginTop: 4 },
  axisRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  axisLabel: { fontSize: 10, width: 46 },
  axisCell: {
    flex: 1,
    backgroundColor: "rgba(128,128,128,0.1)",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  axisKey: { fontSize: 9, fontWeight: "700" },
  axisVal: { fontSize: 15, fontWeight: "800", marginTop: 2 },
});
