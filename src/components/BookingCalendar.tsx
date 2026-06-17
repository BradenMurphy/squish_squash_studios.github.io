import { useEffect, useMemo, useState } from 'react'
import { Calendar, Badge, Spin, Alert, Typography, Grid, Button } from 'antd'
import type { CalendarProps } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { fetchAvailability } from '../lib/availability'
import type { Availability } from '../data/booking'
import { site } from '../data/site'
import BookingModal from './BookingModal'

const { Title, Paragraph } = Typography
const { useBreakpoint } = Grid

export default function BookingCalendar() {
  const screens = useBreakpoint()
  const isMobile = !screens.md

  const [sessions, setSessions] = useState<Availability[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [value, setValue] = useState<Dayjs>(dayjs())
  const [selected, setSelected] = useState<Availability | null>(null)
  const [open, setOpen] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(false)
    try {
      const data = await fetchAvailability()
      setSessions(data)
      // Jump the calendar to the earliest upcoming session.
      const upcoming = [...data]
        .filter((s) => dayjs(s.date).isAfter(dayjs().subtract(1, 'day')))
        .sort((a, b) => a.date.localeCompare(b.date))[0]
      if (upcoming) setValue(dayjs(upcoming.date))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const byDate = useMemo(() => {
    const map: Record<string, Availability> = {}
    sessions.forEach((s) => {
      map[s.date] = s
    })
    return map
  }, [sessions])

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type !== 'date') return info.originNode
    const s = byDate[current.format('YYYY-MM-DD')]
    if (!s) return null
    const status = s.spotsLeft <= 0 ? 'error' : s.spotsLeft <= 3 ? 'warning' : 'success'
    const text = s.spotsLeft <= 0 ? 'Full' : `${s.spotsLeft} left`
    return <Badge status={status} text={text} />
  }

  const disabledDate = (current: Dayjs) => !byDate[current.format('YYYY-MM-DD')]

  const onSelect: CalendarProps<Dayjs>['onSelect'] = (date, selectInfo) => {
    setValue(date)
    if (selectInfo.source !== 'date') return
    const s = byDate[date.format('YYYY-MM-DD')]
    if (s) {
      setSelected(s)
      setOpen(true)
    }
  }

  return (
    <section id="calendar" className="section section--alt">
      <div className="container">
        <div className="section-header">
          <span className="subheading">Book a Date</span>
          <Title level={2} className="section-title">
            Pick a Day &amp; Reserve Your Spot
          </Title>
          <Paragraph className="section-desc">
            Highlighted days have a class — tap one to see how many spots are left and book your
            little one(s) in. Sibling discounts apply automatically.
          </Paragraph>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 48 }}>
            <Spin size="large" tip="Loading available dates…" />
          </div>
        )}

        {error && !loading && (
          <Alert
            type="warning"
            showIcon
            message="We couldn't load the live calendar right now."
            description={
              <span>
                Please try again, or message us on WhatsApp to book.{' '}
                <Button type="link" href={site.whatsapp} target="_blank" style={{ padding: 0 }}>
                  Open WhatsApp
                </Button>
              </span>
            }
            action={
              <Button size="small" onClick={load}>
                Retry
              </Button>
            }
          />
        )}

        {!loading && !error && (
          <div
            style={{
              background: '#fff',
              borderRadius: 24,
              padding: isMobile ? 8 : 24,
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08)',
              maxWidth: 900,
              margin: '0 auto',
            }}
          >
            <Calendar
              fullscreen={!isMobile}
              value={value}
              onSelect={onSelect}
              onPanelChange={(d) => setValue(d)}
              disabledDate={disabledDate}
              cellRender={cellRender}
            />
          </div>
        )}
      </div>

      <BookingModal
        session={selected}
        open={open}
        onClose={() => setOpen(false)}
        onBooked={load}
      />
    </section>
  )
}
