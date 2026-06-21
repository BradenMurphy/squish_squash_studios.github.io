import { Button } from 'antd'
import { EnvironmentOutlined } from '@ant-design/icons'
import { site } from '../data/site'
import { brand } from '../theme'

// No-key Google Maps embed (no API key / billing required for the basic query embed).
// Query by the street address so the pin always matches the studio's real location.
const embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
  site.address,
)}&z=16&output=embed`

// Google's cross-platform directions URL: opens the Maps app + navigation on mobile,
// maps.google.com with directions on desktop.
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  site.address,
)}`

export default function StudioMap({
  height = 250,
  fullBleed = false,
}: {
  height?: number
  fullBleed?: boolean
}) {
  // Full-bleed breaks the map out of the centered container to span the whole viewport.
  const bleedStyle = fullBleed
    ? { width: '100vw', marginLeft: 'calc(50% - 50vw)', borderRadius: 0 }
    : { width: '100%', borderRadius: 16 }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...bleedStyle }}>
      <iframe
        title={`Map to ${site.name}`}
        src={embedSrc}
        style={{ height, width: '100%', border: 0, display: 'block' }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <Button
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        size="large"
        shape="round"
        icon={<EnvironmentOutlined style={{ color: brand.pink }} />}
        style={{
          position: 'absolute',
          left: 24,
          bottom: 24,
          background: '#fff',
          border: 'none',
          fontWeight: 600,
          boxShadow: '0 6px 18px rgba(0,0,0,0.22)',
        }}
      >
        Get Directions
      </Button>
    </div>
  )
}
