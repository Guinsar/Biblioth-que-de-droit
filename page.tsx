"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const envoyerLien = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);

    if (!email.endsWith("@univ-fhb.edu.ci") && !email.endsWith("@ufhb.edu.ci")) {
      setErreur("Utilise ton adresse email universitaire pour te connecter.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) {
      setErreur("La connexion a échoué. Réessaie dans un instant.");
      return;
    }
    setEnvoye(true);
  };

  return (
    <div className="max-w-prose">
      <h1 className="font-serif text-3xl text-ink">Connexion</h1>
      <p className="mt-3 text-charcoal/80">
        Un lien de connexion sera envoyé à ton adresse email universitaire.
      </p>

      {envoye ? (
        <p className="mt-6 text-sm text-charcoal/80">
          Vérifie ta boîte mail : un lien de connexion vient de t'être envoyé.
        </p>
      ) : (
        <form onSubmit={envoyerLien} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            placeholder="prenom.nom@univ-fhb.edu.ci"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="champ"
          />
          {erreur && <p className="text-sm text-wine">{erreur}</p>}
          <button
            type="submit"
            className="self-start bg-ink px-6 py-2 text-sm text-parchment hover:bg-wine"
          >
            Recevoir le lien de connexion
          </button>
        </form>
      )}
    </div>
  );
}
