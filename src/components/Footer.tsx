import { Layout, Row, Col, Typography } from 'antd'
import Logo from './Logo'
import { site } from '../data/site'
import { brand } from '../theme'

const { Paragraph } = Typography

const quickLinks = [
  { key: 'about', label: 'Benefits' },
  { key: 'classes', label: 'Session Details' },
  { key: 'gallery', label: 'Inside the Studio' },
  { key: 'faq', label: 'Frequently Asked Questions' },
  { key: 'contact', label: 'Contact Coordinates' },
]

const hours = [
  { day: 'Wednesday:', time: '14:00 - 16:30' },
  { day: 'Saturday:', time: '09:00 - 11:30' },
  { day: 'Other Days:', time: 'Private Bookings & Setup Only' },
]

export default function Footer() {
  return (
    <Layout.Footer style={{ background: brand.bgAlt, padding: 0 }}>
      <div className="container" style={{ padding: '64px 20px' }}>
        <Row gutter={[40, 40]}>
          <Col xs={24} md={10}>
            <Logo />
            <Paragraph style={{ color: brand.textMuted, marginTop: 16 }}>
              A safe, non-toxic, and dynamic sensory play hub in central Durbanville.
              Dedicated to nurturing child brains through laughter, creative splats, and
              worry-free messy exploration.
            </Paragraph>
            <div style={{ display: 'flex', gap: 16, fontSize: '1.4rem' }}>
              <a href={site.facebook} target="_blank" rel="noopener" aria-label="Facebook">📘</a>
              <a href={site.instagram} target="_blank" rel="noopener" aria-label="Instagram">📸</a>
              <a href={site.youtube} target="_blank" rel="noopener" aria-label="YouTube">🎥</a>
            </div>
          </Col>

          <Col xs={12} md={7}>
            <h5>Quick Links</h5>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: 2 }}>
              {quickLinks.map((l) => (
                <li key={l.key}>
                  <a href={`#${l.key}`}>{l.label}</a>
                </li>
              ))}
            </ul>
          </Col>

          <Col xs={12} md={7}>
            <h5>Studio Hours</h5>
            <ul style={{ listStyle: 'none', padding: 0, lineHeight: 2 }}>
              {hours.map((h) => (
                <li key={h.day}>
                  <strong>{h.day}</strong> {h.time}
                </li>
              ))}
            </ul>
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
