import SEO from "../components/SEO";

export default function ProgramsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <SEO
        title="Praise FM Programs | Christian Radio Shows"
        description="Discover all programs on Praise FM United States. Christian radio shows, worship music, gospel, and inspirational content 24/7."
      />

      <h1>Praise FM Programs</h1>

      <p>
        Explore the full lineup of Praise FM United States. Our Christian radio
        station features inspiring programs, worship music, gospel hits, and
        uplifting content throughout the day.
      </p>

      <h2>Featured Shows</h2>

      <ul>
        <li>
          <a href="/programs/morning-show-with-stancy-campbell">
            Morning Show With Stancy Campbell
          </a>
        </li>
        <li>
          <a href="/programs/midday-grace">
            Midday Grace
          </a>
        </li>
        <li>
          <a href="/programs/praise-fm-worship">
            Praise FM Worship
          </a>
        </li>
      </ul>

      <h2>Listen Anytime</h2>
      <p>
        All programs are part of our 24/7 Christian radio stream, available
        worldwide. Listen live and stay connected through music, faith, and
        encouragement.
      </p>

      <nav>
        <a href="/listen-live">Listen Live</a> |{" "}
        <a href="/christian-radio">Christian Radio</a>
      </nav>
    </main>
  );
}
