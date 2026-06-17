import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Classes from './components/Classes'
import BookingCalendar from './components/BookingCalendar'
import Gallery from './components/Gallery'
import Faq from './components/Faq'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppFab from './components/WhatsAppFab'

export default function App() {
  return (
    <>
      <div className="blob-bg blob-1" />
      <div className="blob-bg blob-2" />
      <div className="blob-bg blob-3" />

      <Header />
      <main>
        <Hero />
        <About />
        <Classes />
        <BookingCalendar />
        <Gallery />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
