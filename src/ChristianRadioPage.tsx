import SEO from "../components/SEO";

export default function ChristianRadioPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <SEO
        title="Christian Radio Online | Praise FM United States"
        description="Listen to Christian radio online with Praise FM United States. 24/7 worship music, gospel songs, and inspirational programming worldwide."
      />

      <h1>Christian Radio Online</h1>

      <p>
        Praise FM United States is a Christian radio station streaming online
        24/7. We bring worship music, gospel songs, and inspirational content
        to listeners across the United States and around the world.
      </p>

      <h2>What is Christian Radio?</h2>
      <p>
        Christian radio focuses on faith-based music and messages that inspire,
        encourage, and uplift. Praise FM combines modern worship, gospel hits,
        and curated programming for a global audience.
      </p>

      <h2>Why Listen to Praise FM?</h2>
      <p>
        Our station is designed for listeners who want continuous Christian
        music without interruption. From worship to contemporary gospel, Praise
        FM offers a unique listening experience.
      </p>

      <nav>
        <a href="/gospel-radio">Gospel Radio</a> |{" "}
        <a href="/worship-radio">Worship Radio</a> |{" "}
        <a href="/listen-live">Listen Live</a>
      </nav>
    </main>
  );
}
