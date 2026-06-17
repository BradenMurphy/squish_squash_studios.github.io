import { FloatButton, ConfigProvider } from 'antd'
import { WhatsAppOutlined } from '@ant-design/icons'
import { site } from '../data/site'
import { brand } from '../theme'

export default function WhatsAppFab() {
  return (
    <ConfigProvider theme={{ token: { colorPrimary: brand.whatsapp } }}>
      <FloatButton
        href={site.whatsapp}
        target="_blank"
        aria-label="Chat with Durbanville Coordinator on WhatsApp"
        icon={<WhatsAppOutlined />}
        type="primary"
        className="shadow-pulse"
      />
    </ConfigProvider>
  )
}
