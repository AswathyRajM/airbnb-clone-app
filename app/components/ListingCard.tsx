'use client';
import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Image from 'next/image';
import { Listing, Reservation } from '@prisma/client';
import { SafeUser } from '../types';
import { useCountries } from '../hooks/useCountries';
import { convertToString } from '../helpers/locationToString';
import { getImageSrc } from '../helpers/getImageSrc';
import HeartButton from './HeartButton';

interface ListingCardProps {
  listing: Listing;
  reservation?: Reservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser: SafeUser | null;
}

function ListingCard({
  listing,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = '',
  currentUser,
}: ListingCardProps) {
  const router = useRouter();
  const { getByValue } = useCountries();

  // Ensure that location is always a string before passing it to getByValue
  const location = getByValue(convertToString(listing.location));

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) return;

      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const price = useMemo(() => {
    if (reservation) return reservation.totalPrice;
    return listing.price;
  }, [reservation, listing.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) return null;

    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, 'PP')} - ${format(end, 'PP')}`;
  }, [reservation]);

  // Get the first image URL from listing.imageSrc
  const imageSrc = getImageSrc(listing.imageSrc);

  return (
    <div
      onClick={() => router.push(`/listings/${listing.id}`)}
      className='col-span-1 cursor-pointer group'
    >
      <div className='flex flex-col gap-2 w-full aspect-square '>
        <div className='w-full aspect-square relative overflow-hidden rounded-xl'>
          <Image
            fill
            alt='Listing'
            src={imageSrc}
            className='object-cover h-full w-full group-hover:scale-110 transition'
          />
          <div className='absolute top-3 right-3'>
            <HeartButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
