import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const bookingId = params.id;

  try {
    const client = await clientPromise;
    const db = client.db('sih2024'); // Replace with your database name
    const bookingsCollection = db.collection('receiver');

    const booking = await bookingsCollection.findOne({ 'Booking ID': bookingId });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const bookingId = params.id;
  const { newDate, newTimeSlot } = await req.json();

  try {
    const client = await clientPromise;
    const db = client.db('sih2024'); // Replace with your database name
    const bookingsCollection = db.collection('receiver');

    const updateFields: { [key: string]: string } = {};
    if (newDate) updateFields['Date of Delivery'] = newDate;
    if (newTimeSlot) updateFields['Time Slot of Delivery'] = newTimeSlot;

    const result = await bookingsCollection.updateOne(
      { 'Booking ID': bookingId },
      { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Booking not found or no changes made' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Booking updated successfully' });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
