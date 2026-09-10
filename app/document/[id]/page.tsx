"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase, Travail } from "@/lib/supabase";

const LABELS_TYPE: Record<Travail["type_travail"], string> = {
  memoire: "Mémoire",
  expose: "Exposé",
  dissertation: "Dissertation",
  these: "Thèse",
};

export default function FicheDocument() {
  const { id } = useParams<{ id: string }>();
  const [travail, setTravail] = useState<Travail | null>(null);
  const [introuvable, setIntrouvable] = useState(false);
  const [estAuteur, setEstAuteur] = useState(false);
  const [retraitEnCours, setRetraitEnCours] = useState(false);

  useEffect(() => {
    const charger = async () => {
      const { data } = await supabase
        .from("travaux")
        .select("*")
        .eq("id", id)
        .single();

      if (!data) {
        setIntrouvable(true);
        return;
      }

      setTravail(data);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      setEstAuteur(user?.id === data.depose_par);

      if (data.statut === "publie") {
        await supabase
          .from("travaux")
          .update({ consultations: data.consultations + 1 })
          .eq("id", id);
      }
    };
    charger();
  }, [id]);

  const retirer = async () => {
    if (!travail) return;
    setRetraitEnCours(true);
    await supabase.from("travaux").update({ statut: "retire" }).eq("id", travail.id);
    setTravail({ ...travail, statut: "retire" });
    setRetraitEnCours(false);
  };

  const enregistrerTelechargement = async () => {
    if (!travail) return;
    await supabase
      .from("travaux")
      .update({ telechargements: travail.telechargements + 1 })
      .eq("id", travail.id);
  };

  if (introuvable) {
    return <p className="text-sm text-charcoal/60">Ce travail n'existe pas ou n'est plus disponible.</p>;
  }

  if (!travail) {
    return <p className="text-sm text-charcoal/60">Chargement en cours.</p>;
  }

  return (
    <div>
      {estAuteur && travail.statut !== "retire" && (
        <div className="mb-6 border border-rule bg-white/40 px-4 py-3 text-sm">
          <p className="text-charcoal/80">
            C'est ton travail. Tu peux le retirer à tout moment, sans avoir à
            te justifier.
          </p>
          <button
            onClick={retirer}
            disabled={retraitEnCours}
            className="mt-2 border border-wine px-4 py-1 text-wine hover:bg-wine hover:text-parchment disabled:opacity-50"
          >
            {retraitEnCours ? "Retrait en cours" : "Retirer ce travail"}
          </button>
        </div>
      )}

      {travail.statut === "retire" ? (
        <p className="max-w-prose text-charcoal/80">
          Ce travail a été retiré par son auteur. Il n'est plus consultable.
        </p>
      ) : (
        <div className="max-w-prose">
        <p className="text-sm text-charcoal/60">
          {LABELS_TYPE[travail.type_travail]} — {travail.annee}
        </p>
        <h1 className="mt-1 font-serif text-3xl text-ink">{travail.titre}</h1>
        <p className="mt-2 text-charcoal/80">
          {travail.auteur}
          {travail.encadrant ? ` — sous la direction de ${travail.encadrant}` : ""}
        </p>
        <p className="mt-4 text-charcoal/80">{travail.resume}</p>

        {travail.mots_cles.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2 text-xs text-charcoal/60">
            {travail.mots_cles.map((mot) => (
              <li key={mot} className="border border-rule px-2 py-1">
                {mot}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex gap-4 text-xs text-charcoal/50">
          <span>{travail.consultations} consultations</span>
          <span>{travail.telechargements} téléchargements</span>
        </div>

        <a
          href={travail.fichier_url}
          download
          onClick={enregistrerTelechargement}
          className="mt-6 inline-block bg-ink px-6 py-2 text-sm text-parchment hover:bg-wine"
        >
          Télécharger le PDF
        </a>
        </div>
      )}

      {travail.statut !== "retire" && (
        <div className="mt-10 border border-rule">
          <iframe
            src={travail.fichier_url}
            title={travail.titre}
            className="h-[70vh] w-full"
          />
        </div>
      )}
    </div>
  );
}
