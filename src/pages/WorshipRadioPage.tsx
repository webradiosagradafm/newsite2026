import SEO from "../components/SEO";

export default function WorshipRadioPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 text-black dark:text-white">
      <SEO
        title="Worship Radio | Praise FM United States"
        description="Listen to worship radio live with Praise FM United States. Non-stop worship music, praise songs, and Christian inspiration 24/7."
      />

      <h1>Worship Radio</h1>

      <p>
        Praise FM United States is your destination for worship radio. Enjoy
        non-stop worship music, praise songs, and a peaceful listening
        experience anytime.
      </p>

      <h2>Non-Stop Worship Music</h2>
      <p>
        Our worship programming includes top Christian artists, live-style
        worship tracks, and songs that help you connect spiritually wherever
        you are.
      </p>

      <h2>A Global Worship Station</h2>
      <p>
        Listeners from across the world tune in to Praise FM for worship music.
        Whether you're at home, driving, or working, our stream is always
        available.
      </p>

      <nav>
        <a href="/christian-radio">Christian Radio</a> |{" "}
        <a href="/gospel-radio">Gospel Radio</a> |{" "}
        <a href="/listen-live">Listen Live</a>
      </nav>
    </main>
  );
}
