import { useEffect, useMemo, useState } from 'react'
import { Row, Col, Form, Input, Select, Button, Typography } from 'antd'
import { WhatsAppOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { site } from '../data/site'
import { sessionOptions as fallbackOptions } from '../data/schedule'
import { fetchAvailability } from '../lib/availability'
import type { Availability } from '../data/booking'
import { brand } from '../theme'

const { Title, Paragraph } = Typography
const { TextArea } = Input

interface MessageValues {
  parent_name: string
  num_children: string
  preferred_session: string
  allergies_requirements?: string
}

const childCountOptions = ['1', '2', '3', '4', '5+'].map((n) => ({ value: n, label: n }))

// Build a pre-filled WhatsApp message from the form details.
function buildWhatsAppLink(v: MessageValues): string {
  const lines = [
    'Hi Squish Squash Studios! 🎨 I’d love to book a messy play class.',
    '',
    `Parent: ${v.parent_name}`,
    `Number of children: ${v.num_children}`,
    `Preferred session: ${v.preferred_session}`,
  ]
  if (v.allergies_requirements?.trim()) {
    lines.push(`Allergies / requirements: ${v.allergies_requirements.trim()}`)
  }
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`
}

export default function MessageForm() {
  const [sessions, setSessions] = useState<Availability[]>([])
  const [loading, setLoading] = useState(true)

  // Pull the preferred-session options from the same availability feed the
  // calendar uses, so the list always reflects real, published sessions.
  useEffect(() => {
    let alive = true
    fetchAvailability()
      .then((data) => alive && setSessions(data))
      .catch(() => {}) // fall back to the static options below
      .finally(() => alive && setLoading(false))
    return () => {
      alive = false
    }
  }, [])

  const sessionOptions = useMemo(() => {
    const today = dayjs().format('YYYY-MM-DD')
    const upcoming = sessions
      .filter((s) => s.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
    if (!upcoming.length) return fallbackOptions
    return upcoming.map((s) => {
      const when = dayjs(s.date).format('YYYY MMMM D (dddd)')
      const full = s.spotsLeft <= 0
      return { value: when, label: full ? `${when} — Full` : when, disabled: full }
    })
  }, [sessions])

  const onFinish = (values: MessageValues) => {
    window.open(buildWhatsAppLink(values), '_blank', 'noopener')
  }

  return (
    <div
      style={{
        background: brand.bgCard,
        borderRadius: 24,
        padding: 32,
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08)',
      }}
    >
      <Title level={3} style={{ marginTop: 0 }}>
        Send Us a Message
      </Title>
      <Paragraph style={{ color: brand.textMuted }}>
        Fill in the quick details and tap below — we’ll open WhatsApp with your message ready
        to send to our Durbanville coordinator.
      </Paragraph>

      <Form layout="vertical" onFinish={onFinish} requiredMark={false}>
        <Form.Item
          label="Parent's Full Name"
          name="parent_name"
          rules={[{ required: true, message: 'Please enter your name' }]}
        >
          <Input placeholder="Annelie van der Merwe" />
        </Form.Item>

        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Form.Item
              label="Number of Children"
              name="num_children"
              rules={[{ required: true, message: 'How many?' }]}
            >
              <Select placeholder="1" options={childCountOptions} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={16}>
            <Form.Item
              label="Preferred Session"
              name="preferred_session"
              rules={[{ required: true, message: 'Please choose a session' }]}
            >
              <Select
                placeholder="Select a session..."
                options={sessionOptions}
                loading={loading}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Dietary Requirements or Skin Allergies (if any)"
          name="allergies_requirements"
        >
          <TextArea
            rows={2}
            placeholder="e.g. Leo is allergic to gluten. We'd love a gluten-safe sensory tub!"
          />
        </Form.Item>

        <Button
          htmlType="submit"
          size="large"
          icon={<WhatsAppOutlined />}
          block
          style={{
            background: brand.whatsapp,
            borderColor: brand.whatsapp,
            color: '#fff',
          }}
        >
          Send via WhatsApp
        </Button>
      </Form>
    </div>
  )
}
