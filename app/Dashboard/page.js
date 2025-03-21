"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { IndianRupee, Car, CalendarCheck, Users } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [notification, setNotification] = useState(false);
  const [todaysBookings, setTodaysBookings] = useState([]);

  const router = useRouter();

  const vendor = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("vendor")) : null;

  if (!vendor) {
    console.error("Vendor not found in localStorage");
  }

  const vendorId = vendor ? vendor.vendorId : null;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/${vendorId}/vendorByBookings`
        );
        setBookings(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBookings();
  }, [vendorId]);

  // Calculate Total Revenue
  const totalRevenue = bookings.reduce((sum, booking) => {
    if (booking.status === 2) {
      return sum + (booking.amount || 0);
    }
    return sum;
  }, 0);

  // Booking Status Counts
  const statusCounts = {
    pending: 0,
    ongoing: 0,
    completed: 0,
    cancelled: 0,
  };

  bookings.forEach((booking) => {
    if (booking.status === 0) statusCounts.pending++;
    else if (booking.status === 1) statusCounts.ongoing++;
    else if (booking.status === 2) statusCounts.completed++;
    else if (booking.status === 3 || 5) statusCounts.cancelled++;
  });

  // Dynamic Pie Chart Data
  const dataPie = [
    { name: "Pending", value: statusCounts.pending, color: "#FFC107" }, // Yellow
    { name: "Ongoing", value: statusCounts.ongoing, color: "#007BFF" }, // Blue
    { name: "Completed", value: statusCounts.completed, color: "#28A745" }, // Green
    { name: "Cancelled", value: statusCounts.cancelled, color: "#DC3545" }, // Red
  ].filter((entry) => entry.value > 0); // Remove categories with zero value

  // Check for today's bookings when the component mounts
  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    const todaysBookings = bookings.filter((booking) => booking.date === currentDate);

    if (todaysBookings.length > 0) {
      setTodaysBookings(todaysBookings);
      setNotification(true);

      // Play notification sound
      const audio = new Audio("/img/notify-6-313751.mp3"); // Ensure the path is correct
      audio.play().catch((error) => {
        console.error("Failed to play sound:", error);
      });
    }
  }, [bookings]); // Run only when bookings are fetched

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6">
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white shadow-lg p-6 rounded-lg flex items-center">
              <IndianRupee className="w-10 h-10 text-green-500 mr-4" />
              <div>
                <p className="text-xl font-bold">₹ {totalRevenue} /-</p>
                <p className="text-gray-500">Total Revenue</p>
              </div>
            </div>

            <div className="bg-white shadow-lg p-6 rounded-lg flex items-center">
              <Car className="w-10 h-10 text-blue-500 mr-4" />
              <div>
                <p className="text-xl font-bold">{bookings.length}</p>
                <p className="text-gray-500">Total Trips</p>
              </div>
            </div>

            <div className="bg-white shadow-lg p-6 rounded-lg flex items-center">
              <CalendarCheck className="w-10 h-10 text-yellow-500 mr-4" />
              <div>
                <p className="text-xl font-bold">{bookings.length}</p>
                <p className="text-gray-500">All Booking Details</p>
              </div>
            </div>

            <div className="bg-white shadow-lg p-6 rounded-lg flex items-center">
              <Users className="w-10 h-10 text-purple-500 mr-4" />
              <div>
                <p className="text-xl font-bold">{bookings.length}</p>
                <p className="text-gray-500">Clients</p>
              </div>
            </div>
          </div>

          {/* Notification Modal */}
          {notification && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Booking Reminder</h2>
                <p className="text-gray-600 mb-4">
                  You have {todaysBookings.length} booking(s) today:
                </p>
                <ul className="mb-4">
                  {todaysBookings.map((booking) => (
                    <li key={booking.bookingId} className="text-gray-700">
                      Booking ID: {booking.bookingId}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-end gap-2">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                    onClick={() => setNotification(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={() => {
                      router.push("/Notification");
                      setNotification(false);
                    }}
                  >
                    View Bookings
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Graphs Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {/* Dynamic Pie Chart */}
            <div className="bg-white shadow-lg p-6 rounded-lg">
              <h3 className="text-center text-lg font-semibold mb-2">Booking Status</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={dataPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {dataPie.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;