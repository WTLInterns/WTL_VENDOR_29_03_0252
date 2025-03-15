"use client";

import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const Page = () => {
  const params = useParams();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [booking, setBooking] = useState(null);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isCabModalOpen, setIsCabModalOpen] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [cabs, setCabs] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [selectedCab, setSelectedCab] = useState(null);

  // Get vendor details from localStorage
  const vendor = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("vendor")) : null;

  if (!vendor) {
    console.error("Vendor not found in localStorage");
    // Optionally, you can redirect the user if vendor is not found.
  }

  const email = vendor ? vendor.email : null;
  const vendorId = vendor ? vendor.vendorId : null;

  console.log("Vendor:", vendor);

  // Fetch booking details by ID (using params.id as dependency)
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/booking/${params.id}`
        );
        setBooking(response.data);
      } catch (error) {
        console.error("Error fetching booking:", error);
      }
    };

    if (params.id) {
      fetchBooking();
    }
  }, [params.id]);

  // Fetch drivers when booking is loaded (or vendorId changes)
  useEffect(() => {
    const fetchDrivers = async () => {
      if (booking && vendorId) {
        try {
          const response = await axios.get(
            `http://localhost:8080/${vendorId}/drivers`
          );
          setDrivers(response.data);
        } catch (error) {
          console.error("Error fetching drivers:", error);
        }
      }
    };

    fetchDrivers();
  }, [booking, vendorId]);

  // Fetch cabs when vendorId is available
  useEffect(() => {
    const fetchCabs = async () => {
      if (vendorId) {
        try {
          const response = await axios.get(
            `http://localhost:8080/${vendorId}/cabs`
          );
          setCabs(response.data);
        } catch (error) {
          console.error("Error fetching cabs:", error);
        }
      }
    };

    fetchCabs();
  }, [vendorId]);

  const handleSendMail = () => {
    setIsPopupVisible(true);
    setTimeout(() => {
      setIsPopupVisible(false);
    }, 1000);
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/${params.id}/status`,
        { status: newStatus }
      );
      setBooking(response.data);
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const handleUpdateStatus1 = async (newStatus) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/${params.id}/status`,
        { status: newStatus }
      );
      setBooking(response.data);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver);
    setIsDriverModalOpen(false);
  };

  const handleCabSelect = (cab) => {
    setSelectedCab(cab);
    setIsCabModalOpen(false);
  };

  // Assign the driver to the booking
  const assignVendorDriver = async (vendorDriverId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/${params.id}/assignVendorDriver/${vendorDriverId}`
      );
      alert("Driver assigned successfully:", response.data);
    } catch (error) {
      console.error("Error assigning driver:", error);
    }
  };

  // Assign the cab to the booking
  const assignVendorCab = async (vendorCabId) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/${params.id}/assignVendorCab/${vendorCabId}`
      );
      alert("Cab assigned successfully:", response.data);
    } catch (error) {
      console.error("Error assigning cab:", error);
    }
  };

  const createPenalty = async () => {
    try {
      await axios.post(
        `http://localhost:8080/penalty/${params.id}/${vendorId}`,
        { amount: 2000, time:`${currentTime}` }, // Fixed amount of 2000
        { headers: { "Content-Type": "application/json" } }
      );

      Swal.fire("Cancelled!", "Your booking has been cancelled.", "success");
    } catch (error) {
      console.error("Error occurred", error);
      Swal.fire("Error", "Failed to cancel booking.", "error");
    }
  };

  if (!booking) return <div>Loading...</div>;

  // Find assigned driver and cab based on IDs
  const driver = drivers.find(
    (driver) => driver.vendorDriverId === booking.vendorDriverId
  );
  const cab = cabs.find((cab) => cab.vendorCabId === booking.vendorCabId);

  // Get current date in YYYY-MM-DD format
  const date = new Date();
  const yy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const currentDate = `${yy}-${mm}-${dd}`;

  // Get current time in HH:MM format
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const currentTime = `${hours}:${minutes}`;

  // Check if booking date is today
  const isBookingDateToday = booking?.startDate === currentDate;

  let cancellationMessage = "";

  if (!booking) {
    cancellationMessage = "No booking found.";
  } else {
    // If booking is today, check the time difference
    const [bookingHours, bookingMinutes] = booking.time.split(":").map(Number);
    const [currentHours, currentMinutes] = currentTime.split(":").map(Number);

    // Convert both times to minutes for easier comparison
    const bookingTotalMinutes = bookingHours * 60 + bookingMinutes;
    const currentTotalMinutes = currentHours * 60 + currentMinutes;

    // Calculate time difference in minutes
    const timeDifferenceMinutes = bookingTotalMinutes - currentTotalMinutes;

    console.log("Time difference in minutes:", timeDifferenceMinutes);

    // Check if cancellation is less than 1 hour before booking time
    if (timeDifferenceMinutes < 60 && timeDifferenceMinutes > 0) {
      cancellationMessage =
        "Penalty applies: You are able to cancel the booking, but you have to pay a cancellation fine of 2000.";
    } else if (timeDifferenceMinutes <= 0) {
      cancellationMessage =
        "Your booking time has already passed or is currently in progress.";
    } else {
      cancellationMessage =
        "Cancel is applicable: You are able to cancel the booking without penalty.";
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
      />
      <div
        className={`flex-1 flex flex-col transition-all ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

        <div className="p-6 mt-20">
          <h1 className="bg-gray-100 shadow-md p-6 rounded-lg">
            <b>Booking Details</b>
          </h1>

          <div className="mt-6 space-y-8">
            <div className="relative inline-block">
              <button
                onClick={() => setIsDriverModalOpen(true)}
                className={`h-8 px-4 mr-2 rounded-lg shadow-md transition relative left-[273px] 
    ${
      booking.vendorDriver?.id
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 text-white"
    }`}
                disabled={!!booking.vendorDriver?.id}
                title={
                  booking.vendorDriver?.id ? "Driver is already assigned" : ""
                }
              >
                Assign Driver
              </button>

              <button
                onClick={() => setIsCabModalOpen(true)}
                className={`h-8 px-4 rounded-lg shadow-md transition relative left-[54vh] 
    ${
      booking.vendorCab?.id
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-red-600 text-white"
    }`}
                disabled={!!booking.vendorCab?.id}
                title={booking.vendorCab?.id ? "Cab is already assigned" : ""}
              >
                Assign Cab
              </button>

              <div className="flex space-x-8">
                <div className="w-1/3">
                  <table className="border-collapse border border-gray-300">
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border font-semibold">
                          Booking Id
                        </td>
                        <td className="py-2 px-4 border">{booking.id}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border font-semibold">Name</td>
                        <td className="py-2 px-4 border">{booking.name}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border font-semibold">
                          Contact
                        </td>
                        <td className="py-2 px-4 border">{booking.phone}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border font-semibold">
                          Email
                        </td>
                        <td className="py-2 px-4 border">{booking.email}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border font-semibold">
                          PickUp Location
                        </td>
                        <td className="py-2 px-4 border">
                          {booking.userPickup}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border font-semibold">
                          Drop Location
                        </td>
                        <td className="py-2 px-4 border">{booking.userDrop}</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border font-semibold">
                          Trip Type
                        </td>
                        <td className="py-2 px-4 border">{booking.tripType}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Assigned Driver</h3>
                  {booking.vendorDriver ? (
                    <table className="border-collapse border border-gray-300 w-full">
                      <tbody>
                        <tr>
                          <td className="py-2 px-4 border font-semibold">
                            Driver ID
                          </td>
                          <td className="py-2 px-4 border">
                            {booking.vendorDriver.id}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border font-semibold">
                            Driver Name
                          </td>
                          <td className="py-2 px-4 border">
                            {booking.vendorDriver.driverName}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border font-semibold">
                            Contact No
                          </td>
                          <td className="py-2 px-4 border">
                            {booking.vendorDriver.contactNo}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <p>Driver not assigned yet</p>
                  )}
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Assigned Cab</h3>
                  {booking.vendorCab ? (
                    <table className="border-collapse border border-gray-300 w-full">
                      <tbody>
                        <tr>
                          <td className="py-2 px-4 border font-semibold">
                            Cab ID
                          </td>
                          <td className="py-2 px-4 border">
                            {booking.vendorCab.id}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border font-semibold">
                            Cab Name
                          </td>
                          <td className="py-2 px-4 border">
                            {booking.vendorCab.carName}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border font-semibold">
                            Plate No
                          </td>
                          <td className="py-2 px-4 border">
                            {booking.vendorCab.vehicleNo}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border font-semibold">
                            RC No
                          </td>
                          <td className="py-2 px-4 border">
                            {booking.vendorCab.rCNo}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border font-semibold">
                            Cab Details
                          </td>
                          <td className="py-2 px-4 border">
                            {booking.vendorCab.cabOtherDetails}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <p>Cab not assigned yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex ml-5 mb-20">
          <div className="flex space-x-4">
            <button className="h-8 px-4 bg-gray-600 text-white rounded-lg shadow-md transition">
              Show Detail
            </button>
            {booking.status !== 2 && (
              <button
                onClick={() => handleUpdateStatus(2)}
                className="h-8 px-4 bg-blue-600 text-white rounded-lg shadow-md transition"
              >
                Trip Complete
              </button>
            )}

            {booking.status !== 3 && (
              <button
                onClick={() => {
                  Swal.fire({
                    title: 'Cancel Booking',
                    text: cancellationMessage,
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, cancel it!',
                    cancelButtonText: 'No, keep it',
                  }).then((result) => {
                    if (result.isConfirmed) {
                      createPenalty(); // Apply fixed penalty of 2000
                      handleUpdateStatus1(5); // Assuming 3 is the status for cancelled
                    }
                  });
                }}
                className="h-8 px-4 bg-red-600 text-white rounded-lg shadow-md transition"
              >
                Cancel Booking
              </button>
            )}
            <button
              onClick={handleSendMail}
              className="h-8 px-4 bg-green-600 text-white rounded-lg shadow-md transition"
            >
              Send Mail
            </button>
          </div>

          {isPopupVisible && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg flex flex-col justify-between">
                <p className="text-center">Email sent successfully!</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {isDriverModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Select Driver</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border text-left">Driver ID</th>
                  <th className="py-2 px-4 border text-left">Driver Name</th>
                  <th className="py-2 px-4 border text-left">Contact No</th>
                  <th className="py-2 px-4 border text-left">Assign</th>
                </tr>
              </thead>
              <tbody>
                {drivers.length > 0 ? (
                  drivers.map((driver) => (
                    <tr
                      key={driver.id}
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => handleDriverSelect(driver)}
                    >
                      <td className="py-2 px-4 border">
                        {driver.vendorDriverId}
                      </td>
                      <td className="py-2 px-4 border">{driver.driverName}</td>
                      <td className="py-2 px-4 border">{driver.contactNo}</td>
                      <td>
                        <button
                          onClick={() => {
                            assignVendorDriver(driver.vendorDriverId);
                          }}
                          className="h-8 px-4 bg-green-600 text-white rounded-lg shadow-md transition"
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-2 px-4 border text-center">
                      No drivers available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsDriverModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isCabModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white w-1/3 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Select Cab</h3>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border text-left">Cab ID</th>
                  <th className="py-2 px-4 border text-left">Cab Name</th>
                  <th className="py-2 px-4 border text-left">Plate No</th>
                  <th className="py-2 px-4 border text-left">Assign</th>
                </tr>
              </thead>
              <tbody>
                {cabs.length > 0 ? (
                  cabs.map((cab) => (
                    <tr
                      key={cab.id}
                      className="cursor-pointer hover:bg-gray-200"
                      onClick={() => handleCabSelect(cab)}
                    >
                      <td className="py-2 px-4 border">{cab.vendorCabId}</td>
                      <td className="py-2 px-4 border">{cab.carName}</td>
                      <td className="py-2 px-4 border">{cab.vehicleNo}</td>
                      <td>
                        <button
                          onClick={() => {
                            assignVendorCab(cab.vendorCabId);
                          }}
                          className="h-8 px-4 bg-green-600 text-white rounded-lg shadow-md transition"
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="py-2 px-4 border text-center">
                      No cabs available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsCabModalOpen(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;