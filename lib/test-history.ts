import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "screendoctor.test-history";

export type TestHistory = Record<string, string>;

let cache: TestHistory | null = null;
const listeners = new Set<(history: TestHistory) => void>();

async function load(): Promise<TestHistory> {
  if (cache) return cache;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    cache = raw ? (JSON.parse(raw) as TestHistory) : {};
  } catch {
    cache = {};
  }
  return cache;
}

function notify() {
  if (cache) listeners.forEach((fn) => fn(cache!));
}

export async function getHistory(): Promise<TestHistory> {
  return { ...(await load()) };
}

export async function markTested(id: string): Promise<void> {
  const history = await load();
  history[id] = new Date().toISOString();
  cache = { ...history };
  notify();
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // ignore persistence failures — in-memory cache still reflects the run
  }
}

export async function clearHistory(): Promise<void> {
  cache = {};
  notify();
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function subscribe(fn: (history: TestHistory) => void): () => void {
  listeners.add(fn);
  load().then((history) => fn(history));
  return () => listeners.delete(fn);
}
