import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Btn, { canHover } from './Btn.jsx';
import { projects } from '../data.js';

export default function Work() {
  const peek = useRef(null);
  const peekImg = useRef(null);

  // Screenshot that trails the cursor while hovering a project row
  useEffect(() => {
    if (!canHover()) return;
    const el = peek.current;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3' });
    const rTo = gsap.quickTo(el, 'rotation', { duration: 0.5, ease: 'power3' });
    let reset;
    const move = (e) => {
      xTo(e.clientX + 28);
      yTo(e.clientY - 70);
      rTo(gsap.utils.clamp(-7, 7, e.movementX * 0.4));
      clearTimeout(reset);
      reset = setTimeout(() => rTo(0), 90);
    };
    window.addEventListener('pointermove', move);
    return () => {
      clearTimeout(reset);
      window.removeEventListener('pointermove', move);
    };
  }, []);

  const show = (img) => {
    if (!peek.current) return;
    peekImg.current.src = img;
    peek.current.classList.add('on');
  };
  const hide = () => peek.current && peek.current.classList.remove('on');

  return (
    <section className="s wrap" id="work">
      <div className="head reveal">
        <span className="tag">Selected work</span>
        <h2>Things I've <span>built</span></h2>
        <p className="lead">Open a project to see what it does and what sits behind it.</p>
      </div>

      <div className="works reveal">
        {projects.map((p) => (
          <details className="row" key={p.id}>
            <summary onPointerEnter={() => show(p.img)} onPointerLeave={hide}>
              <span className="nm">{p.name}</span>
              <span className="ty">{p.type}</span>
              <span className="tg">{p.tags}</span>
              <span className="pl">+</span>
            </summary>
            <div className="more">
              <span />
              <ul>
                {p.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
              <Btn className="visit" href={p.url}>{p.cta} &#8599;</Btn>
            </div>
          </details>
        ))}
      </div>

      <div className="peek" ref={peek} aria-hidden="true">
        <img ref={peekImg} alt="" />
      </div>
    </section>
  );
}
