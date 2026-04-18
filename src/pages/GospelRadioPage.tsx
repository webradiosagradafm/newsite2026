import SEO from "../components/SEO";

export default function GospelRadioPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-black dark:text-white">
      <SEO
        title="Gospel Radio Online | Praise FM Global"
        description="Listen to gospel radio online with Praise FM. Enjoy gospel music, Christian hits, and uplifting songs streaming worldwide."
      />

      <h1 className="text-2xl font-bold mb-4">
        Gospel Radio Online
      </h1>

      <p className="mb-4">
        Praise FM brings you the best in gospel radio online. Enjoy a powerful mix of gospel music,
        Christian hits, and inspirational songs anytime, anywhere.
      </p>

      <p className="mb-4">
        Our global programming connects listeners from around the world.
        From classic gospel to modern Christian artists, music unites us through faith.
      </p>

      <p>
        <a href="/#/christian-radio">Christian Radio</a> |{" "}
        <a href="/#/worship-radio">Worship Radio</a> |{" "}
        <a href="/">Listen Live</a>
      </p>
    </main>
  );
}