import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import type { Med } from "../types";
import type { Movement } from "./types";
import { syntheticHistory } from "./synthesize";

const STOCK = "stock";
const MOVEMENTS = "movements";

function fromStockDoc(snap: QueryDocumentSnapshot<DocumentData>): Med {
  const data = snap.data();
  return {
    id: snap.id,
    name: data.name,
    cls: data.cls,
    stock: data.stock,
    min: data.min,
    exp: data.exp,
    supplier: data.supplier,
    loc: data.loc,
    price: data.price,
    trend: data.trend,
  };
}

export async function readAllStock(): Promise<Med[]> {
  const snap = await getDocs(collection(db(), STOCK));
  return snap.docs.map(fromStockDoc);
}

export async function getOrSeedHistory(med: Med): Promise<Movement[]> {
  const ref = doc(db(), MOVEMENTS, med.id);
  const existing = await getDoc(ref);
  if (existing.exists()) {
    const data = existing.data();
    if (Array.isArray(data?.history) && data.history.length > 0) {
      return data.history as Movement[];
    }
  }
  const history = syntheticHistory(med);
  await setDoc(ref, { history, seededAt: new Date().toISOString() });
  return history;
}
