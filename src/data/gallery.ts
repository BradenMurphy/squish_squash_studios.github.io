export interface GalleryPhoto {
  src: string
  alt: string
  hover: string
}

export const gallery: GalleryPhoto[] = [
  {
    src: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80',
    alt: 'Toddler hands completely covered in vibrant yellow and green paint',
    hover: '🔍 View Splat',
  },
  {
    src: 'https://images.unsplash.com/photo-1560421683-6856ea585c78?auto=format&fit=crop&w=800&q=80',
    alt: 'Children creating sensory arts and crafts at bright play tables',
    hover: '🔍 View Craft',
  },
  {
    src: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80',
    alt: 'Beautiful detailed abstract sensory swirls of foam and paint colors',
    hover: '🔍 View Swirls',
  },
  {
    src: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80',
    alt: 'Toddler hands squishing and shaping colorful organic sensory dough',
    hover: '🔍 View Dough',
  },
]
