import React from 'react';
import { motion } from 'motion/react';

interface MellowMinisLabelProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
}

export default function MellowMinisLabel({ size = 'md', interactive = true }: MellowMinisLabelProps) {
  // Determine pixel size based on class constraints
  const dimensions = {
    sm: 'w-10 h-10',
    md: 'w-24 h-24',
    lg: 'w-48 h-48 sm:w-56 sm:h-56',
    xl: 'w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80',
  }[size];

  // Micro-interactions and animations
  const hoverAnimation = interactive
    ? {
        hover: {
          scale: 1.05,
          rotate: [0, -0.5, 0.5, 0],
          transition: { duration: 0.4, ease: 'easeInOut' },
        },
      }
    : {};

  return (
    <motion.div
      id="mellow-minis-badge"
      className={`relative ${dimensions} select-none mx-auto rounded-full overflow-hidden shadow-lg border-2 border-mellow-green/30 bg-mellow-light`}
      style={{ contentVisibility: 'auto' }}
      variants={hoverAnimation}
      whileHover="hover"
    >
      <img
        src="/images/Mello.jpeg"
        alt="Mellow Minis Agave Nectar Logo"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover rounded-full"
      />
      
      {/* Decorative inner circular subtle border */}
      <div className="absolute inset-1.5 rounded-full border border-mellow-tan/20 pointer-events-none" />
    </motion.div>
  );
}
