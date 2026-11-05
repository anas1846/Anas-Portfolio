import Btn from './Btn.jsx';
import { stack, skills, steps, options, faq, contact } from '../data.js';

export function Marquee() {
  const items = [...stack, ...stack];
  return (
    <div className="marq" aria-label="Technologies I work with">
      <div className="tr">
        {items.map((s, i) => <span key={i}>{s}</span>)}
      </div>
    </div>
  );
}

export function About() {
  return (
    <section className="s wrap" id="about">
      <div className="head reveal">
        <span className="tag">About</span>
        <h2>Who am I<span>?</span></h2>
      </div>
      <div className="about">
        <div className="glass photo reveal">
          <img src="/images/anas-profile.jpg" alt="Muhammad Anas" />
        </div>
        <div className="glass txt reveal">
          <h3>Hey, I'm Anas <span>from Lahore.</span></h3>
          <p>
            A startup website has one job: make it obvious what you do and what to do next. I build
            marketing sites, redesigns and web platforms with an admin panel, and I choose the tool
            that fits the project instead of pushing the only one I know.
          </p>
          <ul className="skills">
            {skills.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section className="s wrap" id="process">
      <div className="head reveal">
        <span className="tag">Process</span>
        <h2>How a project <span>runs</span></h2>
        <p className="lead">Four steps, in this order, so nothing gets built before it is understood.</p>
      </div>
      <div className="steps">
        {steps.map((s, i) => (
          <div className="glass step reveal" key={s.t}>
            <span className="n">Step {i + 1}</span>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Services() {
  return (
    <section className="s wrap" id="tools">
      <div className="head reveal">
        <span className="tag">Services</span>
        <h2>Two tools, <span>one honest answer</span></h2>
      </div>
      <div className="two">
        {options.map((o) => (
          <div className="glass opt reveal" key={o.t}>
            <h3>{o.t}</h3>
            <p className="sub">{o.sub}</p>
            <ul>{o.items.map((it) => <li key={it}>{it}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section className="s wrap" id="faq">
      <div className="head reveal">
        <span className="tag">FAQ</span>
        <h2>Questions <span>clients ask</span></h2>
      </div>
      <div className="faq reveal">
        {faq.map((f) => (
          <details key={f.q}>
            <summary>{f.q}<i>+</i></summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Contact() {
  return (
    <section className="s wrap" id="contact">
      <div className="glass cta reveal">
        <span className="tag">Contact</span>
        <h2>Launching or rebuilding <span>your website?</span></h2>
        <p className="lead">
          Tell me what you're working on and where it's stuck. I'll say whether Webflow or code is
          the better route.
        </p>
        <div className="btns">
          <Btn solid href={contact.whatsapp}>Chat on WhatsApp</Btn>
          <Btn href={`mailto:${contact.email}`} external={false}>Email</Btn>
          <Btn href={contact.linkedin}>LinkedIn</Btn>
          <Btn href={contact.github}>GitHub</Btn>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <span>&copy; 2026 Muhammad Anas</span>
      <span>Lahore, Pakistan &middot; Built with React, Three.js &amp; GSAP</span>
    </footer>
  );
}
