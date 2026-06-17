import type { ReactNode } from 'react'
import { createElement, Fragment } from 'react'

export interface Faq {
  question: string
  answer: ReactNode
}

export const faqs: Faq[] = [
  {
    question: 'What should my child (and I) wear to a session?',
    answer:
      "We recommend wearing old clothes that you don't mind getting paint or food coloring on. While we provide high-coverage, toddler-sized protective aprons, sensory play is a full-body sport! Bringing a spare change of clothes and a small towel for the wash station is highly recommended.",
  },
  {
    question: 'Are the play materials safe if my child puts them in their mouth?',
    answer:
      "Yes, absolutely! The safety of your little ones is our top priority. All sensory bins, rainbow spaghetti, jellies, and play doughs are made with 100% non-toxic, edible-safe, and food-grade kitchen ingredients. While we don't encourage eating them as a snack, they are fully taste-safe!",
  },
  {
    question: 'What age groups are these classes suitable for?',
    answer: createElement(Fragment, null, [
      'Our studio has curated setups for child milestones:',
      createElement('br', { key: 'b1' }),
      createElement('strong', { key: 's1' }, '• Sensory Babies:'),
      ' 6 to 18 months (focus on soft lights, water exploration, edible slimes, texture exploration).',
      createElement('br', { key: 'b2' }),
      createElement('strong', { key: 's2' }, '• Squish Squash Toddlers:'),
      ' 18 months to 4 years (more advanced pouring, stacking, matching, painting, shaving foam).',
      createElement('br', { key: 'b3' }),
      createElement('strong', { key: 's3' }, '• Family Messy Play:'),
      ' 6 months to 6 years (great for siblings to play and explore together).',
    ]),
  },
  {
    question: 'How does booking and payment work?',
    answer:
      'Booking is simple! You can fill out our static form below, which automatically goes to our inbox, or hit the floating WhatsApp button to chat directly with our Durbanville coordinator. Payments can be done via EFT or SnapScan before the session begins to secure your spot.',
  },
  {
    question: 'What if my child has allergies?',
    answer:
      'We are completely allergy-aware! When you fill out the booking form, there is a dedicated field to list any dietary requirements or skin allergies (like gluten, dairy, or egg sensitivity). We customize the play bins specifically for sessions with allergy requests to keep every toddler safe.',
  },
]
