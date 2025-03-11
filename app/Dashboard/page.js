"use client";
import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { IndianRupee, Car, CalendarCheck, Users } from "lucide-react"; 
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);

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
  }, []);

  // Calculate Total Revenue
  const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0);

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
    else if (booking.status === 3) statusCounts.cancelled++;
  });

  // Dynamic Pie Chart Data
  const dataPie = [
    { name: "Pending", value: statusCounts.pending, color: "#FFC107" }, // Yellow
    { name: "Ongoing", value: statusCounts.ongoing, color: "#007BFF" }, // Blue
    { name: "Completed", value: statusCounts.completed, color: "#28A745" }, // Green
    { name: "Cancelled", value: statusCounts.cancelled, color: "#DC3545" }, // Red
  ].filter((entry) => entry.value > 0); // Remove categories with zero value

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-6 bg-gray-100">
          
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
