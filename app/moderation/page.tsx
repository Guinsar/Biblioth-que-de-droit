"use client";

import { useEffect, useState } from "react";
import { supabase, Travail } from "@/lib/supabase";

const LABELS_TYPE: Record<Travail["type_travail"], string> = {
  memoire: "Mémoire",
  expose: "Exposé",
  dissertation: "Dissertation",
  these: "Thèse",
};

export default function Moderation() {
  const [autorise, setAutorise] = useState<boolean | null>(null);
  const [enAttente, setEnAttente] = useState<Travail[]>([]);
  const [enCours, setEnCours] = useState<string | null>(null);

  useEffect(() => {
    const verifierEtCharger = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setAutorise(false);
        return;
      }

      const { data: moderateur } = await supabase
        .from("moderateurs")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!moderateur) {
        setAutorise(false);
        return;
      }

      setAutorise(true);
      await chargerEnAttente();
    };
    verifierEtCharger();
  }, []);

  const chargerEnAttente = async () => {
    const { data } = await supabase
      .from("travaux")
      .select("*")
      .eq("statut", "en_attente")
      .order("cree_le", { ascending: true });
    setEnAttente(data ?? []);
  };

  const traiter = async (id: string, statut: "publie" | "refuse") => {
    setEnCours(id);
    await supabase.from("travaux").update({ statut }).eq("id", id);
    await chargerEnAttente();
    setEnCours(null);
  };

  if (autorise === null) {
    return <p className="text-sm text-charcoal/60">Vérification en cours.</p>;
  }

  if (autorise === false) {
    return (
      <p className="text-sm text-charcoal/60">
        Cette page est réservée aux modérateurs. Connecte-toi avec un compte
        habilité pour y accéder.
      </p>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Dépôts en attente</h1>
      <p className="mt-3 max-w-prose text-charcoal/80">
        Chaque travail reste invisible aux autres étudiants tant qu'il n'a pas
        été validé ici.
      </p>

      {enAttente.length === 0 && (
        <p className="mt-8 text-sm text-charcoal/60">
          Aucun dépôt en attente pour le moment.
        </p>
      )}

      <ul className="mt-8 divide-y divide-rule">
        {enAttente.map((travail) => (
          <li key={travail.id} className="py-6">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-serif text-lg text-ink">{travail.titre}</h2>
              <span className="shrink-0 text-sm text-charcoal/60">
                {travail.annee}
              </span>
            </div>
            <p className="mt-1 text-sm text-charcoal/70">
              {LABELS_TYPE[travail.type_travail]} — {travail.auteur}
              {travail.encadrant ? ` — sous la direction de ${travail.encadrant}` : ""}
            </p>
            <p className="mt-2 text-sm text-charcoal/80">{travail.resume}</p>
            <a
              href={travail.fichier_url}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-sm text-wine underline"
            >
              Consulter le PDF avant de statuer
            </a>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => traiter(travail.id, "publie")}
                disabled={enCours === travail.id}
                className="bg-ink px-5 py-2 text-sm text-parchment hover:bg-wine disabled:opacity-50"
              >
                Valider
              </button>
              <button
                onClick={() => traiter(travail.id, "refuse")}
                disabled={enCours === travail.id}
                className="border border-rule px-5 py-2 text-sm text-charcoal hover:border-wine hover:text-wine disabled:opacity-50"
              >
                Refuser
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
