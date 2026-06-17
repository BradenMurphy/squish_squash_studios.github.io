import dayjs from 'dayjs'
import { site } from '../data/site'
import type { Availability } from '../data/booking'

export interface BookingMessage {
  session: Availability
  parentName: string
  phone: string
  childrenSummary: string // e.g. "Leo (2, sibling) - R200; Mia (4) - R200"
  total: number
  allergies?: string
}

/** Build a pre-filled wa.me link summarising the booking for the studio. */
export function buildBookingWhatsAppLink(b: BookingMessage): string {
  const dateLabel = dayjs(b.session.date).format('ddd D MMM YYYY')
  const lines = [
    'Hi Squish Squash Studios! 🎨 Booking request:',
    `Date: ${dateLabel} — ${b.session.className} (${b.session.time})`,
    `Parent: ${b.parentName}  |  WhatsApp: ${b.phone}`,
    `Children: ${b.childrenSummary}`,
  ]
  if (b.allergies?.trim()) lines.push(`Allergies: ${b.allergies.trim()}`)
  lines.push(`Estimated total: R${b.total}`)
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`
}
