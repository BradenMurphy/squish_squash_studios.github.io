import { useState } from 'react'
import { Layout, Button, Drawer, Menu, Grid } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import Logo from './Logo'
import { navItems } from '../data/site'

const { Header: AntHeader } = Layout
const { useBreakpoint } = Grid

function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const headerHeight = 72
  const top = el.getBoundingClientRect().top + window.scrollY - headerHeight
  window.scrollTo({ top, behavior: 'smooth' })
}

export default function Header() {
  const [open, setOpen] = useState(false)
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const handleNav = (id: string) => {
    setOpen(false)
    scrollTo(id)
  }

  return (
    <AntHeader
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        width: '100%',
        height: 72,
        padding: 0,
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
      }}
    >
      <div
        className="container"
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Logo />

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {navItems.map((item) => (
              <a
                key={item.key}
                onClick={() => handleNav(item.key)}
                style={{ cursor: 'pointer', fontWeight: 500 }}
              >
                {item.label}
              </a>
            ))}
            <Button type="primary" shape="round" onClick={() => handleNav('calendar')}>
              Book a Class
            </Button>
          </div>
        )}

        {isMobile && (
          <Button
            type="text"
            aria-label="Toggle menu"
            icon={<MenuOutlined style={{ fontSize: 22 }} />}
            onClick={() => setOpen(true)}
          />
        )}
      </div>

      <Drawer
        title={<Logo />}
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
      >
        <Menu
          mode="vertical"
          selectable={false}
          items={navItems.map((item) => ({
            key: item.key,
            label: item.label,
            onClick: () => handleNav(item.key),
          }))}
        />
      </Drawer>
    </AntHeader>
  )
}
