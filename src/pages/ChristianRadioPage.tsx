import SEO from "../components/SEO";

export default function ChristianRadioPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-black dark:text-white">
      <SEO
        title="Christian Radio Online | Praise FM Global"
        description="Listen to Christian radio online with Praise FM. Streaming worship music, gospel songs, and inspirational content worldwide 24/7."
      />

      <h1 className="text-2xl font-bold mb-4">
        Christian Radio Online
      </h1>

      <p className="mb-4">
        Praise FM is a global Christian radio station streaming online 24/7.
        Enjoy worship music, gospel songs, and inspirational programming from anywhere in the world.
      </p>

      <p className="mb-4">
        Our mission is to connect listeners worldwide through faith, music, and hope.
        No matter where you are — Africa, Europe, Asia, or the Americas — Praise FM is with you.
      </p>

      <p>
        <a href="/#/gospel-radio">Gospel Radio</a> |{" "}
        <a href="/#/worship-radio">Worship Radio</a> |{" "}
        <a href="/">Listen Live</a>
      </p>
    </main>
  );
}