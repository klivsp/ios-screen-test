import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "screendoctor.tap-game-highscore";

export async function getHighScore(): Promise<number> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? parseInt(raw, 10) : 0;
}

export async function submitScore(score: number): Promise<{ highScore: number; isNewHigh: boolean }> {
  const current = await getHighScore();
  if (score > current) {
    await AsyncStorage.setItem(STORAGE_KEY, String(score));
    return { highScore: score, isNewHigh: true };
  }
  return { highScore: current, isNewHigh: false };
}
