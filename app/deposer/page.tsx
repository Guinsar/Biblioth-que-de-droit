"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Deposer() {
  const router = useRouter();
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [accordCharte, setAccordCharte] = useState(false);

  const soumettre = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErreur(null);

    if (!accordCharte) {
      setErreur("La charte de dépôt doit être acceptée avant l'envoi.");
      return;
    }

    setEnvoi(true);

    const formulaire = new FormData(e.currentTarget);
    const fichier = formulaire.get("fichier") as File;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setErreur("Connecte-toi avec ton adresse universitaire avant de déposer un travail.");
      setEnvoi(false);
      return;
    }

    const cheminFichier = `${user.id}/${Date.now()}-${fichier.name}`;
    const { error: erreurUpload } = await supabase.storage
      .from("travaux-pdf")
      .upload(cheminFichier, fichier);

    if (erreurUpload) {
      setErreur("Le fichier n'a pas pu être envoyé. Réessaie.");
      setEnvoi(false);
      return;
    }

    const { data: url } = supabase.storage
      .from("travaux-pdf")
      .getPublicUrl(cheminFichier);

    const { error: erreurInsertion } = await supabase.from("travaux").insert({
      titre: formulaire.get("titre"),
      auteur: formulaire.get("auteur"),
      annee: Number(formulaire.get("annee")),
      type_travail: formulaire.get("type_travail"),
      encadrant: formulaire.get("encadrant") || null,
      resume: formulaire.get("resume"),
      mots_cles: String(formulaire.get("mots_cles"))
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      fichier_url: url.publicUrl,
      depose_par: user.id,
      consentement_diffusion: true,
      consentement_le: new Date().toISOString(),
    });

    setEnvoi(false);

    if (erreurInsertion) {
      setErreur("Le dépôt n'a pas pu être enregistré. Réessaie.");
      return;
    }

    router.push("/?depot=envoye");
  };

  return (
    <div className="max-w-prose">
      <h1 className="font-serif text-3xl text-ink">Déposer un travail</h1>
      <p className="mt-3 text-charcoal/80">
        Le travail sera visible par les autres étudiants après validation par
        un modérateur.
      </p>

      <form onSubmit={soumettre} className="mt-8 flex flex-col gap-5">
        <Champ label="Titre">
          <input name="titre" required className="champ" />
        </Champ>
        <Champ label="Auteur">
          <input name="auteur" required className="champ" />
        </Champ>
        <div className="flex gap-4">
          <Champ label="Année" className="w-32">
            <input name="annee" type="number" required className="champ" />
          </Champ>
          <Champ label="Type de travail" className="flex-1">
            <select name="type_travail" required className="champ">
              <option value="memoire">Mémoire</option>
              <option value="expose">Exposé</option>
              <option value="dissertation">Dissertation</option>
              <option value="these">Thèse</option>
            </select>
          </Champ>
        </div>
        <Champ label="Encadrant (facultatif)">
          <input name="encadrant" className="champ" />
        </Champ>
        <Champ label="Résumé">
          <textarea name="resume" required rows={5} className="champ" />
        </Champ>
        <Champ label="Mots-clés (séparés par des virgules)">
          <input name="mots_cles" placeholder="droit administratif, contentieux, UFHB" className="champ" />
        </Champ>
        <Champ label="Fichier PDF">
          <input name="fichier" type="file" accept="application/pdf" required className="champ" />
        </Champ>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={accordCharte}
            onChange={(e) => setAccordCharte(e.target.checked)}
            className="mt-1"
          />
          <span>
            J'ai lu la{" "}
            <Link href="/charte" target="_blank" className="text-wine underline">
              charte de dépôt
            </Link>{" "}
            et j'autorise la diffusion de ce travail aux autres étudiants de
            la filière.
          </span>
        </label>

        {erreur && <p className="text-sm text-wine">{erreur}</p>}

        <button
          type="submit"
          disabled={envoi}
          className="mt-2 self-start bg-ink px-6 py-2 text-sm text-parchment hover:bg-wine disabled:opacity-50"
        >
          {envoi ? "Envoi en cours" : "Déposer le travail"}
        </button>
      </form>
    </div>
  );
}

function Champ({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1 text-sm ${className}`}>
      <span className="text-charcoal/70">{label}</span>
      {children}
    </label>
  );
}
