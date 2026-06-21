import { Row, Col, Typography } from 'antd'
import { site } from '../data/site'
import StudioMap from './StudioMap'
import { brand } from '../theme'

const { Title } = Typography

const infoItems = [
  { icon: '📍', title: 'Our Durbanville Studio', value: site.address },
  { icon: '✉️', title: 'Email Support', value: site.email },
  { icon: '📞', title: 'Call or WhatsApp', value: `${site.phone} (${site.coordinator})` },
]

export default function Contact() {
  return (
    <section id="contact" className="section" style={{ paddingBottom: 0 }}>
      <div className="container">
        <div className="section-header">
          <span className="subheading">Get in Touch</span>
          <Title level={2} className="section-title">
            Find Us in Durbanville
          </Title>
        </div>

        <Row gutter={[24, 24]} style={{ marginBottom: 32 }}>
          {infoItems.map((item) => (
            <Col xs={24} md={8} key={item.title}>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                <div>
                  <h5 style={{ margin: 0 }}>{item.title}</h5>
                  <p style={{ margin: 0, color: brand.textMuted }}>{item.value}</p>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        <StudioMap height={500} fullBleed />
      </div>
    </section>
  )
}
