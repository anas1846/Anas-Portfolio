import { Component, Suspense, lazy, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Preloader from './components/Preloader.jsx';
import Nav from './components/Nav.jsx';
import Cursor from './components/Cursor.jsx';
import Hero from './components/Hero.jsx';
import Work from './components/Work.jsx';
import { Marquee, About, Process, Services, Faq, Contact, Footer } from './components/Sections.jsx';

// three.js is large, so the 3D scene loads after the page has painted
const Scene = lazy(() => import('./components/Scene.jsx'));

gsap.registerPlugin(ScrollTrigger);

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

// If the 3D scene ever throws, the site still works on a plain graphite background
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    document.body.classList.add('no-gl');
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [gl] = useState(hasWebGL);
  const lenis = useRef(null);
  const bar = useRef(null);

  const finishLoading = useCallback(() => setReady(true), []);

  // Smooth scroll, wired to GSAP's ticker so ScrollTrigger stays in sync
  useEffect(() => {
    if (reduceMotion()) return;
    const l = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9 });
    lenis.current = l;
    l.stop();
    l.on('scroll', ScrollTrigger.update);
    const tick = (t) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href').length < 2) return;
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      l.scrollTo(target, { duration: 1.4 });
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      gsap.ticker.remove(tick);
      l.destroy();
      lenis.current = null;
    };
  }, []);

  // Unlock scrolling once the preloader leaves (with a safety net so it can never stay stuck)
  useEffect(() => {
    const unlock = () => {
      document.documentElement.classList.remove('loading');
      lenis.current?.start();
    };
    if (ready) unlock();
    const t = setTimeout(() => {
      setReady(true);
      unlock();
    }, 4500);
    return () => clearTimeout(t);
  }, [ready]);

  // Scroll reveals: sections start faint and rise in as they enter the viewport
  useLayoutEffect(() => {
    if (reduceMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set('.reveal', { opacity: 0.14, y: 36 });
      ScrollTrigger.batch('.reveal', {
        start: 'top 92%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.09,
            overwrite: true,
            clearProps: 'transform',
          }),
      });
    });
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    return () => {
      window.removeEventListener('load', refresh);
      ctx.revert();
    };
  }, []);

  // Progress bar + pointer spotlight on glass panels
  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      gsap.set(bar.current, { scaleX: window.scrollY / max });
    };
    const onMove = (e) => {
      const el = e.target.closest?.('.glass');
      if (!el) return;
      const b = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - b.left}px`);
      el.style.setProperty('--my', `${e.clientY - b.top}px`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointermove', onMove);
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointermove', onMove);
    };
  }, []);

  return (
    <div className={gl ? '' : 'no-gl'}>
      {gl && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </SceneBoundary>
      )}
      <div className="bar" ref={bar} />
      <Cursor />
      <Preloader onDone={finishLoading} />
      <Nav />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <About />
        <Work />
        <Process />
        <Services />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
