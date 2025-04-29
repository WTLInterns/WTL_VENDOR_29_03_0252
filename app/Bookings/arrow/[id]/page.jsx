"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import Swal from "sweetalert2"
import Navbar from "@/app/components/Navbar"
import Sidebar from "@/app/components/Sidebar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react"

export default function page() {
  const params = useParams()
  const [isSidebarOpen, setSidebarOpen] = useState(true)
  const [isPopupVisible, setIsPopupVisible] = useState(false)
  const [booking, setBooking] = useState(null)
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false)
  const [isCabModalOpen, setIsCabModalOpen] = useState(false)
  const [drivers, setDrivers] = useState([])
  const [cabs, setCabs] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [selectedCab, setSelectedCab] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const[price,setPrice]=useState(0)

  // Get vendor details from localStorage
  const vendor = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("vendor")) : null

  const vendorId = vendor ? vendor.vendorId : null

  // Fetch booking details by ID
  const fetchBooking = async () => {
    try {
      const response = await axios.get(`https://api.worldtriplink.com/booking/${params.id}`)
      setBooking(response.data)
    } catch (error) {
      console.error("Error fetching booking:", error)
    }
  }

  // Fetch drivers when booking is loaded
  useEffect(() => {
    const fetchDrivers = async () => {
      if (booking && vendorId) {
        try {
          const response = await axios.get(`https://api.worldtriplink.com/${vendorId}/drivers`)
          setDrivers(response.data)
        } catch (error) {
          console.error("Error fetching drivers:", error)
        }
      }
    }

    fetchDrivers()
  }, [booking, vendorId])

  // Fetch cabs when vendorId is available
  useEffect(() => {
    const fetchCabs = async () => {
      if (vendorId) {
        try {
          const response = await axios.get(`https://api.worldtriplink.com/${vendorId}/cabs`)
          setCabs(response.data)
        } catch (error) {
          console.error("Error fetching cabs:", error)
        }
      }
    }

    fetchCabs()
  }, [vendorId])

  const handleSendMail = () => {
    setIsPopupVisible(true)
    setTimeout(() => {
      setIsPopupVisible(false)
    }, 1000)
  }

  const handleUpdateStatus = async (newStatus) => {
    try {
      const response = await axios.put(`https://api.worldtriplink.com/${params.id}/status`, { status: newStatus })
      setBooking(response.data)
      Swal.fire({
        title: "Success!",
        text: "Status updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      })
    } catch (error) {
      console.error("Error updating status:", error)
      Swal.fire({
        title: "Error!",
        text: "Failed to update status.",
        icon: "error",
        confirmButtonText: "OK",
      })
    }
  }

  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver)
    setIsDriverModalOpen(false)
  }

  const handleCabSelect = (cab) => {
    setSelectedCab(cab)
    setIsCabModalOpen(false)
  }

  // Assign the driver to the booking
  const assignVendorDriver = async (vendorDriverId) => {
    try {
      const response = await axios.put(`https://api.worldtriplink.com/${params.id}/assignVendorDriver/${vendorDriverId}`)
      Swal.fire({
        title: "Success!",
        text: "Driver assigned successfully!",
        icon: "success",
        confirmButtonText: "OK",
      })
      fetchBooking()
    } catch (error) {
      console.error("Error assigning driver:", error)
      Swal.fire({
        title: "Error!",
        text: "Failed to assign driver.",
        icon: "error",
        confirmButtonText: "OK",
      })
    }
  }

  // Assign the cab to the booking
  const assignVendorCab = async (vendorCabId) => {
    try {
      const response = await axios.put(`https://api.worldtriplink.com/${params.id}/assignVendorCab/${vendorCabId}`)
      Swal.fire({
        title: "Success!",
        text: "Cab assigned successfully!",
        icon: "success",
        confirmButtonText: "OK",
      })
      fetchBooking()
    } catch (error) {
      console.error("Error assigning cab:", error)
      Swal.fire({
        title: "Error!",
        text: "Failed to assign cab.",
        icon: "error",
        confirmButtonText: "OK",
      })
    }
  }

  useEffect(() => {
    if (params.id) {
      fetchBooking()
    }
  }, [params.id])

  const createPenalty = async () => {
    setIsLoading(true)
    try {
      // Get current time
      const date = new Date()
      const hours = date.getHours().toString().padStart(2, "0")
      const minutes = date.getMinutes().toString().padStart(2, "0")
      const currentTime = `${hours}:${minutes}`

      await axios.post(
        `https://api.worldtriplink.com/penalty/${params.id}/${vendorId}`,
        { amount: price, time: currentTime },
        { headers: { "Content-Type": "application/json" } },
      )

      Swal.fire("Cancelled!", "Your booking has been cancelled.", "success")
    } catch (error) {
      console.error("Error occurred", error)
      Swal.fire("Error", "Failed to cancel booking.", "error")
    } finally {
      setIsLoading(false)
    }
  }

  if (!booking)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading booking details...</span>
      </div>
    )

  // Get current date in YYYY-MM-DD format
  const date = new Date()
  const yy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  const currentDate = `${yy}-${mm}-${dd}`

  // Get current time in HH:MM format
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")
  const currentTime = `${hours}:${minutes}`

  // Check if booking date is today
  const isBookingDateToday = booking?.startDate === currentDate

  let cancellationMessage = ""
  let isCancelButtonDisabled = false
  let timeDifferenceMinutes = 0

  if (!booking) {
    cancellationMessage = "No booking found."
    // price=0;
  } else {
    if (isBookingDateToday) {
      // If booking is today, check the time difference
      const [bookingHours, bookingMinutes] = booking.time.split(":").map(Number)
      const [currentHours, currentMinutes] = currentTime.split(":").map(Number)

      // Convert both times to minutes for easier comparison
      const bookingTotalMinutes = bookingHours * 60 + bookingMinutes
      const currentTotalMinutes = currentHours * 60 + currentMinutes

      // Calculate time difference in minutes
      timeDifferenceMinutes = bookingTotalMinutes - currentTotalMinutes

      if (timeDifferenceMinutes < 60 && timeDifferenceMinutes > 0) {
        // Less than 1 hour before booking time
        cancellationMessage =
          "Penalty applies: You are able to cancel the booking, but you have to pay a cancellation fine of 2000."
          // price=2000;
      } else if (timeDifferenceMinutes <= 0) {
        // Booking time has passed or is in progress
        cancellationMessage = "Trip is complete, you can't cancel."
        isCancelButtonDisabled = true // Disable the cancel button
      } else {
        // More than 1 hour before booking time
        cancellationMessage = "Cancel is applicable: You are able to cancel the booking without penalty."
        // price=0;
      }
    } else if (booking.startDate < currentDate) {
      // Booking is in the past
      cancellationMessage = "Trip is complete, you can't cancel."
      isCancelButtonDisabled = true // Disable the cancel button
    } else {
      // Booking is in the future
      cancellationMessage = "Cancel is applicable: You are able to cancel the booking without penalty."
      // price=0;
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} /> */}
      <div className={`flex-1 flex flex-col transition-all ${isSidebarOpen ? "" : ""}`}>
        <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

        <div className="flex-1 overflow-auto p-6 pt-16 dark:bg-black">
          <Card className="mx-auto max-w-4xl shadow-lg">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-center mb-6">Booking Details</h1>

              {/* Main content area with 3 accordions */}
              <div className="space-y-6">
                {/* Booking Details Accordion */}
                <Accordion type="single" collapsible defaultValue="booking-details">
                  <AccordionItem value="booking-details">
                    <AccordionTrigger className="bg-primary text-primary-foreground px-4 py-2 rounded-t-lg">
                      Booking Information
                    </AccordionTrigger>
                    <AccordionContent className="border border-t-0 border-gray-200 rounded-b-lg p-4">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <tbody>
                            <tr>
                              <td className="py-2 px-4 border font-semibold">Booking Id</td>
                              <td className="py-2 px-4 border">{booking.bookingId}</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-4 border font-semibold">Name</td>
                              <td className="py-2 px-4 border">{booking.name}</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-4 border font-semibold">Contact</td>
                              <td className="py-2 px-4 border">{booking.phone}</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-4 border font-semibold">Email</td>
                              <td className="py-2 px-4 border">{booking.email}</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-4 border font-semibold">PickUp Location</td>
                              <td className="py-2 px-4 border">{booking.userPickup}</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-4 border font-semibold">Drop Location</td>
                              <td className="py-2 px-4 border">{booking.userDrop}</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-4 border font-semibold">Trip Type</td>
                              <td className="py-2 px-4 border">
                                {booking.tripType
                                  ? booking.tripType.replace(/[- ]/g, "").replace(/^./, (match) => match.toUpperCase())
                                  : ""}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Assign Driver Accordion */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="assign-driver">
                    <AccordionTrigger className="bg-blue-600 text-white px-4 py-2 rounded-t-lg">
                      Assign Driver
                    </AccordionTrigger>
                    <AccordionContent className="border border-t-0 border-gray-200 rounded-b-lg p-4">
                      {booking.vendorDriver ? (
                        <div>
                          <h3 className="font-semibold mb-2">Assigned Driver Details</h3>
                          <table className="w-full border-collapse">
                            <tbody>
                              <tr>
                                <td className="py-2 px-4 border font-semibold">Driver ID</td>
                                <td className="py-2 px-4 border">{booking.vendorDriver.id}</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-4 border font-semibold">Driver Name</td>
                                <td className="py-2 px-4 border">{booking.vendorDriver.driverName}</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-4 border font-semibold">Contact No</td>
                                <td className="py-2 px-4 border">{booking.vendorDriver.contactNo}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-gray-600 mb-4">No driver assigned yet</p>
                          <Button onClick={() => setIsDriverModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                            Assign Driver
                          </Button>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Assign Cab Accordion */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="assign-cab">
                    <AccordionTrigger className="bg-red-600 text-white px-4 py-2 rounded-t-lg">
                      Assign Cab
                    </AccordionTrigger>
                    <AccordionContent className="border border-t-0 border-gray-200 rounded-b-lg p-4">
                      {booking.vendorCab ? (
                        <div>
                          <h3 className="font-semibold mb-2">Assigned Cab Details</h3>
                          <table className="w-full border-collapse">
                            <tbody>
                              <tr>
                                <td className="py-2 px-4 border font-semibold">Cab ID</td>
                                <td className="py-2 px-4 border">{booking.vendorCab.id}</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-4 border font-semibold">Cab Name</td>
                                <td className="py-2 px-4 border">{booking.vendorCab.carName}</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-4 border font-semibold">Plate No</td>
                                <td className="py-2 px-4 border">{booking.vendorCab.vehicleNo}</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-4 border font-semibold">RC No</td>
                                <td className="py-2 px-4 border">{booking.vendorCab.rCNo}</td>
                              </tr>
                              <tr>
                                <td className="py-2 px-4 border font-semibold">Cab Details</td>
                                <td className="py-2 px-4 border">{booking.vendorCab.cabOtherDetails}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-gray-600 mb-4">No cab assigned yet</p>
                          <Button onClick={() => setIsCabModalOpen(true)} className="bg-red-600 hover:bg-red-700">
                            Assign Cab
                          </Button>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 mt-8">
                <Button variant="secondary">Show Detail</Button>

                {booking.status !== 2 && booking.status !== 5 && (
                  <Button onClick={() => handleUpdateStatus(2)} className="bg-blue-600 hover:bg-blue-700">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Trip Complete
                  </Button>
                )}

                {booking.status !== 3  && (
                  <Button
                    onClick={() => {
                      Swal.fire({
                        title: "Cancel Booking",
                        text: cancellationMessage,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Yes, cancel it!",
                        cancelButtonText: "No, keep it",
                      }).then((result) => {
                        if (result.isConfirmed) {
                          createPenalty()
                          handleUpdateStatus(5)
                        }
                      })
                    }}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isCancelButtonDisabled || booking.status === 5}
                    >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Booking
                  </Button>
                )}

                <Button onClick={handleSendMail} className="bg-green-600 hover:bg-green-700">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Mail
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Email Sent Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white w-80 p-6 rounded-lg shadow-lg">
            <div className="flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-500 mr-2" />
              <p className="text-center text-lg">Email sent successfully!</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col items-center">
              {/* Car Loader SVG Animation */}
              <svg width="200" height="100" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
                <style>
                  {`
                @keyframes drive {
                  from { transform: translateX(-50%); }
                  to { transform: translateX(150%); }
                }
                @keyframes wheelRotate {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes blink {
                  0%, 100% { opacity: 0.5; }
                  50% { opacity: 1; }
                }
                @keyframes fadeInOut {
                  0%, 100% { opacity: 0; }
                  50% { opacity: 1; }
                }
                .car {
                  animation: drive 3s linear infinite;
                }
                .wheel {
                  animation: wheelRotate 1s linear infinite;
                  transform-origin: center;
                }
                .headlight {
                  animation: blink 1s ease-in-out infinite;
                }
                .motion-line {
                  animation: fadeInOut 1.5s ease-in-out infinite;
                }
                .motion-line:nth-child(2) {
                  animation-delay: 0.2s;
                }
                .motion-line:nth-child(3) {
                  animation-delay: 0.4s;
                }
                .motion-line:nth-child(4) {
                  animation-delay: 0.6s;
                }
              `}
                </style>

                {/* Road */}
                <rect x="0" y="85" width="200" height="5" fill="#333" />

                {/* Car Group with Animation */}
                <g className="car">
                  {/* Motion Lines */}
                  <g>
                    <rect className="motion-line" x="0" y="40" width="30" height="4" rx="2" fill="#000" />
                    <rect className="motion-line" x="5" y="50" width="20" height="4" rx="2" fill="#000" />
                    <rect className="motion-line" x="2" y="60" width="25" height="4" rx="2" fill="#000" />
                    <rect className="motion-line" x="10" y="70" width="15" height="4" rx="2" fill="#000" />
                  </g>

                  {/* Car Body */}
                  <path
                    d="M10 80 L10 60 C10 53 16 50 20 50 L50 50 C60 50 63 53 65 55 L80 55 C85 55 90 60 90 65 L90 80 Z"
                    fill="#6366f1"
                    stroke="#000"
                    strokeWidth="3"
                  />

                  {/* Car Roof */}
                  <path d="M20 50 L25 30 L55 30 L60 50" fill="#000" stroke="#000" strokeWidth="3" />

                  {/* Windows */}
                  <path d="M25 30 L28 50 L40 50 L40 30 Z" fill="#7dd3fc" stroke="#000" strokeWidth="1.5" />
                  <path d="M40 30 L40 50 L50 50 L53 30 Z" fill="#7dd3fc" stroke="#000" strokeWidth="1.5" />

                  {/* Car Door */}
                  <line x1="40" y1="50" x2="40" y2="80" stroke="#000" strokeWidth="1.5" />
                  <rect x="25" y="60" width="6" height="3" rx="1.5" fill="#000" />
                  <rect x="45" y="60" width="6" height="3" rx="1.5" fill="#000" />

                  {/* Wheels with Animation */}
                  <g transform="translate(25, 80)">
                    <circle className="wheel" cx="0" cy="0" r="10" fill="#4b5563" stroke="#000" strokeWidth="3" />
                    <circle cx="0" cy="0" r="3" fill="#e5e7eb" stroke="#000" strokeWidth="1" />
                  </g>

                  <g transform="translate(75, 80)">
                    <circle className="wheel" cx="0" cy="0" r="10" fill="#4b5563" stroke="#000" strokeWidth="3" />
                    <circle cx="0" cy="0" r="3" fill="#e5e7eb" stroke="#000" strokeWidth="1" />
                  </g>

                  {/* Bumpers */}
                  <rect x="8" y="80" width="84" height="4" rx="2" fill="#000" />

                  {/* Headlight */}
                  <rect className="headlight" x="90" y="65" width="5" height="5" rx="1" fill="#7dd3fc" />
                </g>
              </svg>
              <p className="mt-4 text-lg font-semibold">Cancelling Booking...</p>
            </div>
          </div>
        </div>
      )}

      {/* Driver Selection Modal */}
      {isDriverModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Select Driver</h3>
            <div className="max-h-96 overflow-y-auto">
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
                      <tr key={driver.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border">{driver.vendorDriverId}</td>
                        <td className="py-2 px-4 border">{driver.driverName}</td>
                        <td className="py-2 px-4 border">{driver.contactNo}</td>
                        <td className="py-2 px-4 border">
                          <Button
                            onClick={() => {
                              assignVendorDriver(driver.vendorDriverId)
                              setIsDriverModalOpen(false)
                            }}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Assign
                          </Button>
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
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setIsDriverModalOpen(false)} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Cab Selection Modal */}
      {isCabModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Select Cab</h3>
            <div className="max-h-96 overflow-y-auto">
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
                      <tr key={cab.id} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border">{cab.vendorCabId}</td>
                        <td className="py-2 px-4 border">{cab.carName}</td>
                        <td className="py-2 px-4 border">{cab.vehicleNo}</td>
                        <td className="py-2 px-4 border">
                          <Button
                            onClick={() => {
                              assignVendorCab(cab.vendorCabId)
                              setIsCabModalOpen(false)
                            }}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Assign
                          </Button>
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
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => setIsCabModalOpen(false)} variant="outline">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

