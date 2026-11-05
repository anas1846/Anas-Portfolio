import { useEffect, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const links = [
  ['About', 'about'],
  ['Work', 'work'],
  ['Services', 'tools'],
  ['FAQ', 'faq'],
  ['Contact', 'contact'],
];

const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Karachi',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

export default function Nav() {
  const [active, setActive] = useState('');
  const [time, setTime] = useState(() => fmt.format(new Date()));

  useEffect(() => {
    const id = setInterval(() => setTime(fmt.format(new Date())), 20000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const triggers = links.map(([, id]) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 40%',
        end: 'bottom 40%',
        onToggle: (self) => {
          if (self.isActive) setActive(id);
          else setActive((cur) => (cur === id ? '' : cur));
        },
      })
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <nav className="pill" aria-label="Main">
      <a className="logo" href="#home">
        <i />
        Anas
      </a>
      {links.map(([label, id]) => (
        <a key={id} className={`l ${active === id ? 'on' : ''}`} href={`#${id}`}>
          {label}
        </a>
      ))}
      <span className="chip">Lahore {time}</span>
    </nav>
  );
}
