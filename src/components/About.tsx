import { Row, Col, Card, Typography } from 'antd'
import { benefits } from '../data/benefits'
import { brand } from '../theme'

const { Title, Paragraph } = Typography

export default function About() {
  return (
    <section id="about" className="section section--alt">
      <div className="container">
        <div className="section-header">
          <span className="subheading">Why Messy Play Matters</span>
          <Title level={2} className="section-title">
            Nurturing Brains Through Squish &amp; Squash
          </Title>
          <Paragraph className="section-desc">
            Messy play is more than just fun. It is a vital pathway for child growth.
            Squeezing, pouring, and exploring different textures sparks neurological
            connections, physical agility, and emotional comfort.
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          {benefits.map((b) => (
            <Col xs={24} md={8} key={b.title}>
              <Card
                hoverable
                style={{ height: '100%', borderTop: `4px solid ${b.color}` }}
                cover={
                  <img
                    src={b.image}
                    alt={b.title}
                    loading="lazy"
                    style={{ height: 200, objectFit: 'cover' }}
                  />
                }
              >
                <div
                  style={{
                    fontSize: '1.8rem',
                    width: 56,
                    height: 56,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 16,
                    background: `${b.color}22`,
                    marginBottom: 12,
                  }}
                >
                  {b.icon}
                </div>
                <Title level={3} style={{ fontSize: '1.3rem' }}>
                  {b.title}
                </Title>
                <Paragraph style={{ color: brand.textMuted, marginBottom: 0 }}>
                  {b.desc}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </section>
  )
}
