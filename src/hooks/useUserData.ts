import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Tier = "best" | "better" | "least";
export type SelectionMap = Record<string, { points: number; tier: Tier }>;

export function useUserData(uid: string | null) {
  const [selections, setSelectionsState] = useState<SelectionMap>({});
  const [loaded, setLoaded] = useState(false);

  // Load from Firestore on login
  useEffect(() => {
    if (!uid) { setSelectionsState({}); setLoaded(false); return; }
    getDoc(doc(db, "users", uid)).then((snap) => {
      if (snap.exists()) {
        setSelectionsState((snap.data().selections as SelectionMap) ?? {});
      }
      setLoaded(true);
    });
  }, [uid]);

  // Persist to Firestore on every change (after initial load)
  const setSelections = async (updated: SelectionMap) => {
    setSelectionsState(updated);
    if (!uid) return;
    await setDoc(doc(db, "users", uid), { selections: updated }, { merge: true });
  };

  return { selections, setSelections, loaded };
}
