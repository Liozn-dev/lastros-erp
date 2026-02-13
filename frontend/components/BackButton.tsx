'use client';

import Link from 'next/link';

export function BackButton({ href = '/' }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline">
      <span className="text-xl">←</span>
      <span>Voltar</span>
    </Link>
  );
}
