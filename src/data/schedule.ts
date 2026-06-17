export interface ScheduleRow {
  key: string
  day: string
  className: string
  ageGroup: string
  time: string
  price: string
  accent: string
}

export const schedule: ScheduleRow[] = [
  {
    key: 'wed',
    day: 'Wednesday',
    className: 'Squish Squash Messy Play 🎨',
    ageGroup: 'All ages up to 5',
    time: '02:00 PM - 04:00 PM',
    price: 'R200 / child',
    accent: 'hsl(330, 90%, 95%)',
  },
  {
    key: 'sat',
    day: 'Saturday',
    className: 'Family Messy Fun 🎉',
    ageGroup: 'All ages up to 5',
    time: '09:00 AM - 11:00 AM',
    price: 'R200 / child',
    accent: 'hsl(25, 95%, 94%)',
  },
]

export const sessionOptions = [
  { value: 'Messy Play (Wed 14:00)', label: 'Messy Play (Wednesday 14:00 - 16:00)' },
  { value: 'Family Messy Fun (Sat 09:00)', label: 'Family Messy Fun (Saturday 09:00 - 11:00)' },
]
