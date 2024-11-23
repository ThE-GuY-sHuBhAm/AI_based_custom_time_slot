'use client';

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import { useState } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

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

export function InputDemo() {
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
        } catch (err: any) {
            setBookingData(null);
            setError(err.message);
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
            toast(result.message);

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
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="m-auto w-2/3 text-center h-full max-h-screen flex flex-col justify-center object-center items-center gap-2 space-y-1 mt-10">
            <div className="w-full">
                <Label htmlFor="bookingid" className="text-3xl font-bold">Track Your Parcel</Label>
            </div>
            <form className="w-full gap-2 flex justify-evenly items-center">
                <Input
                    type="text"
                    placeholder="Enter Booking Id"
                    id="bookingid"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    className="placeholder-white placeholder-opacity-100 font-bold text-lg"
                />

                <Button type="button" onClick={handleSearch}>
                    Search
                </Button>
            </form>

            <div className="overflow-auto mt-4 w-full">
                {error && <p className="text-red-500 mt-4">{error}</p>}

                {bookingData && (
                    <div className="flex flex-col items-center gap-4">
                        <Card className="w-full max-w-screen-sm p-4">
                            <CardHeader>
                                <CardTitle>Booking Details</CardTitle>
                                <CardDescription>Booking Details for Receiver</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-left">
                                    <p><strong>Booking ID:</strong> {bookingData["Booking ID"]}</p>
                                    <p><strong>Sender Name:</strong> {bookingData["Sender Name"]}</p>
                                    {/* <p><strong>Sender Gmail ID:</strong> {bookingData["Sender Gmail ID"]}</p> */}
                                    <p><strong>Receiver Name:</strong> {bookingData["Receiver Name"]}</p>
                                    {/* <p><strong>Receiver Gmail ID :</strong> {bookingData["Receiver Gmail ID"]}</p> */}
                                    <p><strong>Receiver Address:</strong> {bookingData["Receiver Address"]}</p>
                                    {/* <p><strong>Receiver Post Office:</strong> {bookingData["Receiver Post Office"]}</p> */}
                                    {/* <p><strong>Zipcode:</strong> {bookingData["Zipcode"]}</p> */}
                                    <p><strong>Receiver Phone Number:</strong> {bookingData["Receiver Phone Number"]}</p>
                                    <p><strong>Order Date:</strong> {bookingData["Order Date"]}</p>
                                    <p><strong>Date of Delivery:</strong> {bookingData["Date of Delivery"]}</p>
                                    <p><strong>Time Slot of Delivery:</strong> {bookingData["Time Slot of Delivery"]}</p>
                                    <p><strong>Equipment Getting Delivered:</strong> {bookingData["Equipment Getting Delivered"]}</p>
                                    <p><strong>Delivery Status:</strong> {bookingData["Delivery Status"]}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="w-full max-w-screen-sm p-4">
                            <CardHeader>
                                <CardTitle>Update Delivery Details</CardTitle>
                                <CardDescription>Update the delivery details for the booking</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="w-full gap-2 justify-evenly items-center space-y-2">
                                    <Label htmlFor="newDate">New Date of Delivery</Label>
                                    <Input
                                        type="date"
                                        id="newDate"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        className="my-3"
                                    />
                                    <Label htmlFor="newTimeSlot">New Time Slot of Delivery</Label>
                                    <Input
                                        type="text"
                                        id="newTimeSlot"
                                        value={newTimeSlot}
                                        onChange={(e) => setNewTimeSlot(e.target.value)}
                                        className="my-3"
                                    />
                                    <Button type="button" onClick={handleUpdate} className="mt-3">
                                        Update
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>

    )
}
