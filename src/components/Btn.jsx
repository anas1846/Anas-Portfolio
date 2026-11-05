import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const canHover = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Pill button that leans toward the cursor
export default function Btn({ href, solid, external = true, className = '', children }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!canHover()) return;
    const el = ref.current;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    const move = (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.22);
      yTo((e.clientY - r.top - r.height / 2) * 0.32);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  }, []);

  const ext = external && href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {};
  return (
    <a ref={ref} href={href} className={`btn ${solid ? 'solid' : ''} ${className}`} {...ext}>
      {children}
    </a>
  );
}
