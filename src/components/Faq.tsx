import { Collapse, Typography } from 'antd'
import { faqs } from '../data/faqs'

const { Title, Paragraph } = Typography

export default function Faq() {
  return (
    <section id="faq" className="section section--alt">
      <div className="container" style={{ maxWidth: 880 }}>
        <div className="section-header">
          <span className="subheading">Common Parent Questions</span>
          <Title level={2} className="section-title">
            Squish Squash Studio FAQs
          </Title>
          <Paragraph className="section-desc">
            Got questions about messy play? We've got answers. If you don't find what you
            need here, feel free to pop us a WhatsApp message!
          </Paragraph>
        </div>

        {/* antd Collapse in accordion mode replaces the custom accordion JS. */}
        <Collapse
          accordion
          bordered={false}
          items={faqs.map((faq, i) => ({
            key: String(i),
            label: <span style={{ fontWeight: 600 }}>{faq.question}</span>,
            children: <Paragraph style={{ marginBottom: 0 }}>{faq.answer}</Paragraph>,
          }))}
        />
      </div>
    </section>
  )
}
