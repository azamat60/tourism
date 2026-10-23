'use client';

import Image, { type ImageProps } from 'next/image';

export default function SiteImage({
  src,
  alt,
  unoptimized,
  ...props
}: ImageProps) {
  const remote = typeof src === 'string' && /^(https?:)?\/\//.test(src);
  return (
    <Image {...props} alt={alt} src={src} unoptimized={unoptimized ?? remote} />
  );
}
