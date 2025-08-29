
import React, { JSX } from "react";

export function AppBar({ text }: {text: string}): JSX.Element {
  return (
    <nav className="fixed z-50 top-0 w-full flex bg-slate-50 justify-between shadow-lg h-12 lg:h-16 items-center">
      <div className="w-1/3">
        <a href="/">
          <i className="ml-8 md:ml-24 lg:ml-32 text-lg md:text-2xl fa-solid fa-left-long" />
        </a>
      </div>
      <div className="flex justify-center w-1/3">
        <span>{text}</span>
      </div>
      <div className="w-1/3" />
    </nav>
  );
}

