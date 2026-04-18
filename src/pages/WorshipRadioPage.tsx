import SEO from "../components/SEO";

export default function WorshipRadioPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-black dark:text-white">
      <SEO
        title="Worship Radio Live | Praise FM Global"
        description="Listen to worship radio live with Praise FM. Non-stop worship music and praise songs streaming worldwide."
      />

      <h1 className="text-2xl font-bold mb-4">
        Worship Radio Live
      </h1>

      <p className="mb-4">
        Praise FM is your destination for worship radio live. Experience non-stop worship music,
        praise songs, and a peaceful atmosphere designed to strengthen your faith.
      </p>

      <p className="mb-4">
        Wherever you are in the world, you can connect through worship and music that inspires.
        Let every song bring you closer to God.
      </p>

      <p>
        <a href="/#/christian-radio">Christian Radio</a> |{" "}
        <a href="/#/gospel-radio">Gospel Radio</a> |{" "}
        <a href="/">Listen Live</a>
      </p>
    </main>
  );
}