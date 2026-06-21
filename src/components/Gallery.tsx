import { Row, Col, Image, Typography } from 'antd'
import { gallery } from '../data/gallery'

const { Title, Paragraph } = Typography

export default function Gallery() {
  return (
    <div id="gallery" className="section-block">
      <div className="container">
        <div className="section-header">
          <span className="subheading">Look Inside the Fun</span>
          <Title level={2} className="section-title">
            Laughter, Splashes, &amp; Bright Discoveries
          </Title>
          <Paragraph className="section-desc">
            See the sensory magic firsthand! Here is a sneak peek into our typical
            classes—filled with textured spaghetti, paint play, safe foaming cream, and
            pure delight.
          </Paragraph>
        </div>

        {/* Image.PreviewGroup gives a built-in lightbox with keyboard nav,
            replacing the hand-written modal from the original site. */}
        <Image.PreviewGroup>
          <Row gutter={[16, 16]}>
            {gallery.map((photo) => (
              <Col xs={12} md={6} key={photo.src}>
                <div style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '1 / 1' }}>
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    width="100%"
                    height="100%"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Image.PreviewGroup>
      </div>
    </div>
  )
}
