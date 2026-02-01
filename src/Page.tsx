import styles from './Page.module.css';

const linkCards = [
  {
    title: 'Portfolio',
    description: 'Case studies, motion prototypes and spatial experiments.',
    meta: 'Works · 2022‑2025',
    icon: '/images/icons/253d1c7417cad2997add3bc64a1fbeb5cdd22c40.png',
    href: 'https://example.com/portfolio'
  },
  {
    title: 'Research sketches',
    description: 'Narrative notes from discovery sprints and live interviews.',
    meta: 'Field notes',
    icon: '/images/icons/320cca232dd45144bb7789abca8bbb4c56ffac9b.png',
    href: 'https://example.com/notes'
  },
  {
    title: 'Gemini blog',
    description: 'Short essays on craft, design ethics and AI futures.',
    meta: 'Weekly posts',
    icon: '/images/icons/gemini.png',
    href: 'https://example.com/gemini'
  },
  {
    title: 'Sound & motion',
    description: 'Prototype audio identities and experimental loops.',
    meta: 'New drop 2026',
    icon: '/images/icons/69b375c9f4ebeac5d1e986b45de38cf2f089c09.png',
    href: 'https://example.com/sound'
  }
];

const quickStats = [
  { value: '8+', label: 'Years shaping digital presence' },
  { value: '120k', label: 'People reached through prototypes' },
  { value: '3', label: 'Distinct studios collaborated with' }
];

const aboutHighlights = [
  {
    title: 'Process',
    detail: 'I move from storytelling to prototypes in the same sitting so every decision stays human.',
    tag: 'Strategy'
  },
  {
    title: 'Work',
    detail: 'Experience with fintech, cultural platforms and product teams across EMEA.',
    tag: 'Experience'
  },
  {
    title: 'Tools',
    detail: 'Figma, Framer, Houdini, and a custom Involve typographic system.',
    tag: 'Craft'
  }
];

const milestones = [
  { year: '2025', text: 'Lead designer at Lighthouse Studio, shipping a unified identity for remote banking.' },
  { year: '2023', text: 'Built a digital visite card that became the reference for the Nomad Collective.' },
  { year: '2021', text: 'Collaborated on generative art installations for museums and galleries.' }
];

export default function Page() {
  return (
    <main className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.heroLabel}>Visiting card · digital studio</p>
          <h1 className={styles.heroTitle}>Alice Parker</h1>
          <p className={styles.heroSubtitle}>
            Senior product designer focused on crafting calm interfaces, confident motion and inclusive stories.
          </p>
          <div className={styles.heroActions}>
            <button type="button" className={styles.primaryButton} aria-label="Start a new project conversation">
              Get in touch
            </button>
            <button type="button" className={styles.secondaryButton} aria-label="Download Alice Parker resume">
              Download CV
            </button>
          </div>
          <div className={styles.heroStats}>
            {quickStats.map((stat) => (
              <div key={stat.label} className={styles.statCard}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.heroPortrait}>
          <div className={styles.portraitHalo} aria-hidden="true"></div>
          <img
            src="/images/other/Frame 1597878152.png"
            alt="Alice Parker smiling portrait"
            className={styles.portraitImage}
          />
        </div>
      </header>

      <section className={styles.linksSection} aria-label="Quick links">
        <div className={styles.linksHeading}>
          <p>Tap for the most recent work</p>
          <span>Responsive · curated links</span>
        </div>
        <div className={styles.linksGrid}>
          {linkCards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              className={styles.linkCard}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${card.title}`}
            >
              <div className={styles.linkIcon}>
                <img src={card.icon} alt={`${card.title} icon`} />
              </div>
              <div className={styles.linkCopy}>
                <span className={styles.linkTag}>{card.meta}</span>
                <h3 className={styles.linkTitle}>{card.title}</h3>
                <p className={styles.linkDescription}>{card.description}</p>
              </div>
              <span className={styles.linkChevron} aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.aboutSection} aria-labelledby="about-heading">
        <div className={styles.aboutCopy}>
          <span className={styles.sectionBadge}>About me</span>
          <h2 id="about-heading" className={styles.aboutTitle}>
            I design confident digital stories that feel tactile and warm.
          </h2>
          <p className={styles.aboutDescription}>
            From conversation sketches to polished prototypes, my work balances intuition with measurable
            outcomes. I orchestrate research, motion and tone to build experiences people recall long after they
            leave the screen.
          </p>
          <div className={styles.aboutHighlights}>
            {aboutHighlights.map((highlight) => (
              <article key={highlight.title} className={styles.highlightCard}>
                <span className={styles.highlightTag}>{highlight.tag}</span>
                <h3>{highlight.title}</h3>
                <p>{highlight.detail}</p>
              </article>
            ))}
          </div>
        </div>
        <div className={styles.aboutMilestones}>
          <h3 className={styles.milestoneTitle}>Recent milestones</h3>
          <ul className={styles.milestoneList}>
            {milestones.map((milestone) => (
              <li key={milestone.year}>
                <span className={styles.milestoneYear}>{milestone.year}</span>
                <p>{milestone.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
