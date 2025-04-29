"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { MdDeleteOutline } from "react-icons/md";

const page = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tripTypeFilter, setTripTypeFilter] = useState("all");

  const vendor = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("vendor")) : null;

  if (!vendor) {
    console.error("Vendor not found in localStorage");
    // Optionally handle the case when vendor is not found, like redirecting the user
  }

  const email = vendor ? vendor.email : null;
  const vendorId = vendor ? vendor.vendorId : null;

  console.log(vendorId);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `https://api.worldtriplink.com/${vendorId}/vendorByBookings`
        );
        setBookings(response.data);
      } catch (error) {
        setError("Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const complet = bookings.filter((booking) => booking.status === 2);
  const c = complet.length;

  const pending = bookings.filter((booking) => booking.status === 0);
  const p = pending.length;

  const ongoing = bookings.filter((booking) => booking.status === 1);
  const o = ongoing.length;

  const cancelled = bookings.filter((booking) => booking.status === 3);
  const cn = cancelled.length;

  console.log(c, p, o, cn);

  const filteredBookings = bookings.filter((booking) => {
    if (tripTypeFilter === "all") return true;
    if (tripTypeFilter === "one-way" && booking.tripType === "oneWay")
      return true;
    if (tripTypeFilter === "roundTrip" && booking.tripType === "roundTrip")
      return true;
    return false;
  });

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`https://api.worldtriplink.com/delete/${id}`);
      alert("Booking deleted successfully!");
      setBookings(bookings.filter((booking) => booking.id !== id));
    } catch (error) {
      console.error("Error deleting the booking:", error);
      alert("Failed to delete the booking");
    }
  };

  const router = useRouter();

  const handleStatusClick = (status) => {
    router.push(`/status/${status}`);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-64">
        <Navbar />

        <div className="flex-1 overflow-auto p-6 pt-20 bg-gray-100  dark:bg-black dark:text-white">
          {/* ✅ Buttons Section (Centered & Responsive) */}
          <div className="flex flex-wrap justify-center gap-4 mb-2  dark:bg-black dark:text-white">
            <div className="flex justify-center mb-4">
              <select
                value={tripTypeFilter}
                onChange={(e) => setTripTypeFilter(e.target.value)}
                className="bg-white text-black border rounded-md px-4 py-2"
              >
                <option value="all">All Trip Types</option>
                <option value="one-way">One-way Trip</option>
                <option value="roundTrip">Round-trip</option>
              </select>
            </div>
            <div>
              <button
                onClick={() => handleStatusClick(0)}
                className="bg-yellow-500 text-black px-6 py-2 rounded-md font-semibold flex items-center text-xs sm:text-base"
              >
                Pending{" "}
                <span className="bg-black text-white text-xs font-bold ml-2 px-2 py-0.5 rounded-full">
                  {p}
                </span>
              </button>
            </div>
            <div>
              <button
                onClick={() => handleStatusClick(1)}
                className="bg-blue-500 text-white px-6 py-2 rounded-md font-semibold flex items-center text-xs sm:text-base"
              >
                OnGoing{" "}
                <span className="bg-black text-white text-xs font-bold ml-2 px-2 py-0.5 rounded-full">
                  {o}
                </span>
              </button>
            </div>
            <div>
              <button
                onClick={() => handleStatusClick(2)}
                className="bg-green-500 text-white px-6 py-2 rounded-md font-semibold flex items-center text-xs sm:text-base"
              >
                Completed{" "}
                <span className="bg-black text-white text-xs font-bold ml-2 px-2 py-0.5 rounded-full">
                  {c}
                </span>
              </button>
            </div>
            <div>
              <button
                onClick={() => handleStatusClick(3)}
                className="bg-red-500 text-white px-6 py-2 rounded-md font-semibold flex items-center text-xs sm:text-base"
              >
                Cancelled{" "}
                <span className="bg-black text-white text-xs font-bold ml-2 px-2 py-0.5 rounded-full">
                  {cn}
                </span>
              </button>
            </div>
          </div>

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
            // ✅ Responsive Table Section (Show fetched bookings data)
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg  dark:bg-black dark:text-white">
              <table className="w-full border-collapse border border-gray-300 ">
                <thead className="bg-gray-100  dark:bg-black dark:text-white">
                  <tr className="border border-gray-300">
                    <th className="text-left font-bold p-3 border border-gray-300">
                      <Link
                        href="/customer-details"
                        className="hover:underline"
                      >
                        Booking ID
                      </Link>
                    </th>
                    <th className="text-left font-bold p-3 border border-gray-300">
                      <Link href="/pickup" className="hover:underline">
                        Pickup
                      </Link>
                    </th>
                    <th className="text-left font-bold p-3 border border-gray-300">
                      <Link href="/drop" className="hover:underline">
                        Drop
                      </Link>
                    </th>
                    <th className="text-left font-bold p-3 border border-gray-300">
                      <Link href="/trip-details" className="hover:underline">
                        Trip Details
                      </Link>
                    </th>
                    <th className="text-left font-bold p-3 border border-gray-300">
                      <Link href="/trip-status" className="hover:underline">
                        Trip Status
                      </Link>
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
                  {filteredBookings.map((booking, index) => {
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
                        case 5:
                        statusColor = "bg-gray-400 text-gray-800";
                        statusText = "Reassign";
                        break;
                      default:
                        statusColor = "bg-gray-300 text-gray-800";
                        statusText = "Unknown";
                        break;
                    }

                    return (
                      <tr key={index} className="border border-gray-300">
                        <td className="p-3 border border-gray-300">
                          {booking.bookingId}
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
    : ""}                        </td>
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

export default page;
