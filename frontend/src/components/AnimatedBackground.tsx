import React from 'react';

export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-white dark:bg-[#000000] transition-colors duration-1000">
      {/* Mesh Gradient Containers */}
      <div className="absolute inset-0 opacity-60 dark:opacity-40 transition-opacity duration-1000">
        {/* Dynamic Blobs - Amber/Orange Theme */}
        <div className="absolute top-[-20%] left-[-10%] w-[100%] h-[100%] rounded-full bg-mesh-1/20 blur-[150px] animate-mesh" />
        <div className="absolute top-[20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-mesh-2/15 blur-[150px] animate-mesh" style={{ animationDelay: '-5s' }} />
        <div className="absolute bottom-[-20%] left-[10%] w-[90%] h-[90%] rounded-full bg-mesh-3/20 blur-[150px] animate-mesh" style={{ animationDelay: '-10s' }} />
        
        {/* Subtle Dark Accents */}
        <div className="hidden dark:block absolute top-[40%] left-[30%] w-[50%] h-[50%] rounded-full bg-orange-900/10 blur-[120px] animate-mesh" style={{ animationDelay: '-15s' }} />
      </div>

      {/* Vignette Overlay for that high-end look */}
      <div className="absolute inset-0 bg-radial-[at_center] from-transparent via-transparent to-white/20 dark:to-black/60 pointer-events-none" />
      
      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-white/5 dark:bg-black/5 backdrop-blur-[1px]" />
    </div>
  );
};
