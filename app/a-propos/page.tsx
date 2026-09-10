export default function APropos() {
  return (
    <div className="max-w-prose">
      <h1 className="font-serif text-3xl text-ink">À propos</h1>

      <p className="mt-4 text-charcoal/80">
        Cette plateforme réunit les mémoires, exposés et dissertations de la
        filière Droit à l'Université Félix Houphouët-Boigny de Cocody, pour
        que les étudiants puissent consulter le travail des promotions
        précédentes au lieu de repartir de zéro sur des sujets déjà traités.
      </p>

      <h2 className="mt-8 font-serif text-xl text-ink">Un projet porté par un étudiant</h2>
      <p className="mt-2 text-charcoal/80">
        Le projet est initié par un étudiant en Master 2 Droit Public de
        l'UFHB, à titre de pilote pour la filière. Il n'engage pas, à ce
        stade, une décision officielle de l'université, mais vise à en
        démontrer l'utilité avant une adoption plus large.
      </p>

      <h2 className="mt-8 font-serif text-xl text-ink">Comment fonctionne la modération</h2>
      <p className="mt-2 text-charcoal/80">
        Chaque travail déposé reste invisible aux autres étudiants tant qu'un
        modérateur ne l'a pas validé. Cette étape vérifie la cohérence des
        informations fournies (titre, auteur, année) et l'absence de contenu
        manifestement emprunté sans référence. Elle ne porte pas de jugement
        sur la qualité académique du travail, qui reste celle évaluée par le
        jury lors de la soutenance.
      </p>

      <h2 className="mt-8 font-serif text-xl text-ink">Droit d'auteur</h2>
      <p className="mt-2 text-charcoal/80">
        Le dépôt d'un travail est encadré par une charte fondée sur la loi
        ivoirienne relative au droit d'auteur, détaillée sur la page{" "}
        <a href="/charte" className="text-wine underline">
          Charte de dépôt
        </a>
        . Chaque auteur reste titulaire de ses droits et peut retirer son
        travail à tout moment.
      </p>

      <h2 className="mt-8 font-serif text-xl text-ink">Signaler un problème</h2>
      <p className="mt-2 text-charcoal/80">
        Pour signaler une erreur, un contenu inapproprié ou un travail
        déposé sans autorisation de son auteur, contacte : [adresse email à
        compléter].
      </p>
    </div>
  );
}
