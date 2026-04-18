import SEO from "../components/SEO";

export default function GospelRadioPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <SEO
        title="Gospel Radio Online | Praise FM United States"
        description="Listen to gospel radio online with Praise FM United States. Discover gospel music, Christian hits, and uplifting radio streaming worldwide."
      />

      <h1>Gospel Radio Online</h1>

      <p>
        Praise FM United States brings you the best in gospel radio online.
        Enjoy a powerful mix of gospel music, Christian hits, and inspirational
        songs anytime, anywhere.
      </p>

      <h2>Global Gospel Experience</h2>
      <p>
        Our gospel programming connects listeners from around the world,
        including the United States, Africa, Europe, and beyond. Music is the
        language that unites us.
      </p>

      <h2>Music That Inspires</h2>
      <p>
        From classic gospel to modern Christian artists, Praise FM delivers a
        continuous stream of uplifting music designed to strengthen your faith.
      </p>

      <nav>
        <a href="/christian-radio">Christian Radio</a> |{" "}
        <a href="/worship-radio">Worship Radio</a> |{" "}
        <a href="/listen-live">Listen Live</a>
      </nav>
    </main>
  );
}
