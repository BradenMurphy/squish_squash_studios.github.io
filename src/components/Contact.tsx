import { useRef, useState } from 'react'
import { Row, Col, Form, Input, Select, Button, Typography, App } from 'antd'
import emailjs from '@emailjs/browser'
import { site, emailjsConfig } from '../data/site'
import { sessionOptions } from '../data/schedule'
import { WhatsAppOutlined } from '@ant-design/icons'
import StudioMap from './StudioMap'
import { brand } from '../theme'

const { Title, Paragraph } = Typography
const { TextArea } = Input

const infoItems = [
  { icon: '📍', title: 'Our Durbanville Studio', value: site.address },
  { icon: '✉️', title: 'Email Support', value: site.email },
  { icon: '📞', title: 'Call or WhatsApp', value: `${site.phone} (${site.coordinator})` },
]

export default function Contact() {
  const { message } = App.useApp()
  const formRef = useRef<HTMLFormElement>(null)
  const [submitting, setSubmitting] = useState(false)

  const onFinish = async () => {
    if (!formRef.current) return
    setSubmitting(true)
    try {
      await emailjs.sendForm(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        formRef.current,
        { publicKey: emailjsConfig.publicKey },
      )
      message.success(
        'Hurrah! 🎉 Your booking request has been sent! We will WhatsApp or email you within 24 hours.',
      )
      formRef.current.reset()
    } catch (err) {
      console.error('EmailJS failed:', err)
      message.error(
        'Oops! 😔 Something went wrong. Please try again or tap the WhatsApp button to chat directly!',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section id="contact" className="section">
      <div className="container">
        <Row gutter={[48, 48]}>
          <Col xs={24} md={11}>
            <span className="subheading">Get in Touch</span>
            <Title level={2} className="section-title" style={{ textAlign: 'left' }}>
              Book Your Sensory Adventure Today!
            </Title>
            <Paragraph style={{ color: brand.textMuted }}>
              Ready to experience the joy of worry-free messy play in Durbanville? Send us a
              quick request via the booking form or drop us a WhatsApp message to lock in a
              class. We can't wait to play!
            </Paragraph>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, margin: '24px 0' }}>
              {infoItems.map((item) => (
                <div key={item.title} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                  <div>
                    <h5 style={{ margin: 0 }}>{item.title}</h5>
                    <p style={{ margin: 0, color: brand.textMuted }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <StudioMap />
          </Col>

          <Col xs={24} md={13}>
            <div
              style={{
                background: brand.bgCard,
                borderRadius: 24,
                padding: 32,
                boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08)',
              }}
            >
              <Title level={3} style={{ marginTop: 0 }}>
                Secure a Class Spot
              </Title>
              <Paragraph style={{ color: brand.textMuted }}>
                Fill in the quick details and our team will get right back to you to finalize
                booking.
              </Paragraph>

              {/* native <form ref> is required by emailjs.sendForm */}
              <Form
                ref={formRef as never}
                component="form"
                layout="vertical"
                onFinish={onFinish}
              >
                <Form.Item
                  label="Parent's Full Name"
                  name="parent_name"
                  rules={[{ required: true, message: 'Please enter your name' }]}
                >
                  <Input name="parent_name" placeholder="Sarah Mitchell" />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Email Address"
                      name="email"
                      rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Enter a valid email' },
                      ]}
                    >
                      <Input name="email" placeholder="sarah@example.com" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="WhatsApp Number"
                      name="phone"
                      rules={[{ required: true, message: 'Please enter your number' }]}
                    >
                      <Input name="phone" placeholder="082 579 1653" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Child's Age & Name"
                      name="child_info"
                      rules={[{ required: true, message: 'Please tell us about your child' }]}
                    >
                      <Input name="child_info" placeholder="Leo, 2 years old" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Preferred Session"
                      name="preferred_session"
                      rules={[{ required: true, message: 'Please choose a session' }]}
                    >
                      <Select
                        placeholder="Select a session..."
                        options={sessionOptions}
                        onChange={(val) => {
                          // keep a hidden input in sync for emailjs.sendForm
                          const el = formRef.current?.querySelector<HTMLInputElement>(
                            'input[name="preferred_session"]',
                          )
                          if (el) el.value = val
                        }}
                      />
                    </Form.Item>
                    <input type="hidden" name="preferred_session" />
                  </Col>
                </Row>

                <Form.Item
                  label="Dietary Requirements or Skin Allergies (if any)"
                  name="allergies_requirements"
                >
                  <TextArea
                    name="allergies_requirements"
                    rows={2}
                    placeholder="e.g. Leo is allergic to gluten. We'd love a gluten-safe sensory tub!"
                  />
                </Form.Item>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={submitting}
                    style={{ flex: 1, minWidth: 200 }}
                  >
                    Submit Booking Request
                  </Button>
                  <span style={{ color: brand.textMuted }}>or</span>
                  <Button
                    size="large"
                    href={site.whatsapp}
                    target="_blank"
                    rel="noopener"
                    icon={<WhatsAppOutlined />}
                    style={{
                      flex: 1,
                      minWidth: 200,
                      background: brand.whatsapp,
                      borderColor: brand.whatsapp,
                      color: '#fff',
                    }}
                  >
                    Book via WhatsApp
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  )
}
