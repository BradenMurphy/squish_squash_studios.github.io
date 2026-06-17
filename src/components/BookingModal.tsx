import { useEffect, useState } from 'react'
import {
  Modal,
  Form,
  Input,
  Button,
  Checkbox,
  Space,
  Divider,
  Typography,
  App,
} from 'antd'
import { PlusOutlined, DeleteOutlined, WhatsAppOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { Availability, ChildEntry } from '../data/booking'
import { priceForChildren } from '../data/pricing'
import { postBooking } from '../lib/availability'
import { buildBookingWhatsAppLink } from '../lib/whatsapp'
import { brand } from '../theme'

const { Text, Title } = Typography

interface Props {
  session: Availability | null
  open: boolean
  onClose: () => void
  onBooked: () => void // trigger an availability refresh
}

interface FormValues {
  parent_name: string
  phone: string
  children: ChildEntry[]
  allergies?: string
  company?: string // honeypot
}

export default function BookingModal({ session, open, onClose, onBooked }: Props) {
  const { message } = App.useApp()
  const [form] = Form.useForm<FormValues>()
  const [submitting, setSubmitting] = useState(false)

  // Reset to a single empty child each time the modal opens for a new session.
  useEffect(() => {
    if (open) {
      form.resetFields()
      form.setFieldsValue({ children: [{ name: '', age: '', sibling: false }] })
    }
  }, [open, session, form])

  const childrenValues = Form.useWatch('children', form) || []
  const flags = childrenValues.map((c) => !!c?.sibling)
  const prices = priceForChildren(flags)
  const total = prices.reduce((sum, p) => sum + p, 0)
  const numChildren = childrenValues.length

  const isFull = !!session && session.spotsLeft <= 0
  const overCapacity = !!session && numChildren > session.spotsLeft

  const onFinish = async (values: FormValues) => {
    if (!session) return
    if (values.company) return // honeypot tripped

    const summary = values.children
      .map((c, i) => `${c.name} (${c.age}${c.sibling ? ', sibling' : ''}) - R${prices[i]}`)
      .join('; ')

    setSubmitting(true)
    try {
      const result = await postBooking({
        session_date: session.date,
        parent_name: values.parent_name,
        phone: values.phone,
        children: summary,
        num_children: values.children.length,
        total: `R${total}`,
        allergies: values.allergies,
        company: values.company,
      })

      if (result.ok) {
        message.success('Booking saved! 🎉 Opening WhatsApp to confirm with the studio…')
        window.open(
          buildBookingWhatsAppLink({
            session,
            parentName: values.parent_name,
            phone: values.phone,
            childrenSummary: summary,
            total,
            allergies: values.allergies,
          }),
          '_blank',
          'noopener',
        )
        onBooked()
        onClose()
      } else if (result.reason === 'full') {
        message.error('Sorry — this class just filled up. Please pick another date.')
        onBooked()
      } else {
        message.error('Something went wrong saving your booking. Please try WhatsApp instead.')
      }
    } catch {
      message.error('Connection error. Please try again or message us on WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
      title={
        session ? (
          <div>
            <Title level={4} style={{ margin: 0 }}>
              {session.className}
            </Title>
            <Text type="secondary">
              {dayjs(session.date).format('dddd D MMMM YYYY')} · {session.time}
            </Text>
          </div>
        ) : (
          'Book a class'
        )
      }
    >
      {session && (
        <>
          <div style={{ margin: '8px 0 16px' }}>
            {isFull ? (
              <Text strong style={{ color: brand.pink }}>
                This class is fully booked.
              </Text>
            ) : (
              <Text strong style={{ color: brand.green }}>
                {session.spotsLeft} spot{session.spotsLeft === 1 ? '' : 's'} left
              </Text>
            )}
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false}>
            {/* Honeypot — hidden from humans */}
            <Form.Item name="company" style={{ display: 'none' }} aria-hidden>
              <Input tabIndex={-1} autoComplete="off" />
            </Form.Item>

            <Form.Item
              label="Parent's Full Name"
              name="parent_name"
              rules={[{ required: true, message: 'Please enter your name' }]}
            >
              <Input placeholder="Sarah Mitchell" />
            </Form.Item>

            <Form.Item
              label="WhatsApp Number"
              name="phone"
              rules={[{ required: true, message: 'Please enter your number' }]}
            >
              <Input placeholder="082 579 1653" />
            </Form.Item>

            <Divider style={{ margin: '8px 0 16px' }}>Children</Divider>

            <Form.List name="children">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Space
                      key={field.key}
                      align="baseline"
                      style={{ display: 'flex', marginBottom: 8 }}
                      wrap
                    >
                      <Form.Item
                        name={[field.name, 'name']}
                        rules={[{ required: true, message: "Child's name" }]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input placeholder="Child's name" style={{ width: 150 }} />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'age']}
                        rules={[{ required: true, message: 'Age' }]}
                        style={{ marginBottom: 0 }}
                      >
                        <Input placeholder="Age" style={{ width: 70 }} />
                      </Form.Item>
                      <Form.Item
                        name={[field.name, 'sibling']}
                        valuePropName="checked"
                        style={{ marginBottom: 0 }}
                      >
                        <Checkbox>Sibling</Checkbox>
                      </Form.Item>
                      {fields.length > 1 && (
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => remove(field.name)}
                          aria-label="Remove child"
                        />
                      )}
                    </Space>
                  ))}
                  <Form.Item style={{ marginBottom: 8 }}>
                    <Button
                      type="dashed"
                      onClick={() => add({ name: '', age: '', sibling: false })}
                      icon={<PlusOutlined />}
                      block
                    >
                      Add another child
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Text type="secondary" style={{ fontSize: '0.85rem' }}>
              Tick “Sibling” for each child who is a sibling of another child in this booking —
              the first sibling is full price, each additional sibling is 15% off.
            </Text>

            <Form.Item
              label="Dietary Requirements or Allergies (optional)"
              name="allergies"
              style={{ marginTop: 16 }}
            >
              <Input.TextArea rows={2} placeholder="e.g. gluten-free sensory tub please" />
            </Form.Item>

            {/* Price breakdown */}
            <div
              style={{
                background: brand.bgAlt,
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
              }}
            >
              {childrenValues.map((c, i) => (
                <div
                  key={i}
                  style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}
                >
                  <span>{c?.name?.trim() ? c.name : `Child ${i + 1}`}</span>
                  <span>R{prices[i]}</span>
                </div>
              ))}
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Estimated total</span>
                <span>R{total}</span>
              </div>
              <Text type="secondary" style={{ fontSize: '0.8rem' }}>
                Payment is arranged offline (EFT / SnapScan) — this is an estimate.
              </Text>
            </div>

            {overCapacity && !isFull && (
              <Text style={{ color: brand.pink, display: 'block', marginBottom: 12 }}>
                Only {session.spotsLeft} spot{session.spotsLeft === 1 ? '' : 's'} left — please
                reduce the number of children.
              </Text>
            )}

            <Button
              htmlType="submit"
              size="large"
              block
              loading={submitting}
              disabled={isFull || overCapacity}
              icon={<WhatsAppOutlined />}
              style={{ background: brand.whatsapp, borderColor: brand.whatsapp, color: '#fff' }}
            >
              Book &amp; Confirm on WhatsApp
            </Button>
          </Form>
        </>
      )}
    </Modal>
  )
}
