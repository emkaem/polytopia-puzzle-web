import { Link } from 'react-router-dom'

const FEATURES = [
  {
    icon: '🗺️',
    title: 'Hex-grid world',
    body: 'Polytopia takes place on a hexagonal grid. Each tile has a terrain type that determines which units and buildings can be placed on it.',
  },
  {
    icon: '⚔️',
    title: 'Tactical puzzles',
    body: 'Solve carefully crafted scenarios. Move units, capture cities and reach your objective within the given number of turns.',
  },
  {
    icon: '🏆',
    title: 'Learn the game',
    body: 'Whether you\'re a newcomer or a seasoned Polytopia player, the puzzles will sharpen your strategic thinking.',
  },
  {
    icon: '📖',
    title: 'Fan community',
    body: 'This website is made by fans, for fans. Not officially affiliated with Midjiwan AB — but built with a lot of love for the game.',
  },
]

export function HomePage() {
  return (
    <main className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero__eyebrow">Fan website</div>
        <h1 className="hero__title">
          Polytopia puzzles &amp; information
        </h1>
        <p className="hero__sub">
          Explore the hexagonal universe of The Battle of Polytopia.
          Solve tactical puzzles and deepen your knowledge of the game.
        </p>
        <div className="hero__actions">
          <Link to="/puzzles" className="btn btn--primary">
            Browse puzzles
          </Link>
          <a
            href="https://polytopia.io/"
            target="_blank"
            rel="noreferrer"
            className="btn btn--secondary"
          >
            Official game →
          </a>
        </div>
      </section>

      {/* Feature cards */}
      <section className="features">
        {FEATURES.map((f) => (
          <div key={f.title} className="feature-card">
            <span className="feature-card__icon">{f.icon}</span>
            <div className="feature-card__title">{f.title}</div>
            <p className="feature-card__body">{f.body}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
