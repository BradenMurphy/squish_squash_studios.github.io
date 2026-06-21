import { Layout, Row, Col, Typography } from 'antd'
import { FacebookFilled } from '@ant-design/icons'
import Logo from './Logo'
import { site } from '../data/site'
import { brand } from '../theme'

const { Paragraph } = Typography

// The real Instagram mark: the camera glyph filled with Instagram's brand gradient.
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="ig-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#feda75" />
          <stop offset="25%" stopColor="#fa7e1e" />
          <stop offset="50%" stopColor="#d62976" />
          <stop offset="75%" stopColor="#962fbf" />
          <stop offset="100%" stopColor="#4f5bd5" />
        </linearGradient>
      </defs>
      <path
        fill="url(#ig-gradient)"
        d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.43.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.43.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.43-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.43-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.12 1.38C1.35 2.68.93 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.12.66.66 1.33 1.08 2.12 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.12-1.38.66-.66 1.08-1.33 1.38-2.12.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.3-.79-.72-1.46-1.38-2.12C21.32 1.35 20.65.93 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0m0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84M12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4m6.41-10.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44"
      />
    </svg>
  )
}

export default function Footer() {
  return (
    <Layout.Footer style={{ background: brand.bgAlt, padding: 0 }}>
      <div className="container" style={{ padding: '64px 20px' }}>
        <Row gutter={[40, 40]}>
          <Col xs={24} md={16}>
            <Logo />
            <Paragraph style={{ color: brand.textMuted, marginTop: 16 }}>
              A safe, non-toxic, and dynamic sensory play hub in central Durbanville.
              Dedicated to nurturing child brains through laughter, creative splats, and
              worry-free messy exploration.
            </Paragraph>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: '2rem', marginTop: 8 }}
            >
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener"
                aria-label="Facebook"
                style={{ display: 'inline-flex', color: '#1877F2' }}
              >
                <FacebookFilled />
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener"
                aria-label="Instagram"
                style={{ display: 'inline-flex' }}
              >
                <InstagramIcon />
              </a>
            </div>
          </Col>
        </Row>
      </div>

      <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', padding: '20px 0' }}>
        <div
          className="container"
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'space-between', color: brand.textMuted, fontSize: '0.9rem' }}
        >
          <p style={{ margin: 0 }}>
            © 2026 Squish Squash Studios. All Rights Reserved. Made with love for happy kids
            in Durbanville.
          </p>
          <p style={{ margin: 0 }}>Optimized for free hosting on GitHub Pages 🚀</p>
        </div>
      </div>
    </Layout.Footer>
  )
}
