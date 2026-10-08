'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Menu, X, Plus, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { PhotoGallery } from '@/components/ui/gallery';
import ParallaxUnfurlingGallery from '@/components/ui/3d-parallax-unfurling-gallery';
import blurData from './blur-data.json';

const photos = [
  { key: 'forever', src: '/images/forever.webp', title: 'A little closer to forever', category: 'Weddings', alt: 'Bride and groom sharing a quiet moment beneath a sunlit red veil', blurDataURL: blurData.forever },
  { key: 'bride', src: '/images/bride.webp', title: 'Wrapped in tradition', category: 'Portraits', alt: 'Bride in a pink and gold sari with traditional wedding jewellery', blurDataURL: blurData.bride },
  { key: 'friends', src: '/images/friends.webp', title: 'Your people. Your happiness.', category: 'Weddings', alt: 'Two bridesmaids kissing a smiling bride on her cheeks', blurDataURL: blurData.friends },
  { key: 'monochrome', src: '/images/monochrome.webp', title: 'Just the two of you', category: 'Weddings', alt: 'Black and white portrait of a couple beside a tall window, with the bridal veil trailing across the floor', blurDataURL: blurData.monochrome },
  { key: 'celebration', src: '/images/celebration.webp', title: 'Love, in full celebration', category: 'Celebrations', alt: 'Wedding ceremony collage of a couple exchanging flower garlands', blurDataURL: blurData.celebration },
  { key: 'haldi', src: '/images/haldi.webp', title: 'A little sunshine', category: 'Celebrations', alt: 'Joyful bride in yellow celebrating her wedding festivities', blurDataURL: blurData.haldi },
  { key: 'groom', src: '/images/groom.webp', title: 'His moment, too', category: 'Portraits', alt: 'Editorial black and white portrait of a groom wearing sunglasses', blurDataURL: blurData.groom },
  { key: 'veil', src: '/images/veil.webp', title: 'Before the big moment', category: 'Portraits', alt: 'Close-up bridal portrait framed by an embroidered veil', blurDataURL: blurData.veil },
  { key: 'party', src: '/images/party.webp', title: 'All together, all heart', category: 'Celebrations', alt: 'Collage of newlyweds celebrating with their wedding party', blurDataURL: blurData.party },
  { key: 'tradition', src: '/images/tradition.webp', title: 'A story in gold', category: 'Portraits', alt: 'Collection of bridal portraits in a pink and gold sari', blurDataURL: blurData.tradition },
  { key: 'details', src: '/images/details.webp', title: 'The little details', category: 'Portraits', alt: 'Bridal jewellery and embroidered attire in a portrait collage', blurDataURL: blurData.details },
  { key: 'together', src: '/images/together.webp', title: 'A moment together', category: 'Weddings', alt: 'Couple portrait paired with close-up black and white photographs', blurDataURL: blurData.together },
  { key: 'gentleman', src: '/images/gentleman.webp', title: 'Dressed for the day', category: 'Portraits', alt: 'Editorial portrait of a seated groom against a red background', blurDataURL: blurData.gentleman },
  { key: 'vintage', src: '/images/vintage.webp', title: 'A timeless frame', category: 'Portraits', alt: 'Black and white groom portrait collection on a red background', blurDataURL: blurData.vintage },
  { key: 'bloom', src: '/images/bloom.webp', title: 'In bloom', category: 'Weddings', alt: 'Bridal portrait collection with a red bouquet and wedding details', blurDataURL: blurData.bloom },
  { key: 'architecture', src: '/images/architecture.webp', title: 'A beautiful beginning', category: 'Portraits', alt: 'Bride in red on the staircase of a white building in an editorial composition', blurDataURL: blurData.architecture },
  { key: 'sunshine', src: '/images/sunshine.webp', title: 'Joy in every frame', category: 'Celebrations', alt: 'Collection of joyful portraits of a bride celebrating in yellow', blurDataURL: blurData.sunshine },
];
const heroPhotos = [photos[1], photos[3], photos[0], photos[2], photos[5]];
const rawNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[\s()+-]/g, '') || '919037867720';
const whatsappNumber = /^[1-9]\d{7,14}$/.test(rawNumber) ? rawNumber : '';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState('All moments');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(el => { if (!reduced) el.classList.add('will-reveal'); observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (lightbox !== null) {
      if (!dialog.current?.open) dialog.current?.showModal();
      const previous = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = previous; };
    }
    dialog.current?.close();
  }, [lightbox]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [menuOpen]);

  function message() {
    const data = new FormData(form.current!);
    return `Hi Tied Moments! I'm ${data.get('name')}. I'd like to enquire about wedding photography.\nDate: ${data.get('date') || 'To be decided'}\nLocation: ${data.get('location') || 'To be decided'}\nPlease share your availability and packages.`;
  }

  const filtered = photos.filter(p => filter === 'All moments' || p.category === filter);
  const shown = filtered;

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="header">
      <a className="brand" href="#home" aria-label="Tied Moments home">
        <Image
          src="/logo.webp"
          alt="Tied Moments"
          width={124}
          height={91}
          preload={true}
          loading="eager"
          fetchPriority="high"
        />
      </a>
      <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Main navigation" id="main-navigation">
        {[['Work', 'work'], ['About', 'story'], ['Experience', 'experience']].map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
        <a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>Enquire</a>
      </nav>
      <button className="menu-toggle icon-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <main id="main">
      <section className="hero hero-photo-stack" id="home" aria-label="Wedding photography by Tied Moments">
        <PhotoGallery photos={heroPhotos} onPhotoSelect={photo => setLightbox(photos.findIndex(item => item.src === photo.src))}>
          <div className="hero-copy">
            <p className="eyebrow hero-enter">Wedding photography</p>
            <h1 className="hero-enter">Your day.<br /><span>As it felt.</span></h1>
            <p className="hero-description hero-enter">Honest moments. Beautifully kept.</p>
          </div>
        </PhotoGallery>
        <a href="#work" className="stack-scroll-cue">Selected moments</a>
      </section>

      <div className="facts"><p><strong>500+</strong> weddings captured</p><p>Available wherever you need us</p></div>

      <section id="story" className="story section-pad">
        <div className="story-visual reveal">
          <div className="story-image">
            <Image
              src="/images/monochrome.webp"
              alt={photos[3].alt}
              fill
              sizes="(max-width: 700px) 85vw, 42vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL={blurData.monochrome}
              quality={80}
            />
          </div>
          <div className="story-inset">
            <Image
              src="/images/friends.webp"
              alt={photos[2].alt}
              fill
              sizes="(max-width: 700px) 38vw, 18vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL={blurData.friends}
              quality={80}
            />
          </div>
          <span className="image-caption">The people. The feeling. The in-between.</span>
        </div>
        <div className="story-copy reveal">
          <p className="eyebrow">A little about Tied Moments</p>
          <h2>More than a day.<br /><span>A part of your story.</span></h2>
          <p>A wedding brings your favourite people into one place. We look for the connections between them — the proud smiles, the nervous excitement, the hands that hold yours.</p>
          <p>We're a photography team drawn to honest emotion and thoughtful images. With over 500 weddings captured, we make room for the moments that unfold naturally, alongside portraits you'll want to keep close.</p>
          <div className="story-facts"><div><strong>500+</strong><span>Weddings captured</span></div><div><strong>Anywhere</strong><span>Wherever you need us</span></div></div>
          <a className="text-button" href="#contact">Meet us over a conversation</a>
        </div>
      </section>

      <section id="experience" className="offerings section-pad">
        <div className="offerings-heading reveal"><div><p className="eyebrow">What we capture</p><h2>Every part of your celebration.</h2></div><p>From the first gathering<br />to the moments just for you.</p></div>
        <div className="offering-grid">
          {[
            { image: photos[0], title: 'The wedding day', detail: 'The vows, the rituals, and all the little things happening around them.' },
            { image: photos[7], title: 'The portraits', detail: 'A little direction. Room to be yourself. Photographs that feel like you.' },
            { image: photos[5], title: 'The celebrations', detail: 'The colour, the laughter, and the people who make it unforgettable.' },
          ].map((item, index) => (
            <article className="offering reveal" key={item.title}>
              <div className="offering-image">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  sizes="(max-width: 600px) 90vw, 30vw"
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={item.image.blurDataURL}
                  quality={80}
                />
              </div>
              <div className="offering-title">
                <span>0{index + 1}</span>
                <h3>{item.title}</h3>
              </div>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="work" className="work section-pad">
        <div className="section-heading reveal"><h2>Selected work</h2><span>{photos.length} photographs</span></div>
        <div className="reveal my-8">
          <ParallaxUnfurlingGallery
            images={photos.map(p => p.src)}
            isStandalone={false}
            onPhotoClick={(src) => {
              const idx = photos.findIndex(p => p.src === src);
              if (idx !== -1) setLightbox(idx);
            }}
          />
        </div>
        <div className="filters" role="group" aria-label="Filter photographs">{['All moments', 'Weddings', 'Portraits', 'Celebrations'].map(category => <button key={category} className={filter === category ? 'active' : ''} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}{category === 'All moments' && <span>{photos.length}</span>}</button>)}</div>
        <div className="gallery">
          {shown.map(photo => (
            <button key={photo.src} className="gallery-card" onClick={() => setLightbox(photos.indexOf(photo))} aria-label={`View ${photo.title}`}>
              <div className="photo-wrap">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 600px) 33vw, (max-width: 1000px) 25vw, 18vw"
                  loading="lazy"
                  decoding="async"
                  placeholder="blur"
                  blurDataURL={photo.blurDataURL}
                  quality={80}
                />
                <span className="photo-open"><Plus size={22} strokeWidth={1} /></span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section id="process" className="process section-pad">
        <div className="process-heading reveal"><p className="eyebrow">The experience</p><h2>Simple from<br />the first hello.</h2><a className="text-button" href="#contact">Start a conversation</a></div>
        <ol className="process-steps">
          <li className="reveal"><span>01</span><div><h3>Tell us your plans</h3><p>Share your date, location, and the kind of celebration you have in mind.</p></div></li>
          <li className="reveal"><span>02</span><div><h3>Make room for what matters</h3><p>Talk through your events, favourite people, and the photographs you don't want to miss.</p></div></li>
          <li className="reveal"><span>03</span><div><h3>Be there, fully</h3><p>Enjoy your people and your day. We'll be watching for the moments worth keeping.</p></div></li>
        </ol>
      </section>

      <section className="travel-note section-pad reveal" aria-label="Travel availability"><p className="eyebrow">Near or far</p><h2>Your place.<br /><span>Our next story.</span></h2><div><p>A celebration close to home or somewhere new. We're available wherever you need us.</p><a className="text-button" href="#contact">Tell us where</a></div></section>

      <section id="questions" className="questions section-pad">
        <div className="reveal"><p className="eyebrow">Before we begin</p><h2>A few things<br />you might wonder.</h2></div>
        <div className="faq-list reveal">
          {[
            ['Do you travel for weddings?', 'Yes. We are available wherever you need us. Share your venue and event dates so we can discuss the travel arrangements with you.'],
            ['How do we check your availability?', 'Send your wedding date and location through the WhatsApp form below. We can then discuss availability and the coverage you need.'],
            ['Can we include events beyond the wedding day?', 'Tell us about your pre-wedding celebrations, couple portraits, and other events. We can discuss the coverage for each part of your celebration.'],
            ['What if we feel awkward in front of the camera?', 'You do not need to know how to pose. Our approach leaves room for natural moments, with gentle direction for portraits.'],
          ].map(([question, answer]) => <details key={question}><summary>{question}<Plus size={18} aria-hidden="true" /></summary><p>{answer}</p></details>)}
        </div>
      </section>

      <section id="contact" className="contact section-pad"><div className="contact-copy reveal"><p className="eyebrow">Let's talk</p><h2>Tell us about<br />your day.</h2><a className="phone" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer">+91 90378 67720</a></div>
        <form className="enquiry-form reveal" ref={form} onSubmit={e => { e.preventDefault(); if (whatsappNumber) window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message())}`, '_blank', 'noopener,noreferrer'); }}>
          <label>Your name<input name="name" placeholder="Name" autoComplete="name" required maxLength={100} /></label>
          <div className="form-grid"><label>Wedding date<input type="date" name="date" /></label><label>Location<input name="location" placeholder="City or venue" maxLength={180} /></label></div>
          <button type="submit" className="button button-dark whatsapp-submit"><MessageCircle size={18} />Enquire on WhatsApp</button>
          <p className="form-note">Opens WhatsApp. Send when you're ready.</p>
        </form>
      </section>
    </main>

    <footer className="footer">
      <a href="#home" aria-label="Tied Moments home">
        <Image
          src="/logo.webp"
          width={100}
          height={76}
          alt="Tied Moments"
          loading="lazy"
        />
      </a>
      <span>© {new Date().getFullYear()} Tied Moments</span>
      <a href="#home">Back to top</a>
    </footer>
    <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hi Tied Moments! I would love to enquire about wedding photography.')}`} target="_blank" rel="noopener noreferrer" className="floating-contact" aria-label="Chat on WhatsApp"><MessageCircle size={23} strokeWidth={1.6} /></a>

    <dialog className="lightbox" ref={dialog} onCancel={() => setLightbox(null)} onClose={() => setLightbox(null)} onClick={e => { if (e.target === e.currentTarget) setLightbox(null); }} onKeyDown={e => { if (lightbox === null) return; if (e.key === 'ArrowRight') setLightbox((lightbox + 1) % photos.length); if (e.key === 'ArrowLeft') setLightbox((lightbox + photos.length - 1) % photos.length); }} aria-label="Photo gallery viewer">
      {lightbox !== null && <>
        <button autoFocus className="lightbox-close icon-button" aria-label="Close photo viewer" onClick={() => setLightbox(null)}><X /></button>
        <button className="lightbox-prev icon-button" aria-label="Previous photograph" onClick={() => setLightbox((lightbox + photos.length - 1) % photos.length)}><ChevronLeft /></button>
        <figure>
          <div className="lightbox-image">
            <Image
              src={photos[lightbox].src}
              alt={photos[lightbox].alt}
              fill
              sizes="90vw"
              loading="eager"
              placeholder="blur"
              blurDataURL={photos[lightbox].blurDataURL}
            />
          </div>
          <figcaption>{photos[lightbox].title}<span>{lightbox + 1} / {photos.length}</span></figcaption>
        </figure>
        <button className="lightbox-next icon-button" aria-label="Next photograph" onClick={() => setLightbox((lightbox + 1) % photos.length)}><ChevronRight /></button>
      </>}
    </dialog>
  </>;
}
