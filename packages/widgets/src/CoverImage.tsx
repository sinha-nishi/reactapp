import * as React from 'react';

export function CoverImage({ src }: { src: string }) {
  return (
    <div className="absolute md:fixed top-0 w-full">
      <img
        src={src}
        className="h-48 md:h-72 w-full object-cover"
        alt="About me cover"
      />
    </div>
  );
}