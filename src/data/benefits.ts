import { brand } from '../theme'

export interface Benefit {
  icon: string
  title: string
  desc: string
  image: string
  color: string
}

export const benefits: Benefit[] = [
  {
    icon: '💪',
    title: 'Fine & Gross Motor Skills',
    desc: 'Squeezing soft clay, scooping slippery rice, and pouring water build finger strength, grip coordination, and overall physical agility.',
    image:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=400&h=300&q=80',
    color: brand.pink,
  },
  {
    icon: '🧠',
    title: 'Cognitive & Language Growth',
    desc: 'Children naturally categorize shapes, experiment with cause-and-effect, and discover descriptive new words like "slimey", "sticky", and "crunchy".',
    image:
      'https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=400&h=300&q=80',
    color: brand.turquoise,
  },
  {
    icon: '🤝',
    title: 'Social & Emotional Well-being',
    desc: 'Our sessions build sensory resilience, reduce tactile sensitivity, and offer a cooperative, stress-free zone for children and parents to connect.',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&h=300&q=80',
    color: brand.orange,
  },
]

export interface Commitment {
  icon: string
  color: string
  title: string
  desc: string
}

export const commitments: Commitment[] = [
  {
    icon: '✓',
    color: brand.green,
    title: 'Edible-Safe Materials',
    desc: 'Non-toxic, organic, and toddler-proof ingredients only.',
  },
  {
    icon: '✓',
    color: brand.purple,
    title: 'Aprons Provided',
    desc: 'Full protective aprons for child & parent included.',
  },
  {
    icon: '✓',
    color: brand.pink,
    title: 'Stress-Free Cleanup',
    desc: 'We handle the big mess. Simply wash up and leave!',
  },
]
