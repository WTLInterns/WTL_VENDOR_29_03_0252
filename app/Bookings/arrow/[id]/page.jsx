"use client";

import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

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

  const [modalCancel, setModalCancel] = useState(false);

  // Get vendor details from localStorage
  const vendor = JSON.parse(localStorage.getItem("vendor"));

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

  if (booking) {
    console.log(booking.time);
  } else {
    console.error("booking is undefined or null");
  }

  const createPenalty = async () => {
    try {
      if (!params.id || !vendorId) {
        alert("Booking ID or Vendor ID is missing!");
        return;
      }

      await axios.post(
        `http://localhost:8080/penalty/${params.id}/${vendorId}`
      );

      setModalCancel(false);
      alert("Penalty applied successfully!");
    } catch (error) {
      console.error("Error applying penalty:", error);
      alert(error.response?.data?.message || "Failed to apply penalty!");
      console.log(response.data);
    }
  };

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

  if (!booking) return <div>Loading...</div>;

  // Find assigned driver and cab based on IDs
  const driver = drivers.find(
    (driver) => driver.vendorDriverId === booking.vendorDriverId
  );
  const cab = cabs.find((cab) => cab.vendorCabId === booking.vendorCabId);

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

            {booking.status !== 1 && (
              <button
                // onClick={() => handleUpdateStatus(3)}
                onClick={() => setModalCancel(true)}
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

      {modalCancel && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-semibold mb-4">Cancel Booking</h2>
            <p className="text-sm text-gray-600 mb-4">
              Select a reason for cancellation:
            </p>

            {/* Radio Buttons for Cancellation Reasons */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="cancelReason"
                  value="Booking Change"
                  className="form-radio"
                />
                <span>Booking Change</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="cancelReason"
                  value="Pickup Late"
                  className="form-radio"
                />
                <span>Pickup Late</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="cancelReason"
                  value="Cab Change"
                  className="form-radio"
                />
                <span>Cab Change</span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setModalCancel(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Close
              </button>
              <button
                onClick={async () => {
                  try {
                    await createPenalty();
                    // If we get here, it was successful
                    handleUpdateStatus(3); // Update status to cancelled
                  } catch (error) {
                    // Error is already handled in createPenalty
                  }
                }}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

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
