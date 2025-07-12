"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";
import { FaSync, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaRoute, FaChevronDown, FaEye } from "react-icons/fa";

const ETSPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const router = useRouter();

  // Get vendor details from localStorage
  const vendor = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("vendor")) : null;

  if (!vendor) {
    console.error("Vendor not found in localStorage");
    // Optionally handle the case when vendor is not found, like redirecting the user
  }

  const email = vendor ? vendor.email : null;
  const vendorId = vendor ? vendor.vendorId : null;
  console.log(vendorId)

  // Fetch booking data by vendor ID
  const fetchBookingsByVendorId = async () => {
    if (!vendorId) {
      setError("Vendor ID not found in localStorage");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `https://ets.worldtriplink.com/schedule/byVendorId/${vendorId}`
      );
      setBookings(response.data);
      console.log("Fetched bookings:", response.data);
    } catch (error) {
      console.error("Error fetching bookings by vendor ID:", error);
      setError("Failed to fetch booking data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingsByVendorId();
  }, [vendorId]);

  // Status color and text mapping
  const getStatusDisplay = (status) => {
    switch (status) {
      case 0:
        return { color: "bg-yellow-100 text-yellow-800 border-yellow-200", text: "Pending" };
      case 1:
        return { color: "bg-blue-100 text-blue-800 border-blue-200", text: "Ongoing" };
      case 2:
        return { color: "bg-green-100 text-green-800 border-green-200", text: "Completed" };
      case 3:
        return { color: "bg-red-100 text-red-800 border-red-200", text: "Cancelled" };
      case 5:
        return { color: "bg-gray-100 text-gray-800 border-gray-200", text: "Reassign" };
      default:
        return { color: "bg-gray-100 text-gray-800 border-gray-200", text: "Unknown" };
    }
  };

  // Format trip type
  const formatTripType = (tripType) => {
    if (!tripType) return "N/A";
    return tripType
      .replace(/[- ]/g, "")
      .replace(/^./, (match) => match.toUpperCase());
  };

  // Toggle dropdown for scheduled dates
  const toggleDropdown = (bookingId) => {
    setOpenDropdown(openDropdown === bookingId ? null : bookingId);
  };

  // Get status color for scheduled dates
  const getDateStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Handle view booking details
  const handleViewBooking = (booking) => {
    // Navigate to booking details page using the new ETS details route
    const bookingId = booking.id || booking.bookingId;
    if (bookingId) {
      router.push(`/ETS/details/${bookingId}`);
    } else {
      console.error("No booking ID found for:", booking);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-64">
        <Navbar />

        <div className="flex-1 overflow-auto p-6 pt-20 bg-gray-50 dark:bg-gray-900">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  ETS - Booking Management
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage and track all bookings for Vendor ID: {vendorId || 'Not Available'}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={fetchBookingsByVendorId}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm"
                >
                  <FaSync className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FaRoute className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <FaCalendarAlt className="text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {bookings.filter(b => b.status === 2).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                  <FaClock className="text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {bookings.filter(b => b.status === 0).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Ongoing</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {bookings.filter(b => b.status === 1).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">Loading booking data...</p>
                <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch your bookings</p>
              </div>
            </div>
          ) : (
            /* Bookings Table */
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {bookings.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <FaRoute className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No bookings found</h3>
                  <p className="text-gray-600 dark:text-gray-400">There are no bookings available for this vendor.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Booking ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Pickup Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Drop Location
                        </th>
                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Trip Type
                        </th> */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date & Time
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Scheduled Dates
                        </th>
                       <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          View
                        </th>
                         {/*<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th> */}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {bookings.map((booking, index) => {
                        const statusDisplay = getStatusDisplay(booking.status);
                        
                        return (
                          <tr key={booking.id || booking.bookingId || index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {booking.bookingId || booking.id || 'N/A'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {booking.userPickup || booking.pickUpLocation || 'N/A'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {booking.userDrop || booking.dropLocation || 'N/A'}
                              </div>
                            </td>
                            {/* <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                {formatTripType(booking.tripType)}
                              </div>
                            </td> */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">
                                <div>{booking.time || booking.time }</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {booking.time}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap relative">
                              {booking.scheduledDates && booking.scheduledDates.length > 0 ? (
                                <div className="relative">
                                  <button
                                    onClick={() => toggleDropdown(booking.id || booking.bookingId || index)}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <FaCalendarAlt className="mr-2 text-xs" />
                                    {booking.scheduledDates.length} Date{booking.scheduledDates.length > 1 ? 's' : ''}
                                    <FaChevronDown className={`ml-2 text-xs transition-transform ${openDropdown === (booking.id || booking.bookingId || index) ? 'rotate-180' : ''}`} />
                                  </button>

                                  {openDropdown === (booking.id || booking.bookingId || index) && (
                                    <div className="absolute z-10 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg">
                                      <div className="py-2 max-h-48 overflow-y-auto">
                                        {booking.scheduledDates.map((scheduledDate, dateIndex) => (
                                          <div key={scheduledDate.id || dateIndex} className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <div className="flex items-center justify-between">
                                              <div className="text-sm text-gray-900 dark:text-white">
                                                {scheduledDate.date}
                                              </div>
                                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getDateStatusColor(scheduledDate.status)}`}>
                                                {scheduledDate.status}
                                              </span>
                                            </div>
                                            {scheduledDate.slotId && (
                                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                Slot ID: {scheduledDate.slotId}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  No scheduled dates
                                </div>
                              )}
                            </td>
                            <td>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
<FaEye className="mx-auto" title="View Details" style={{cursor: 'pointer'}} onClick={() =>
                              router.push(`/ETS/details/${booking.id}`)
                            }/>                                </div>
                            </td>
                            {/* <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${statusDisplay.color}`}>
                                {statusDisplay.text}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {booking.amount ? `₹${booking.amount}` : 'N/A'}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => handleViewBooking(booking)}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md transition-colors duration-200"
                                title="View Booking Details"
                              >
                                <FaEye className="mr-2" />
                                View
                              </button>
                            </td> */}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ETSPage;
