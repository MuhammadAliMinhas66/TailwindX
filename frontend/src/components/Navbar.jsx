import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
  const circleRefs = useRef([]);
  const tlRefs = useRef([]);
  const activeTweenRefs = useRef([]);
  const hamburgerRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Components', href: '/components' },
    { label: 'Templates', href: '/templates' }
  ];

  const ease = 'power3.out';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const layout = () => {
      circleRefs.current.forEach((circle, index) => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector('.pill-label');
        const white = pill.querySelector('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        tl.to(circle, { scale: 1.2, xPercent: -50, duration: 2, ease, overwrite: 'auto' }, 0);

        if (label) {
          tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();
    window.addEventListener('resize', layout);

    if (mobileMenuRef.current) {
      gsap.set(mobileMenuRef.current, { visibility: 'hidden', opacity: 0 });
    }

    return () => window.removeEventListener('resize', layout);
  }, []);

  const handleEnter = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLeave = (i) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      if (newState) {
        gsap.to(lines[0], { rotation: 45, y: 3, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: -45, y: -3, duration: 0.3, ease });
      } else {
        gsap.to(lines[0], { rotation: 0, y: 0, duration: 0.3, ease });
        gsap.to(lines[1], { rotation: 0, y: 0, duration: 0.3, ease });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        gsap.fromTo(
          menu,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.3, ease }
        );
      } else {
        gsap.to(menu, {
          opacity: 0,
          y: 10,
          duration: 0.2,
          ease,
          onComplete: () => gsap.set(menu, { visibility: 'hidden' })
        });
      }
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50 shadow-lg shadow-black/20' 
          : 'bg-gray-950/50 backdrop-blur-md border-b border-gray-800/30'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          <Link 
            to="/" 
            className="text-2xl font-bold text-white tracking-tight hover:text-gray-200 transition"
          >
            TailwindX
          </Link>
          
          <div className="hidden md:flex items-center h-12 bg-white/95 backdrop-blur-sm rounded-full shadow-lg shadow-black/10">
            <ul className="flex items-stretch m-0 p-1 h-full gap-1">
              {navItems.map((item, i) => {
                const active = isActive(item.href);
                
                return (
                  <li key={item.href} className="flex h-full">
                    <Link
                      to={item.href}
                      className="relative overflow-hidden inline-flex items-center justify-center h-full px-6 rounded-full bg-gray-950 text-white font-semibold text-sm uppercase tracking-wide"
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      <span
                        className="absolute left-1/2 bottom-0 rounded-full bg-white pointer-events-none"
                        ref={el => circleRefs.current[i] = el}
                      />
                      
                      <span className="relative inline-block z-10">
                        <span className="pill-label relative inline-block">
                          {item.label}
                        </span>
                        <span className="pill-label-hover absolute left-0 top-0 text-gray-950">
                          {item.label}
                        </span>
                      </span>
                      
                      {active && (
                        <span className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-3 h-3 rounded-full bg-white shadow-lg" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/admin"
              className="hidden md:block px-5 py-2.5 bg-white/95 backdrop-blur-sm text-gray-950 rounded-lg hover:bg-white transition font-medium shadow-lg shadow-black/10"
            >
              Admin
            </Link>
            
            <button
              ref={hamburgerRef}
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-400 hover:text-white transition"
            >
              <span className="hamburger-line block w-5 h-0.5 bg-white rounded mb-1" />
              <span className="hamburger-line block w-5 h-0.5 bg-white rounded" />
            </button>
          </div>
        </div>
        
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden py-4 border-t border-gray-800/30"
          >
            <Link
              to="/"
              className="block py-3 text-gray-400 hover:text-white transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/components"
              className="block py-3 text-gray-400 hover:text-white transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Components
            </Link>
            <Link
              to="/templates"
              className="block py-3 text-gray-400 hover:text-white transition"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Templates
            </Link>
            <Link
              to="/admin"
              className="block py-3 text-white font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;