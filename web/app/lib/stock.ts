import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";
import { MEDS } from "./data";
import type { Med } from "./types";

export type NewMed = Omit<Med, "id" | "loc" | "price" | "trend"> &
  Partial<Pick<Med, "id" | "loc" | "price" | "trend">>;

const COLLECTION = "stock";

function fromDoc(snap: QueryDocumentSnapshot<DocumentData>): Med {
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

async function seedIfEmpty(): Promise<void> {
  const col = collection(db(), COLLECTION);
  const existing = await getDocs(col);
  if (!existing.empty) return;

  const batch = writeBatch(db());
  for (const med of MEDS) {
    const { id, ...rest } = med;
    batch.set(doc(col, id), rest);
  }
  await batch.commit();
}

function generateMedId(): string {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `MED-${n}`;
}

export async function addMed(input: NewMed): Promise<Med> {
  const id = (input.id?.trim() || generateMedId()).toUpperCase();
  const med: Med = {
    id,
    name: input.name.trim(),
    cls: input.cls,
    stock: input.stock,
    min: input.min,
    exp: input.exp,
    supplier: input.supplier.trim(),
    loc: input.loc?.trim() || "—",
    price: input.price ?? 0,
    trend: input.trend ?? "flat",
  };
  const { id: _id, ...rest } = med;
  await setDoc(doc(db(), COLLECTION, id), rest);
  return med;
}

export function subscribeStock(
  onData: (rows: Med[]) => void,
  onError: (error: Error) => void,
): () => void {
  const col = collection(db(), COLLECTION);
  const q = query(col, orderBy("name"));

  void seedIfEmpty().catch(onError);

  return onSnapshot(
    q,
    (snap) => onData(snap.docs.map(fromDoc)),
    onError,
  );
}
