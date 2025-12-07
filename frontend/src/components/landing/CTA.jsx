import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LightRays from '../LightRays';

gsap.registerPlugin(ScrollTrigger);

function CTA() {
  const headingRef = useRef(null);

  useEffect(() => {
    if (!headingRef.current) return;

    const chars = headingRef.current.textContent.split('');
    headingRef.current.innerHTML = '';
    
    chars.forEach((char, i) => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.className = 'inline-block';
      headingRef.current.appendChild(span);
    });

    const spans = headingRef.current.querySelectorAll('span');

    gsap.fromTo(
      spans,
      { 
        opacity: 0,
        y: 50,
        rotationX: -90
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none'
        }
      }
    );

    spans.forEach(span => {
      span.addEventListener('mouseenter', () => {
        gsap.to(span, {
          scale: 1.2,
          color: '#60a5fa',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      span.addEventListener('mouseleave', () => {
        gsap.to(span, {
          scale: 1,
          color: '#ffffff',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });

  }, []);

  return (
    <section className="py-32 bg-gray-950 border-b border-gray-800 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <LightRays
          raysOrigin="bottom-center"
          raysColor="#3b82f6"
          raysSpeed={0.5}
          lightSpread={0.8}
          rayLength={1.5}
          pulsating={true}
          fadeDistance={0.8}
          saturation={0.7}
          followMouse={true}
          mouseInfluence={0.2}
          noiseAmount={0.1}
          distortion={0.3}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          <h2
            ref={headingRef}
            className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight"
            style={{ perspective: '1000px' }}
          >
            Ready When You Are
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 font-light">
            Start building professional interfaces without the hassle.
          </p>
          
          
           <a href="/components"
            className="inline-block px-12 py-6 bg-white text-gray-950 rounded-xl hover:bg-gray-100 transition text-xl font-semibold"
          >
            Explore Library
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTA;