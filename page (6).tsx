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

const LABELS_STATUT: Record<Travail["statut"], string> = {
  en_attente: "En attente de validation",
  publie: "Publié",
  refuse: "Refusé",
  retire: "Retiré",
};

export default function Profil() {
  const [connecte, setConnecte] = useState<boolean | null>(null);
  const [travaux, setTravaux] = useState<Travail[]>([]);

  useEffect(() => {
    const charger = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setConnecte(false);
        return;
      }
      setConnecte(true);

      const { data } = await supabase
        .from("travaux")
        .select("*")
        .eq("depose_par", user.id)
        .order("cree_le", { ascending: false });

      setTravaux(data ?? []);
    };
    charger();
  }, []);

  if (connecte === null) {
    return <p className="text-sm text-charcoal/60">Vérification en cours.</p>;
  }

  if (connecte === false) {
    return (
      <p className="text-sm text-charcoal/60">
        Connecte-toi pour voir tes dépôts.
      </p>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-ink">Mes dépôts</h1>

      {travaux.length === 0 && (
        <p className="mt-8 max-w-prose text-sm text-charcoal/80">
          Tu n'as encore rien déposé.{" "}
          <Link href="/deposer" className="text-wine underline">
            Déposer un premier travail
          </Link>
          .
        </p>
      )}

      <ul className="mt-8 divide-y divide-rule">
        {travaux.map((travail) => (
          <li key={travail.id} className="py-5">
            <Link
              href={`/document/${travail.id}`}
              className="group flex items-baseline justify-between gap-4"
            >
              <div>
                <h2 className="font-serif text-lg text-ink group-hover:text-wine">
                  {travail.titre}
                </h2>
                <p className="mt-1 text-sm text-charcoal/70">
                  {LABELS_TYPE[travail.type_travail]} — {travail.annee}
                </p>
              </div>
              <span className="shrink-0 text-sm text-charcoal/60">
                {LABELS_STATUT[travail.statut]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
