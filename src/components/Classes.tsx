import { Row, Col, Table, Button, Typography, Grid, Card } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { schedule, type ScheduleRow } from '../data/schedule'
import { commitments } from '../data/benefits'
import { brand } from '../theme'

const { Title, Paragraph, Text } = Typography
const { useBreakpoint } = Grid

function scrollToContact() {
  const el = document.getElementById('contact')
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' })
}

const columns: ColumnsType<ScheduleRow> = [
  { title: 'Day', dataIndex: 'day', render: (v) => <Text strong>{v}</Text> },
  { title: 'Class Name', dataIndex: 'className' },
  { title: 'Age Group', dataIndex: 'ageGroup' },
  { title: 'Time Slot', dataIndex: 'time' },
  { title: 'Pricing', dataIndex: 'price', render: (v) => <Text strong>{v}</Text> },
]

export default function Classes() {
  const screens = useBreakpoint()
  const isMobile = !screens.md

  return (
    <section id="classes" className="section section--alt">
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

        <Row gutter={[24, 24]} style={{ marginBottom: 56 }}>
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

        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
          Weekly Durbanville Studio Schedule
        </Title>

        {isMobile ? (
          <Row gutter={[16, 16]}>
            {schedule.map((row) => (
              <Col xs={24} key={row.key}>
                <Card style={{ background: row.accent }}>
                  <Title level={4} style={{ marginTop: 0 }}>
                    {row.day} — {row.className}
                  </Title>
                  <p style={{ margin: 0 }}>
                    <Text strong>Age:</Text> {row.ageGroup}
                  </p>
                  <p style={{ margin: 0 }}>
                    <Text strong>Time:</Text> {row.time}
                  </p>
                  <p style={{ margin: 0 }}>
                    <Text strong>Price:</Text> {row.price}
                  </p>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Table
            columns={columns}
            dataSource={schedule}
            pagination={false}
            bordered
          />
        )}

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Paragraph>
            📍 <Text strong>Location:</Text> Durbanville Studio, 56 Plataan Road, Durbanville,
            Cape Town (Free parking available).
          </Paragraph>
          <Button type="primary" size="large" shape="round" onClick={scrollToContact}>
            Book a Spot Now
          </Button>
        </div>
      </div>
    </section>
  )
}
