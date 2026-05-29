"use client";

import React from "react";
import { Plus } from "lucide-react"; 

interface TextColorProps {
  text1?: string;
  text2?: string;
  text3?: string;
}

export function TextColor({ 
  text1 = "Develop.", 
  text2 = "Preview.", 
  text3 = "Ship." 
}: TextColorProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full">
        <div className="px-2">
          <div className="relative p-8 w-full h-full border border-slate-200 dark:border-slate-800 [mask-image:radial-gradient(100rem_24rem_at_center,white,transparent)]">
            <h1 className="tracking-tighter flex select-none px-3 py-2 flex-col text-center text-6xl font-extrabold leading-none sm:text-7xl md:text-8xl">
              <Plus className="absolute -left-4 -top-4 h-8 w-8 text-blue-500" />
              <Plus className="absolute -bottom-4 -left-4 h-8 w-8 text-blue-500" />
              <Plus className="absolute -right-4 -top-4 h-8 w-8 text-blue-500" />
              <Plus className="absolute -bottom-4 -right-4 h-8 w-8 text-blue-500" />

              <span
                data-content={text1}
                className="before-animate-g1-bg relative before:absolute before:inset-0 before:z-0 before:text-slate-900 dark:before:text-white"
              >
                <span className="bg-gradient-g1 animate-g1-fg bg-clip-text px-2 text-transparent sm:px-5">
                  {text1}
                </span>
              </span>
              <span
                data-content={text2}
                className="before-animate-g2-bg relative before:absolute before:inset-0 before:z-0 before:text-slate-900 dark:before:text-white"
              >
                <span className="bg-gradient-g2 animate-g2-fg bg-clip-text px-2 text-transparent sm:px-5">
                  {text2}
                </span>
              </span>
              <span
                data-content={text3}
                className="before-animate-g3-bg relative before:absolute before:inset-0 before:z-0 before:text-slate-900 dark:before:text-white"
              >
                <span className="bg-gradient-g3 animate-g3-fg bg-clip-text px-2 text-transparent sm:px-5">
                  {text3}
                </span>
              </span>
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
