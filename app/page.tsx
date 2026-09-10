"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, Travail } from "@/lib/supabase";

const LABELS_TYPE: Record<Travail["type_travail"], string> = {
  memoire: "Mémoire",
  expose: "Exposé",
  dissertation: "Dissertation",
  these: "Thèse",
};

export default function Accueil() {
  const [recherche, setRecherche] = useState("");
  const [annee, setAnnee] = useState("");
  const [travaux, setTravaux] = useState<Travail[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const charger = async () => {
      setChargement(true);
      let requete = supabase
        .from("travaux")
        .select("*")
        .eq("statut", "publie")
        .order("cree_le", { ascending: false });

      if (annee) requete = requete.eq("annee", Number(annee));
      if (recherche) requete = requete.textSearch("recherche", recherche);

      const { data } = await requete;
      setTravaux(data ?? []);
      setChargement(false);
    };
    charger();
  }, [recherche, annee]);

  return (
    <div>
      <div className="mb-10 max-w-prose">
        <h1 className="font-serif text-3xl text-ink">
          Les travaux de la filière Droit, réunis en un seul lieu
        </h1>
        <p className="mt-3 text-charcoal/80">
          Mémoires, exposés et dissertations déposés par les étudiants,
          consultables librement une fois validés.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          placeholder="Rechercher par titre, mot-clé ou résumé"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="flex-1 border border-rule bg-white/60 px-4 py-2 text-sm focus:border-wine focus:outline-none"
        />
        <input
          type="number"
          placeholder="Année"
          value={annee}
          onChange={(e) => setAnnee(e.target.value)}
          className="w-full border border-rule bg-white/60 px-4 py-2 text-sm focus:border-wine focus:outline-none sm:w-32"
        />
      </div>

      {chargement && <p className="text-sm text-charcoal/60">Chargement en cours.</p>}

      {!chargement && travaux.length === 0 && (
        <p className="text-sm text-charcoal/60">
          Aucun travail ne correspond à cette recherche pour le moment.
        </p>
      )}

      <ul className="divide-y divide-rule">
        {travaux.map((travail) => (
          <li key={travail.id} className="py-5">
            <Link href={`/document/${travail.id}`} className="group block">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-serif text-lg text-ink group-hover:text-wine">
                  {travail.titre}
                </h2>
                <span className="shrink-0 text-sm text-charcoal/60">
                  {travail.annee}
                </span>
              </div>
              <p className="mt-1 text-sm text-charcoal/70">
                {LABELS_TYPE[travail.type_travail]} — {travail.auteur}
                {travail.encadrant ? ` — sous la direction de ${travail.encadrant}` : ""}
              </p>
              <p className="mt-2 line-clamp-2 text-sm text-charcoal/80">
                {travail.resume}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
