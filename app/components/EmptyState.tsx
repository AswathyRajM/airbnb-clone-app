'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import Heading from './Heading';
import Button from './Button';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}

function EmptyState({
  title = 'No exact matches',
  subtitle = 'Try changing or removing some of your filters',
  showReset,
}: EmptyStateProps) {
  const router = useRouter();
  return (
    <div
      className='
      flex
      flex-col
      gap-2
      justify-center
      items-center
      h-[60vh]
  '
    >
      <Heading center title={title} subtitle={subtitle} />
      <div className='w-48 mt-4'>
        {showReset && (
          <Button
            small
            outline
            label='Remove all filters'
            onClick={() => router.push('/')}
          />
        )}
      </div>
    </div>
  );
}

export default EmptyState;
