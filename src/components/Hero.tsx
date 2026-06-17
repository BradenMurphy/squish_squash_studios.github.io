import { Row, Col, Button, Tag, Typography } from 'antd'
import { brand } from '../theme'

const { Title, Paragraph } = Typography

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 72
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

export default function Hero() {
  return (
    <section id="hero" style={{ position: 'relative', padding: '72px 0 120px' }}>
      <div className="container">
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} md={12}>
            <Tag
              style={{
                borderRadius: 999,
                padding: '6px 16px',
                fontSize: '0.9rem',
                background: brand.pinkLight,
                color: brand.pink,
                border: 'none',
                marginBottom: 16,
              }}
            >
              🎨 Sensory Play Durbanville
            </Tag>
            <Title style={{ fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', marginTop: 0 }}>
              Welcome to <span style={{ color: brand.pink }}>Squish</span>{' '}
              <span style={{ color: brand.turquoise }}>Squash</span> Studios
            </Title>
            <Paragraph style={{ fontSize: '1.15rem', color: brand.textMuted }}>
              Where messy play meets sensory development! We provide creative, joyful, and
              fully-managed messy play experiences that ignite your child’s curiosity while
              you leave the cleanup to us.
            </Paragraph>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 24 }}>
              <Button
                type="primary"
                size="large"
                shape="round"
                className="shadow-pulse"
                onClick={() => scrollTo('contact')}
              >
                Book a Class 🚀
              </Button>
              <Button size="large" shape="round" onClick={() => scrollTo('classes')}>
                Explore Schedule
              </Button>
            </div>
          </Col>

          <Col xs={24} md={12}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  borderRadius: 32,
                  overflow: 'hidden',
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.15)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&h=800&q=80"
                  alt="Happy smiling toddler covered in bright colorful paint doing sensory messy play"
                  loading="eager"
                  style={{ width: '100%', display: 'block' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    background: 'rgba(255,255,255,0.92)',
                    borderRadius: 999,
                    padding: '8px 18px',
                    fontWeight: 600,
                    color: brand.green,
                  }}
                >
                  100% Non-Toxic &amp; Safe
                </div>
              </div>
              <div className="mini-splat" style={{ top: -16, left: -12 }}>💦</div>
              <div className="mini-splat" style={{ top: 30, right: -10, animationDelay: '-1s' }}>✨</div>
              <div className="mini-splat" style={{ bottom: -10, right: 40, animationDelay: '-2s' }}>👶</div>
            </div>
          </Col>
        </Row>
      </div>

      <div className="section-divider">
        <svg
          data-name="Layer 1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C26.9,8.75,57.05,18.3,88.43,26.85,154.06,44.76,226.56,64.08,321.39,56.44Z"
            className="shape-fill"
          />
        </svg>
      </div>
    </section>
  )
}
