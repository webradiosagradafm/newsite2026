import SEO from "../components/SEO";

export default function ProgramsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-black dark:text-white">
      <SEO
        title="Praise FM Programs | Global Christian Radio Shows"
        description="Explore all programs on Praise FM. Christian radio shows, worship music, and gospel programming streaming worldwide."
      />

      <h1 className="text-2xl font-bold mb-4">
        Praise FM Programs
      </h1>

      <p className="mb-4">
        Discover the full lineup of Praise FM. Our programs are designed to inspire,
        encourage, and bring faith-filled music to listeners around the world.
      </p>

      <p className="mb-4">
        From worship sessions to gospel hits and special shows, Praise FM delivers
        a global Christian radio experience 24/7.
      </p>

      <p>
        <a href="/#/christian-radio">Christian Radio</a> |{" "}
        <a href="/#/gospel-radio">Gospel Radio</a> |{" "}
        <a href="/#/worship-radio">Worship Radio</a>
      </p>
    </main>
  );
}