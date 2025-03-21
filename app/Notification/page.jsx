// app/notifications/page.js
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertCircle, ShieldAlert, Calendar, Settings, Bell } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [bookings, setBookings] = useState([
    {
      id: "BOOK-1234",
      date: "2025-03-20", // Replace with dynamic booking date
      cabId: "CAB-2028-098",
      driver: "John Smith",
    },
    {
      id: "BOOK-5678",
      date: "2025-03-20", // Another booking for the same date
      cabId: "CAB-2028-099",
      driver: "Jane Doe",
    },
    {
      id: "BOOK-9101",
      date: "2025-03-21", // Booking for a different date
      cabId: "CAB-2028-100",
      driver: "Alice Johnson",
    },
  ]);

  const [notificationShown, setNotificationShown] = useState(false); // Flag to track if notification has been shown

  // Function to check if any booking date matches the current date
  const checkBookingDate = () => {
    const currentDate = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
    const todaysBookings = bookings.filter((booking) => booking.date === currentDate);

    if (todaysBookings.length > 0 && !notificationShown) {
      const bookingNotification = {
        id: Date.now(),
        type: "Booking Reminder",
        message: `You have ${todaysBookings.length} booking(s) today:\n${todaysBookings
          .map(
            (booking) =>
              `Booking ID: ${booking.id} | Cab ID: ${booking.cabId} | Driver: ${booking.driver}`
          )
          .join("\n")}`,
        bgColor: "bg-yellow-500 dark:bg-yellow-700", // Adjusted for dark mode
        borderColor: "border-green-600",
        icon: <Bell size={24} className="text-green-400 animate-pulse" />,
      };

      setNotifications((prev) => [bookingNotification, ...prev]);
      playNotificationSound();
      setNotificationShown(true); // Mark notification as shown
    }
  };

  // Function to play notification sound
  const playNotificationSound = () => {
    const audio = new Audio("/img/notify-6-313751.mp3"); // Ensure the path is correct
    audio.play().catch((error) => {
      console.error("Failed to play sound:", error);
    });
  };

  // Check booking date on component mount
  useEffect(() => {
    checkBookingDate();
  }, [bookings, notificationShown]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 lg:ml-64">
        <Navbar />
        <div className="bg-white dark:bg-black text-black dark:text-white p-6 flex flex-col gap-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="flex justify-between items-center"
          >
            <h1 className="text-3xl font-extrabold">Notifications & Alerts</h1>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="bg-gray-200 dark:bg-gray-800 px-4 py-2 dark:text-white rounded-lg flex items-center gap-2 shadow-lg hover:bg-gray-300 dark:hover:bg-gray-700"
            >
              <Settings size={20} /> Settings
            </motion.button>
          </motion.div>

          {/* Notifications List */}
          <div className="space-y-6">
            {/* Dynamic Notifications */}
            {notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
                whileHover={{ scale: 1.02, boxShadow: "0px 0px 15px rgba(255, 0, 0, 0.5)" }}
                className={`${notification.bgColor} p-5 rounded-lg border ${notification.borderColor} shadow-lg transition`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                      {notification.icon} {notification.type}
                    </h2>
                    <p className="text-sm dark:text-gray-300 whitespace-pre-line">{notification.message}</p>
                  </div>
                  {notification.type === "Booking Reminder" ? (
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 3 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-yellow-700 px-4 py-2 rounded-lg shadow-lg hover:bg-yellow-600 dark:hover:bg-yellow-800 dark:text-white"
                      onClick={() => {
                        alert(`Viewing Bookings for Today`);
                      }}
                    >
                      View Bookings
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 3 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-red-700 px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 dark:hover:bg-red-800 dark:text-white"
                    >
                      Notify Tow Service
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}