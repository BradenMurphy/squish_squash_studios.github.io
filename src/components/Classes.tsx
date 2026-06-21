import { Row, Col, Typography, Card } from 'antd'
import { commitments } from '../data/benefits'
import { brand } from '../theme'

const { Title, Paragraph } = Typography

export default function Classes() {
  return (
    <div id="classes" className="section-block">
      <div className="container">
        <div className="section-header">
          <span className="subheading">Our Play Sessions</span>
          <Title level={2} className="section-title">
            Designed for Happy Kids, Loved by Parents
          </Title>
          <Paragraph className="section-desc">
            We structure our studio with safety and peace-of-mind at the core. All raw
            materials are edible-safe, full protective aprons are provided, and you get to
            walk away stress-free with zero cleanup.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          {commitments.map((c) => (
            <Col xs={24} md={8} key={c.title}>
              <Card style={{ height: '100%' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div
                    style={{
                      flexShrink: 0,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: c.color,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                    }}
                  >
                    {c.icon}
                  </div>
                  <div>
                    <Title level={4} style={{ margin: 0 }}>
                      {c.title}
                    </Title>
                    <Paragraph style={{ color: brand.textMuted, margin: 0 }}>{c.desc}</Paragraph>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  )
}
