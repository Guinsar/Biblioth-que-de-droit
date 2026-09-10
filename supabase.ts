import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Travail = {
  id: string;
  titre: string;
  auteur: string;
  annee: number;
  type_travail: "memoire" | "expose" | "dissertation" | "these";
  encadrant: string | null;
  resume: string;
  mots_cles: string[];
  fichier_url: string;
  statut: "en_attente" | "publie" | "refuse" | "retire";
  consentement_diffusion: boolean;
  consentement_le: string | null;
  consultations: number;
  telechargements: number;
  depose_par: string;
  cree_le: string;
};
