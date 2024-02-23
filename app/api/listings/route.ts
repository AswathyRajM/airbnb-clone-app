import { NextResponse } from 'next/server';

import prisma from '@/app/libs/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.error();
    }

    const body = await request.json();

    const {
      category,
      location,
      guestCount,
      roomCount,
      bathroomCount,
      imageSrc,
      price,
      title,
      description,
    } = body;

    Object.keys(body).forEach(
      (value: any) => !body[value] && NextResponse.error()
    );

    const listing = await prisma.listing.create({
      data: {
        category,
        guestCount,
        roomCount,
        bathroomCount,
        imageSrc,
        title,
        description,
        location: { lat: location.latlng[0], lng: location.latlng[1] },
        price: parseInt(price, 10),
        userId: currentUser.id,
      },
    });
    console.log({ listing });

    return NextResponse.json(listing);
  } catch (e) {
    console.log({ e });

    return NextResponse.error();
  }
}
