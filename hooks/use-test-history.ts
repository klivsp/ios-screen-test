import { useEffect, useState } from "react";
import { subscribe, TestHistory } from "@/lib/test-history";

export function useTestHistory() {
  const [history, setHistory] = useState<TestHistory>({});

  useEffect(() => subscribe(setHistory), []);

  return history;
}
