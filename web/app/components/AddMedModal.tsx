"use client";

import { useState } from "react";
import { Check, Sparkles } from "./Icon";
import { addMed } from "../lib/stock";

const CLASSES = [
  "Antalgique",
  "Antibiotique",
  "Anti-inflammatoire",
  "Bronchodilatateur",
  "Antidiabétique",
  "Antidiarrhéique",
  "Antispasmodique",
  "Thyroïdien",
];

type FormState = {
  name: string;
  id: string;
  cls: string;
  stock: string;
  min: string;
  exp: string;
  supplier: string;
};

const INITIAL: FormState = {
  name: "Doliprane 500mg",
  id: "",
  cls: "Antalgique",
  stock: "200",
  min: "100",
  exp: "2027-05-30",
  supplier: "Sanofi",
};

export function AddMedModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const stockNum = Number(form.stock);
    const minNum = Number(form.min);
    if (!form.name.trim()) {
      setError("Le nom commercial est requis.");
      return;
    }
    if (Number.isNaN(stockNum) || Number.isNaN(minNum)) {
      setError("Quantité et seuil doivent être des nombres.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await addMed({
        id: form.id,
        name: form.name,
        cls: form.cls,
        stock: stockNum,
        min: minNum,
        exp: form.exp,
        supplier: form.supplier,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'enregistrement.");
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-bg" onClick={submitting ? undefined : onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>Ajouter un médicament</h2>
        <div className="sub">
          L&apos;IA pré-remplit la classe et le seuil minimum à partir du nom.
        </div>
        <div className="form-grid">
          <div className="field full">
            <label>Nom commercial</label>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label>Code (DCI / EAN)</label>
            <input
              placeholder="MED-XXXXX"
              value={form.id}
              onChange={(e) => set("id", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Classe</label>
            <select value={form.cls} onChange={(e) => set("cls", e.target.value)}>
              {CLASSES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Quantité initiale</label>
            <input
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) => set("stock", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Seuil minimum</label>
            <input
              type="number"
              min="0"
              value={form.min}
              onChange={(e) => set("min", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Date de péremption</label>
            <input
              type="date"
              value={form.exp}
              onChange={(e) => set("exp", e.target.value)}
            />
          </div>
          <div className="field">
            <label>Fournisseur</label>
            <input
              value={form.supplier}
              onChange={(e) => set("supplier", e.target.value)}
            />
          </div>
        </div>
        {error && <div className="form-error">{error}</div>}
        <div className="modal-foot">
          <div className="ai-hint">
            <Sparkles size={12} />
            Nerolina suggère : seuil <b>120</b> (saisonnalité hiver)
          </div>
          <div className="actions">
            <button
              className="btn btn-ghost"
              type="button"
              onClick={onClose}
              disabled={submitting}
            >
              Annuler
            </button>
            <button className="btn btn-primary" type="submit" disabled={submitting}>
              <Check size={13} />
              {submitting ? "Enregistrement…" : "Ajouter au stock"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
