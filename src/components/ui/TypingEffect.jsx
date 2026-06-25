import { TypeAnimation } from 'react-type-animation';

export default function TypingEffect({ sequence, className }) {
  return (
    <TypeAnimation
      sequence={sequence}
      wrapper="span"
      speed={50}
      style={{ display: 'inline-block' }}
      repeat={Infinity}
      className={className}
    />
  );
}