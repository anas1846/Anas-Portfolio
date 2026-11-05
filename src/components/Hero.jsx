import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import Btn, { canHover } from './Btn.jsx';
import { projects } from '../data.js';

export default function Hero({ ready }) {
  const root = useRef(null);
  const tilt = useRef(null);

  // Hide the hero before first paint (the preloader covers it anyway)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.rv > span', { yPercent: 110 });
      gsap.set('.fade', { autoAlpha: 0, y: 18 });
    }, root);
    return () => ctx.revert();
  }, []);

  // Intro plays when the preloader starts to leave
  useEffect(() => {
    if (!ready) return;
    const ctx = gsap.context(() => {
      gsap.to('.rv > span', { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09 });
      gsap.to('.fade', { autoAlpha: 1, y: 0, duration: 0.95, ease: 'expo.out', stagger: 0.1, delay: 0.2 });
    }, root);
    return () => ctx.revert();
  }, [ready]);

  // Card plane tilts with the cursor
  useEffect(() => {
    if (!canHover()) return;
    const move = (e) =>
      gsap.to(tilt.current, {
        '--px': ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3),
        '--py': ((e.clientY / window.innerHeight - 0.5) * 2).toFixed(3),
        duration: 0.7,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);

  return (
    <section className="hero wrap" id="home" ref={root}>
      <div className="hero-grid">
        <div>
          <span className="tag fade">Open to new projects</span>
          <h1>
            <span className="rv"><span>Muhammad Anas</span></span>
            <span className="rv"><span className="lt">Web Developer</span></span>
          </h1>
          <p className="lead fade">
            I build websites for startups and SaaS founders in Webflow when speed and easy editing
            matter, and in React, Node.js and MySQL when the product needs more control.
          </p>
          <div className="btns fade">
            <Btn href="#work">See my work</Btn>
            <Btn href="#contact" solid>Contact now</Btn>
          </div>
        </div>

        <div className="stage fade">
          <div className="float f1">
            Webflow or custom code?<small>I'll tell you which one fits.</small>
          </div>
          <div className="tilt" ref={tilt}>
            {projects.map((p) => (
              <a key={p.id} className="card" href={p.url} target="_blank" rel="noreferrer">
                <img src={p.img} alt={`${p.name} website`} />
                <div className="meta">
                  <span><b>{p.cardName}</b> &middot; {p.cardMeta}</span>
                  <span className="go">&#8599;</span>
                </div>
              </a>
            ))}
          </div>
          <div className="float f2">
            Admin panels<small>Your team edits content without a developer.</small>
          </div>
        </div>
      </div>
    </section>
  );
}
