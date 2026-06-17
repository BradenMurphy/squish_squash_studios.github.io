export default function Logo() {
  return (
    <a
      href="#hero"
      aria-label="Squish Squash Studios home"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontFamily: "'Fredoka', sans-serif",
        fontWeight: 700,
        fontSize: '1.25rem',
      }}
    >
      <span style={{ fontSize: '1.6rem' }}>🎨</span>
      <span>
        <span className="logo-squish">Squish</span>{' '}
        <span className="logo-squash">Squash</span>{' '}
        <span className="logo-studios">Studios</span>
      </span>
    </a>
  )
}
