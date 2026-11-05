import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Counts 000 → 100, then slides up. onDone fires as the slide starts so the hero can begin.
export default function Preloader({ onDone }) {
  const root = useRef(null);
  const num = useRef(null);
  const fill = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dur = reduce ? 0.2 : 1.5;
    const o = { v: 0 };
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .to(o, {
          v: 100,
          duration: dur,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (num.current) num.current.textContent = String(Math.round(o.v)).padStart(3, '0');
          },
        })
        .to(fill.current, { scaleX: 1, duration: dur, ease: 'power2.inOut' }, 0)
        .add(() => onDone(), '+=0.1')
        .to(root.current, { yPercent: -100, duration: reduce ? 0.2 : 0.9, ease: 'expo.inOut' }, '<')
        .set(root.current, { display: 'none' });
    }, root);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="pre" ref={root} aria-hidden="true">
      <div>
        <b ref={num}>000</b>
        <span>Muhammad Anas &middot; Portfolio</span>
        <i>
          <u ref={fill} />
        </i>
      </div>
    </div>
  );
}
