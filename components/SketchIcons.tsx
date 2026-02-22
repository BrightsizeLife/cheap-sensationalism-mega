
import React from 'react';

// Base wrapper for the sketchy aesthetic
// Made children optional to fix TypeScript error about missing required children prop
const SketchBase = ({ children, className = "" }: { children?: React.ReactNode, className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    strokeWidth="1" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={`w-full h-full overflow-visible ${className}`}
  >
    {children}
  </svg>
);

// Animation class for the "draw" effect
const drawClass = "transition-all duration-1000 ease-in-out [stroke-dasharray:200] [stroke-dashoffset:200] group-hover:[stroke-dashoffset:0]";

// Component to render a "rough" sketch group with multiple layers
const RoughGroup = ({ paths }: { paths: React.ReactNode }) => (
  <SketchBase>
    {/* Base Trace: Very faint, fixed pencil mark */}
    <g className="text-zinc-200 stroke-current opacity-30">
      {paths}
    </g>
    {/* Second Layer: Slightly offset, thinner line to simulate hand-drawn tremor */}
    <g className="text-zinc-300 stroke-current opacity-40 translate-x-[0.2px] translate-y-[0.1px]" style={{ strokeWidth: 0.5 }}>
      {paths}
    </g>
    {/* Animated Layer: The primary stroke that draws on hover */}
    <g className={`stroke-current ${drawClass}`}>
      {paths}
    </g>
  </SketchBase>
);

// Navigation Icons
export const SketchSounds = () => (
  <RoughGroup paths={
    <>
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </>
  } />
);

export const SketchThoughts = () => (
  <RoughGroup paths={
    <>
      <path d="M9.5 2C5.358 2 2 5.358 2 9.5c0 2.5 1.2 4.7 3.1 6.1l-1.1 4.4 4.1-2.1c.5.1 1 .1 1.4.1 4.142 0 7.5-3.358 7.5-7.5S13.642 2 9.5 2z" />
      <path d="M8 8s1.5-1 3.5 0" />
      <path d="M17 12s2 0 3.5 1.5S22 17 22 17" />
      <circle cx="18" cy="8" r="1.5" />
    </>
  } />
);

export const SketchTools = () => (
  <RoughGroup paths={
    <>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.77 3.77z" />
    </>
  } />
);

// Cell Items
export const SketchPencil = () => (
  <RoughGroup paths={
    <>
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <path d="M11 11l2 2" />
    </>
  } />
);

export const SketchBolt = () => (
  <RoughGroup paths={
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  } />
);

export const SketchBook = () => (
  <RoughGroup paths={
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
    </>
  } />
);

export const SketchEye = () => (
  <RoughGroup paths={
    <>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 15a3 3 0 0 0 0-6" />
    </>
  } />
);

export const SketchKnobs = () => (
  <RoughGroup paths={
    <>
      <path d="M4 21v-7" />
      <path d="M4 10V3" />
      <path d="M12 21v-9" />
      <path d="M12 8V3" />
      <path d="M20 21v-5" />
      <path d="M20 12V3" />
      <path d="M1 14h6" />
      <path d="M9 8h6" />
      <path d="M17 16h6" />
    </>
  } />
);

export const SketchTape = () => (
  <RoughGroup paths={
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M8 8h8v7H8z" />
      <circle cx="5.5" cy="11.5" r="1.5" />
      <circle cx="18.5" cy="11.5" r="1.5" />
      <path d="M6 16l2-2 3 3 5-5 2 2" />
    </>
  } />
);

export const SketchCircuit = () => (
  <RoughGroup paths={
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 9h6v6H9z" />
      <path d="M9 1v3" />
      <path d="M15 1v3" />
      <path d="M9 20v3" />
      <path d="M15 20v3" />
      <path d="M20 9h3" />
      <path d="M20 14h3" />
      <path d="M1 9h3" />
      <path d="M1 14h3" />
    </>
  } />
);

export const SketchScreen = () => (
  <RoughGroup paths={
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 8l-2 2 2 2" />
      <path d="M17 8l2 2-2 2" />
      <path d="M12 11h.01" />
    </>
  } />
);
