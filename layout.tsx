import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Archives — Faculté de Droit, UFHB",
  description:
    "Dépôt et consultation des mémoires, exposés et dissertations de la filière Droit à l'UFHB.",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#1C2B3A",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-parchment font-sans text-charcoal">
        <header className="border-b border-rule">
          <div className="mx-auto flex max-w-5xl items-baseline justify-between px-6 py-6">
            <Link href="/" className="font-serif text-xl text-ink">
              Archives — Faculté de Droit
            </Link>
            <nav className="flex gap-6 text-sm">
              <Link href="/" className="hover:text-wine">
                Consulter
              </Link>
              <Link href="/deposer" className="hover:text-wine">
                Déposer un travail
              </Link>
              <Link href="/profil" className="hover:text-wine">
                Mes dépôts
              </Link>
              <Link href="/charte" className="hover:text-wine">
                Charte
              </Link>
              <Link href="/moderation" className="hover:text-wine">
                Modération
              </Link>
              <Link href="/connexion" className="hover:text-wine">
                Connexion
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
        <footer className="mt-16 border-t border-rule">
          <div className="mx-auto flex max-w-5xl items-baseline justify-between px-6 py-6 text-sm text-charcoal/60">
            <span>Université Félix Houphouët-Boigny de Cocody — Filière Droit</span>
            <Link href="/a-propos" className="hover:text-wine">
              À propos
            </Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
