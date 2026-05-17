import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  PanResponder,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from "react-native-google-mobile-ads";
import { SafeAreaView } from "react-native-safe-area-context";
import "../i18n/i18n";

const { width, height } = Dimensions.get("window");

// ─── AdMob Configuration ──────────────────────────────────────────────────────
// Replace the string below with your real Interstitial Ad Unit ID from AdMob.
// Your Ad Unit ID looks like: ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
// NOTE: This is NOT your Publisher ID — go to AdMob → Apps → Ad Units to find it.
const AD_UNIT_ID = __DEV__
  ? TestIds.INTERSTITIAL // Safe test ad during development
  : "ca-app-pub-6336309514571148/4920783633"; // ← Replace with your real Ad Unit ID

const interstitial = InterstitialAd.createForAdRequest(AD_UNIT_ID, {
  requestNonPersonalizedAdsOnly: true, // Recommended for GDPR compliance
});
// ─────────────────────────────────────────────────────────────────────────────

const App = () => {
  const { t } = useTranslation();
  const [currentTest, setCurrentTest] = useState("menu");
  const [solidColor, setSolidColor] = useState("#FFFFFF");
  type Point = { x: number; y: number };

  const [paths, setPaths] = useState<Point[][]>([]);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const currentPathRef = useRef<Point[]>([]);

  // ─── AdMob: Load interstitial on mount, reload after close ─────────────────
  const adLoaded = useRef(false);

  useEffect(() => {
    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        adLoaded.current = true;
      },
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        adLoaded.current = false;
        interstitial.load(); // Preload the next ad after the current one closes
      },
    );

    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.warn("AdMob Interstitial error:", error);
        adLoaded.current = false;
      },
    );

    interstitial.load(); // Load the first ad when the app mounts

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  /**
   * Call this instead of setCurrentTest("menu") everywhere in the app.
   * It shows the interstitial (if loaded) before returning to the menu.
   */
  const goToMenu = () => {
    if (adLoaded.current) {
      interstitial.show();
    }
    setCurrentTest("menu");
  };
  // ─────────────────────────────────────────────────────────────────────────────

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const next = [{ x: locationX, y: locationY }];
        currentPathRef.current = next;
        setCurrentPath(next);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath((prev) => {
          const next = [...prev, { x: locationX, y: locationY }];
          currentPathRef.current = next;
          return next;
        });
      },
      onPanResponderRelease: () => {
        if (currentPathRef.current.length > 0) {
          setPaths((prev) => [...prev, currentPathRef.current]);
          currentPathRef.current = [];
          setCurrentPath([]);
        }
      },
    }),
  ).current;

  // Test modes
  const tests = [
    { id: "solid", name: t("solidColors"), icon: "🎨" },
    { id: "gradient", name: t("gradientTest"), icon: "🌈" },
    { id: "pixel", name: t("deadPixelDetection"), icon: "🔍" },
    { id: "burnin", name: t("burninTest"), icon: "🔥" },
    { id: "grid", name: t("gridPattern"), icon: "⊞" },
    { id: "touch", name: t("touchDrawTest"), icon: "✏️" },
  ];

  // Solid colors for testing
  const solidColors = [
    { color: "#FFFFFF", name: "White" },
    { color: "#000000", name: "Black" },
    { color: "#FF0000", name: "Red" },
    { color: "#00FF00", name: "Green" },
    { color: "#0000FF", name: "Blue" },
    { color: "#FFFF00", name: "Yellow" },
    { color: "#FF00FF", name: "Magenta" },
    { color: "#00FFFF", name: "Cyan" },
  ];

  const renderMenu = () => (
    <SafeAreaView style={styles.menuContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>{t("appTitle")}</Text>
        <Text style={styles.subtitle}>{t("appSubtitle")}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.testsContainer}>
          {tests.map((test) => (
            <TouchableOpacity
              key={test.id}
              style={styles.testButton}
              onPress={() => setCurrentTest(test.id)}
            >
              <Text style={styles.testIcon}>{test.icon}</Text>
              <Text style={styles.testName}>{test.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>{t("howToUse")}</Text>
          <Text style={styles.instructionText}>{t("instructions")}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderSolidColorTest = () => (
    <View style={styles.fullScreenContainer}>
      <StatusBar hidden />
      <View style={[styles.fullScreen, { backgroundColor: solidColor }]}>
        <TouchableOpacity
          style={styles.fullScreenTouchable}
          onPress={goToMenu} // ← was setCurrentTest("menu")
        >
          <View style={styles.colorSelector}>
            {solidColors.map((item) => (
              <TouchableOpacity
                key={item.color}
                style={[
                  styles.colorButton,
                  { backgroundColor: item.color },
                  solidColor === item.color && styles.selectedColor,
                ]}
                onPress={() => setSolidColor(item.color)}
              />
            ))}
          </View>
          <Text
            style={[
              styles.tapToExit,
              {
                color: solidColor === "#000000" ? "#FFFFFF" : "#000000",
              },
            ]}
          >
            {t("tapToExit")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderGradientTest = () => (
    <View style={styles.fullScreenContainer}>
      <StatusBar hidden />
      <TouchableOpacity
        style={styles.fullScreenTouchable}
        onPress={goToMenu} // ← was setCurrentTest("menu")
      >
        <LinearGradient
          colors={["#000000", "#FFFFFF"]}
          style={styles.fullScreen}
        >
          <Text style={styles.gradientText}>{t("gradientInstruction")}</Text>
          <Text style={styles.tapToExit}>{t("tapToExit")}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  const renderPixelTest = () => {
    const gridSize = 10;
    const rows = Math.ceil(height / gridSize);
    const cols = Math.ceil(width / gridSize);

    return (
      <View style={styles.fullScreenContainer}>
        <StatusBar hidden />
        <TouchableOpacity
          style={styles.fullScreenTouchable}
          onPress={goToMenu} // ← was setCurrentTest("menu")
        >
          <View style={styles.fullScreen}>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <View key={rowIndex} style={styles.pixelRow}>
                {Array.from({ length: cols }).map((_, colIndex) => (
                  <View
                    key={colIndex}
                    style={[
                      styles.pixelCell,
                      {
                        width: gridSize,
                        height: gridSize,
                        backgroundColor:
                          (rowIndex + colIndex) % 2 === 0
                            ? "#FFFFFF"
                            : "#000000",
                      },
                    ]}
                  />
                ))}
              </View>
            ))}
            <View style={styles.pixelOverlay}>
              <Text style={styles.pixelText}>
                {t("deadPixelTitle")}
                {"\n"}
                {t("deadPixelInstruction")}
              </Text>
              <Text style={styles.tapToExit}>{t("tapToExit")}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderBurninTest = () => (
    <View style={styles.fullScreenContainer}>
      <StatusBar hidden />
      <TouchableOpacity
        style={styles.fullScreenTouchable}
        onPress={goToMenu} // ← was setCurrentTest("menu")
      >
        <View style={[styles.fullScreen, { backgroundColor: "#808080" }]}>
          <Text style={styles.burninText}>
            {t("burninTitle")}
            {"\n\n"}
            {t("burninInstruction")}
          </Text>
          <Text style={[styles.tapToExit, { color: "#FFFFFF" }]}>
            {t("tapToExit")}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderGridPattern = () => {
    const gridSpacing = 50;
    const horizontalLines = Math.ceil(height / gridSpacing);
    const verticalLines = Math.ceil(width / gridSpacing);

    return (
      <View style={styles.fullScreenContainer}>
        <StatusBar hidden />
        <TouchableOpacity
          style={styles.fullScreenTouchable}
          onPress={goToMenu} // ← was setCurrentTest("menu")
        >
          <View style={[styles.fullScreen, { backgroundColor: "#FFFFFF" }]}>
            {Array.from({ length: horizontalLines }).map((_, index) => (
              <View
                key={`h-${index}`}
                style={[
                  styles.gridLine,
                  {
                    top: index * gridSpacing,
                    width: "100%",
                    height: 1,
                  },
                ]}
              />
            ))}
            {Array.from({ length: verticalLines }).map((_, index) => (
              <View
                key={`v-${index}`}
                style={[
                  styles.gridLine,
                  {
                    left: index * gridSpacing,
                    height: "100%",
                    width: 1,
                  },
                ]}
              />
            ))}
            <View style={styles.gridOverlay}>
              <Text style={styles.gridText}>
                {t("gridTitle")}
                {"\n"}
                {t("gridInstruction")}
              </Text>
              <Text style={styles.tapToExit}>{t("tapToExit")}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderTouchTest = () => {
    const clearCanvas = () => {
      setPaths([]);
      setCurrentPath([]);
    };

    const exitTest = () => {
      clearCanvas();
      goToMenu(); // ← was setCurrentTest("menu")
    };

    return (
      <View style={styles.fullScreenContainer}>
        <StatusBar hidden />
        <View style={[styles.fullScreen, { backgroundColor: "#FFFFFF" }]}>
          {paths.map((path, pathIndex) => (
            <View key={`path-${pathIndex}`} style={StyleSheet.absoluteFill}>
              {path.map((point, pointIndex) => {
                if (pointIndex === 0) return null;
                const prevPoint = path[pointIndex - 1];
                const distance = Math.sqrt(
                  Math.pow(point.x - prevPoint.x, 2) +
                    Math.pow(point.y - prevPoint.y, 2),
                );
                const angle = Math.atan2(
                  point.y - prevPoint.y,
                  point.x - prevPoint.x,
                );
                return (
                  <View
                    key={`line-${pointIndex}`}
                    style={[
                      styles.drawLine,
                      {
                        left: prevPoint.x,
                        top: prevPoint.y,
                        width: distance,
                        transform: [{ rotate: `${angle}rad` }],
                      },
                    ]}
                  />
                );
              })}
            </View>
          ))}

          {currentPath.length > 0 && (
            <View style={StyleSheet.absoluteFill}>
              {currentPath.map((point, pointIndex) => {
                if (pointIndex === 0) return null;
                const prevPoint = currentPath[pointIndex - 1];
                const distance = Math.sqrt(
                  Math.pow(point.x - prevPoint.x, 2) +
                    Math.pow(point.y - prevPoint.y, 2),
                );
                const angle = Math.atan2(
                  point.y - prevPoint.y,
                  point.x - prevPoint.x,
                );
                return (
                  <View
                    key={`current-line-${pointIndex}`}
                    style={[
                      styles.drawLine,
                      {
                        left: prevPoint.x,
                        top: prevPoint.y,
                        width: distance,
                        transform: [{ rotate: `${angle}rad` }],
                      },
                    ]}
                  />
                );
              })}
            </View>
          )}

          <View {...panResponder.panHandlers} style={StyleSheet.absoluteFill} />

          <View style={styles.touchControls}>
            <View style={styles.touchInstructions}>
              <Text style={styles.touchTitle}>{t("touchTitle")}</Text>
              <Text style={styles.touchSubtitle}>{t("touchSubtitle")}</Text>
              <View style={styles.touchTips}>
                <Text style={styles.tipText}>{t("touchTip1")}</Text>
                <Text style={styles.tipText}>{t("touchTip2")}</Text>
                <Text style={styles.tipText}>{t("touchTip3")}</Text>
                <Text style={styles.tipText}>{t("touchTip4")}</Text>
              </View>
            </View>
            <View style={styles.touchButtons}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearCanvas}
              >
                <Text style={styles.buttonText}>{t("clearCanvas")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.exitButton} onPress={exitTest}>
                <Text style={styles.buttonText}>{t("exit")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  switch (currentTest) {
    case "solid":
      return renderSolidColorTest();
    case "gradient":
      return renderGradientTest();
    case "pixel":
      return renderPixelTest();
    case "burnin":
      return renderBurninTest();
    case "grid":
      return renderGridPattern();
    case "touch":
      return renderTouchTest();
    default:
      return renderMenu();
  }
};

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 20,
    paddingTop: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  testsContainer: {
    padding: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  testButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  testIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  testName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  instructions: {
    backgroundColor: "#E8F4F8",
    padding: 20,
    margin: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  fullScreenContainer: {
    flex: 1,
  },
  fullScreen: {
    flex: 1,
  },
  fullScreenTouchable: {
    flex: 1,
  },
  colorSelector: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#888",
  },
  selectedColor: {
    borderWidth: 4,
    borderColor: "#007AFF",
  },
  tapToExit: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    fontSize: 16,
    opacity: 0.7,
  },
  gradientText: {
    position: "absolute",
    top: 50,
    alignSelf: "center",
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 10,
    borderRadius: 8,
  },
  pixelRow: {
    flexDirection: "row",
  },
  pixelCell: {
    flex: 1,
  },
  pixelOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  pixelText: {
    fontSize: 18,
    color: "#FF0000",
    textAlign: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 20,
    borderRadius: 12,
  },
  burninText: {
    fontSize: 18,
    color: "#FFFFFF",
    textAlign: "center",
    padding: 40,
    marginTop: 100,
  },
  gridLine: {
    position: "absolute",
    backgroundColor: "#000000",
  },
  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  gridText: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 20,
    borderRadius: 12,
  },
  drawLine: {
    position: "absolute",
    height: 4,
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  touchControls: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
  },
  touchInstructions: {
    backgroundColor: "rgba(255,255,255,0.95)",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  touchTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  touchSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  touchTips: {
    marginTop: 5,
  },
  tipText: {
    fontSize: 12,
    color: "#555",
    marginBottom: 3,
  },
  touchButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clearButton: {
    flex: 1,
    backgroundColor: "#FF9500",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exitButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default App;
