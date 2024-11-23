'use client';

import { useState } from 'react';

interface Booking {
  "Booking ID": string;
  "Sender Name": string;
  "Sender Gmail ID": string;
  "Receiver Name": string;
  "Receiver Gmail ID": string;
  "Receiver Address": string;
  "Receiver Post Office": string;
  "Zipcode": string;
  "Receiver Phone Number": string;
  "Order Date": string;
  "Date of Delivery": string;
  "Time Slot of Delivery": string;
  "Equipment Getting Delivered": string;
  "Delivery Status": string;
}

export default function SearchBooking() {
  const [bookingId, setBookingId] = useState('');
  const [bookingData, setBookingData] = useState<Booking | null>(null);
  const [error, setError] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');


  const handleSearch = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (!response.ok) {
        throw new Error('Booking not found');
      }
      const data = await response.json();
      setBookingData(data);
      setError('');
    } catch (err) {
      setBookingData(null);
      setError(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updateData: { newDate?: string; newTimeSlot?: string } = {};
      if (newDate) updateData.newDate = newDate;
      if (newTimeSlot) updateData.newTimeSlot = newTimeSlot;

      if (Object.keys(updateData).length === 0) {
        setError('Please provide at least one update field.');
        return;
      }

      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update booking');
      }

      const result = await response.json();
      alert(result.message);

      setBookingData((prevData) => {
        if (!prevData) return null;
        return {
          ...prevData,
          ...(newDate && { 'Date of Delivery': newDate }),
          ...(newTimeSlot && { 'Time Slot of Delivery': newTimeSlot }),
        };
      });

      setNewDate('');
      setNewTimeSlot('');
      setError('');
    } catch (err) {
      setError(error);
    }
  };
  return (
    <div className="p-6">
      {/* <input
        type="text"
        value={bookingId}
        onChange={(e) => setBookingId(e.target.value)}
        placeholder="Enter Booking ID"
        className="border p-2"
      />
      <button onClick={handleSearch} className="ml-2 p-2 bg-blue-500 text-white">
        Search
      </button> */}

      

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {bookingData && (
        <div className="mt-4 p-4 border">
          <h2 className="text-xl font-bold">Booking Details</h2>
          <p><strong>Booking ID:</strong> {bookingData["Booking ID"]}</p>
          <p><strong>Sender Name:</strong> {bookingData["Sender Name"]}</p>
          <p><strong>Sender Gmail ID:</strong> {bookingData["Sender Gmail ID"]}</p>
          <p><strong>Receiver Name:</strong> {bookingData["Receiver Name"]}</p>
          <p><strong>Receiver Gmail ID :</strong> {bookingData["Receiver Gmail ID"]}</p>
          <p><strong>Receiver Address:</strong> {bookingData["Receiver Address"]}</p>
          <p><strong>Receiver Post Office:</strong> {bookingData["Receiver Post Office"]}</p>
          <p><strong>Zipcode:</strong> {bookingData["Zipcode"]}</p>
          <p><strong>Receiver Phone Number:</strong> {bookingData["Receiver Phone Number"]}</p>
          <p><strong>Order Date:</strong> {bookingData["Order Date"]}</p>
          <p><strong>Date of Delivery:</strong> {bookingData["Date of Delivery"]}</p>
          <p><strong>Time Slot of Delivery:</strong> {bookingData["Time Slot of Delivery"]}</p>
          <p><strong>Equipment Getting Delivered:</strong> {bookingData["Equipment Getting Delivered"]}</p>
          <p><strong>Delivery Status:</strong> {bookingData["Delivery Status"]}</p>
          {/* Add more fields as needed */}

          <div className="mt-4">
            <h3 className="text-lg font-bold">Update Delivery Details</h3>
            <label className="block mt-2">
              New Date of Delivery:
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="border p-2 mt-1"
              />
            </label>
            <label className="block mt-2">
              New Time Slot of Delivery:
              <input
                type="text"
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
                placeholder="e.g., 02:00 PM - 03:00 PM"
                className="border p-2 mt-1"
              />
            </label>
            <button
              onClick={handleUpdate}
              className="mt-4 p-2 bg-green-500 text-white"
            >
              Update
            </button>
          </div>
        </div>


      )}
    </div>
  );
}
