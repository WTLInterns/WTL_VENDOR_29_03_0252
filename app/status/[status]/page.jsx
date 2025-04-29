"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { useRouter } from "next/navigation";

const Page = () => {
  const params = useParams(); // Get status from URL
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  const vendor = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("vendor")) : null;

  if (!vendor) {
    console.error("Vendor not found in localStorage");
    // Optionally handle the case when vendor is not found, like redirecting the user
  }

  const email = vendor ? vendor.email : null;
  const vendorId = vendor ? vendor.id : null;

  useEffect(() => {
    const fetchBookingsByStatus = async () => {
      try {
        const response = await axios.get(
          `https://api.worldtriplink.com/getStatus/${params.status}`
        );
        setBookings(response.data);
      } catch (error) {
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsByStatus(); // Fetch bookings when component mounts
  }, [params.status]); // Re-fetch when `status` changes

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden ml-64">
        <Navbar />
        <div className="flex-1 overflow-auto p-6 pt-20 bg-gray-100">
          {error && (
            <div className="text-red-500 text-center mb-4">
              <p>{error}</p>
            </div>
          )}
          {loading ? (
            <div className="text-center">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr className="border border-gray-300">
                    <th className="text-left font-bold p-3 border border-gray-300">
                      Booking ID
                    </th>
                    <th className="text-left font-bold p-3 border border-gray-300">
                      Pickup
                    </th>
                    <th className="text-left font-bold p-3 border border-gray-300">
                      Drop
                    </th>
                    <th className="text-left font-bold p-3 border border-gray-300">
                      Trip Type
                    </th>
                    <th className="text-left font-bold p-3 border border-gray-300">
                      Trip Status
                    </th>
                    <th className="text-left font-bold p-3 border border-gray-300">
                      <Link href="/trip-status" className="hover:underline">
                        View
                      </Link>
                    </th>

                    <th className="text-left font-bold p-3 border border-gray-300">
                      <button className="hover:underline">Action</button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => {
                    let statusColor = "";
                    let statusText = "";

                    switch (booking.status) {
                      case 0:
                        statusColor = "bg-yellow-400 text-yellow-800";
                        statusText = "Pending";
                        break;
                      case 1:
                        statusColor = "bg-blue-400 text-blue-800";
                        statusText = "Ongoing";
                        break;
                      case 2:
                        statusColor = "bg-green-400 text-green-800";
                        statusText = "Completed";
                        break;
                      case 3:
                        statusColor = "bg-red-400 text-red-800";
                        statusText = "Cancelled";
                        break;
                      default:
                        statusColor = "bg-gray-300 text-gray-800";
                        statusText = "Unknown";
                        break;
                    }

                    return (
                      <tr key={index} className="border border-gray-300">
                        <td className="p-3 border border-gray-300">
                          {booking.id}
                        </td>
                        <td className="p-3 border border-gray-300">
                          {booking.userPickup}
                        </td>
                        <td className="p-3 border border-gray-300">
                          {booking.userDrop}
                        </td>
                        <td className="p-3 border border-gray-300">
                        {booking.tripType
    ? booking.tripType
        .replace(/[- ]/g, "") // Remove hyphens and spaces
        .replace(/^./, (match) => match.toUpperCase()) // Capitalize the first letter
    : ""}
                        </td>
                        <td className="p-3 border border-gray-300">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor}`}
                          >
                            {statusText}
                          </span>
                        </td>
                        <td className="p-3 border border-gray-300">
                          <button
                            className="border rounded-full p-2 flex items-center justify-center"
                            onClick={() =>
                              router.push(`/Bookings/arrow/${booking.id}`)
                            }
                          >
                            <FaArrowRight />
                          </button>
                        </td>

                        <td className="p-3  flex items-center justify-center">
                          <MdDeleteOutline
                            className="text-2xl"
                            onClick={() => deleteBooking(booking.id)}
                          />{" "}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
