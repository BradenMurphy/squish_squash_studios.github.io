import { BOOKING_API_URL } from '../data/booking'
import type { Availability, BookingPayload, PostResult } from '../data/booking'

/** Fetch live availability for every published session. */
export async function fetchAvailability(): Promise<Availability[]> {
  const res = await fetch(BOOKING_API_URL, { method: 'GET' })
  const json = await res.json()
  if (!json?.ok) throw new Error('Could not load availability')
  return json.sessions as Availability[]
}

/**
 * Create a booking. POSTed as text/plain so the browser skips the CORS
 * preflight that Apps Script doesn't answer. The server re-checks capacity.
 */
export async function postBooking(payload: BookingPayload): Promise<PostResult> {
  const res = await fetch(BOOKING_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  })
  return (await res.json()) as PostResult
}
