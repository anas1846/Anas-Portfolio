import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { canHover } from './Btn.jsx';

// Custom ring that follows the pointer and grows over links, buttons and cards
export default function Cursor() {
  const ring = useRef(null);

  useEffect(() => {
    if (!canHover()) return;
    const el = ring.current;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });
    const move = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      el.classList.add('on');
    };
    const over = (e) => el.classList.toggle('big', !!e.target.closest('a, summary, .card'));
    const leave = () => el.classList.remove('on');
    window.addEventListener('pointermove', move);
    document.addEventListener('pointerover', over);
    document.addEventListener('pointerleave', leave);
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerleave', leave);
    };
  }, []);

  return <div className="ring" ref={el => (ring.current = el)} aria-hidden="true" />;
}
