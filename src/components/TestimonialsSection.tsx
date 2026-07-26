'use client';

import { TestimonialsColumn, type Testimonial } from '@/components/ui/testimonials-columns-1';

const LIMESTONE = '#f4f2f0';
const OBSIDIAN = '#0c0a08';
const FOG = '#999ba3';

const testimonials: Testimonial[] = [
  {
    text: 'The turf feels excellent and the lighting makes evening matches incredibly clear. Our weekly team booking has never been easier.',
    image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=160&q=80',
    name: 'Rizky Pratama',
    role: 'BIG FC',
  },
  {
    text: 'Booking online was simple, and the payment status was easy to track. The whole process felt organized from start to finish.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    name: 'Nadia Putri',
    role: 'Depok United FC',
  },
  {
    text: 'A great venue for night football. The field is well maintained, the lights are bright, and there is enough space for our supporters.',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=80',
    name: 'Fajar Maulana',
    role: 'Southside Football Club',
  },
  {
    text: 'We hosted a friendly tournament here and everything ran smoothly. The facilities made the match day feel much more professional.',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
    name: 'Alya Ramadhani',
    role: 'Kickoff Community',
  },
  {
    text: 'The online schedule is genuinely useful. We can find an available slot and secure it without having to message back and forth.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
    name: 'Dimas Saputra',
    role: 'Cilandak All Stars',
  },
  {
    text: 'Clean facilities, comfortable seating, and a quality pitch. HAM Stadium has become our team’s preferred place to play.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
    name: 'Salsa Aulia',
    role: 'Muda Berlari FC',
  },
  {
    text: 'The stadium has a premium feel without making booking complicated. It is ideal for both casual games and competitive matches.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=160&q=80',
    name: 'Kevin Wijaya',
    role: 'Sunday League Jakarta',
  },
  {
    text: 'Our group loved the evening session. The LED lighting and synthetic turf gave us a consistent, enjoyable playing experience.',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=80',
    name: 'Citra Lestari',
    role: 'Garuda Football Community',
  },
  {
    text: 'From booking to match day, everything was straightforward. It is a reliable place to bring friends, colleagues, and family.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
    name: 'Arif Hidayat',
    role: 'Weekend Warriors FC',
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const fadeMask = {
  WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)',
  maskImage: 'linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)',
} as const;

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="px-6 py-20 lg:py-24 border-t border-[#d2cecb]/20" style={{ backgroundColor: LIMESTONE }}>
      <div className="mx-auto max-w-[1200px]">
        <div className="scroll-reveal">
          <span
            className="inline-flex items-center gap-2.5 text-[13px] font-medium uppercase tracking-[0.02em]"
            style={{ color: '#4d505d' }}
          >
            <span className="inline-block h-[7px] w-[7px]" style={{ backgroundColor: '#e4f222' }} />
            PLAYER STORIES
          </span>
        </div>
        <h2
          className="scroll-reveal mt-5 max-w-2xl text-balance text-[34px] font-normal leading-[1.1] tracking-tight sm:text-[44px]"
          style={{ color: OBSIDIAN, animationDelay: '90ms' }}
        >
          Loved by teams who play at HAM Stadium
        </h2>
        <p
          className="scroll-reveal mt-4 max-w-xl text-pretty text-[17px] leading-relaxed"
          style={{ color: FOG, animationDelay: '180ms' }}
        >
          From casual weekly matches to organized tournaments, see why players choose HAM Stadium for match day.
        </p>

        <div
          className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          style={fadeMask}
        >
          <TestimonialsColumn
            testimonials={firstColumn}
            duration={18}
            className="h-[560px] overflow-hidden"
          />
          <div className="hidden h-[560px] overflow-hidden md:block">
            <TestimonialsColumn testimonials={secondColumn} duration={24} />
          </div>
          <div className="hidden h-[560px] overflow-hidden lg:block">
            <TestimonialsColumn testimonials={thirdColumn} duration={30} />
          </div>
        </div>
      </div>
    </section>
  );
}
