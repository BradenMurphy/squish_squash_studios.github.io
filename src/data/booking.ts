// Google Apps Script Web App URL (see docs/APPS_SCRIPT_SETUP.md).
// Not a secret — safe to ship in the front-end.
export const BOOKING_API_URL =
  'https://script.google.com/macros/s/AKfycbyj1UzclH9hda4TP5oFfL6e6cKNEuUYSXp1NzDAm5zFGMU5i4cGVzUoINjfjE0vtwBJ/exec'

/** A class on a specific date, with live availability. */
export interface Availability {
  date: string // 'YYYY-MM-DD'
  className: string
  time: string
  capacity: number
  booked: number
  spotsLeft: number
  notes: string
}

/** One child in a booking. */
export interface ChildEntry {
  name: string
  age: string
  sibling: boolean
}

/** Payload POSTed to the Apps Script. */
export interface BookingPayload {
  session_date: string
  parent_name: string
  phone: string
  children: string // human-readable summary line
  num_children: number
  total: string
  allergies?: string
  company?: string // honeypot — must stay empty
}

export interface PostResult {
  ok: boolean
  reason?: 'full' | 'invalid' | 'no_session' | 'spam' | 'error'
  spotsLeft?: number
  message?: string
}
