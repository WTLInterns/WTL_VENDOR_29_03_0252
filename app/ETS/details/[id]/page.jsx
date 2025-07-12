"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import Swal from "sweetalert2"
// import Navbar from "@/app/components/Navbar"
// import Sidebar from "@/app/components/Sidebar"
// import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
// import { Button } from "@/components/ui/button"
// import { Card } from "@/components/ui/card"
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react"
import Navbar from "@/app/components/Navbar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@radix-ui/react-accordion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

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
  const [isDriverAssigning, setIsDriverAssigning] = useState(false)
  const [isCabAssigning, setIsCabAssigning] = useState(false)
  const[price,setPrice]=useState(0)
  const [currentLanguage, setCurrentLanguage] = useState('en') // 'en' for English, 'hi' for Hindi

  // Add CSS for enhanced SweetAlert popup with Hindi font support
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

      .swal-wide {
        width: 750px !important;
        max-width: 95vw !important;
        border-radius: 16px !important;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
      }

      .swal-wide .swal2-html-container {
        text-align: left !important;
        font-size: 14px !important;
        line-height: 1.6 !important;
        max-height: 450px !important;
        overflow-y: auto !important;
        padding: 0 !important;
        font-family: 'Inter', 'Noto Sans Devanagari', sans-serif !important;
      }

      .swal-wide .swal2-title {
        font-size: 22px !important;
        margin-bottom: 20px !important;
        font-weight: 700 !important;
        color: #dc2626 !important;
        font-family: 'Inter', 'Noto Sans Devanagari', sans-serif !important;
      }

      .swal-wide .swal2-actions {
        margin-top: 20px !important;
      }

      .language-toggle-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        border: none !important;
        color: white !important;
        padding: 8px 16px !important;
        border-radius: 20px !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        margin-right: 10px !important;
        font-family: 'Inter', 'Noto Sans Devanagari', sans-serif !important;
      }

      .language-toggle-btn:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4) !important;
      }

      .error-box {
        background: linear-gradient(135deg, #fef2f2 0%, #fdf2f8 100%) !important;
        border: 2px solid transparent !important;
        background-clip: padding-box !important;
        border-radius: 12px !important;
        padding: 16px !important;
        margin-bottom: 16px !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        position: relative !important;
        overflow: hidden !important;
      }

      .error-box::before {
        content: '' !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        height: 4px !important;
        background: linear-gradient(90deg, #ef4444, #f97316, #eab308) !important;
      }

      .suggestion-box {
        background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%) !important;
        border-left: 4px solid #3b82f6 !important;
        border-radius: 8px !important;
        padding: 12px !important;
        margin-top: 12px !important;
        box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1) !important;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  // Comprehensive translation system
  const translations = {
    en: {
      driverAssignmentFailed: "Driver Assignment Failed!",
      overallMessage: "Driver assignment failed for all dates",
      failedDates: "Failed dates",
      suggestions: "Suggestions",
      ok: "OK",
      switchToHindi: "हिंदी",
      routeConflict: "Route conflicts with existing booking",
      existingRoute: "Existing route",
      networkError: "Failed to assign driver. Please check your connection and try again.",
      genericError: "Failed to assign driver.",
      errorCodes: {
        ROUTE_OVERLAP: "Route conflicts with existing booking",
        DRIVER_UNAVAILABLE: "Driver is not available",
        TIME_CONFLICT: "Time slot conflict detected",
        INVALID_ROUTE: "Invalid route specified"
      },
      commonSuggestions: {
        "Try a different pickup time": "Try a different pickup time",
        "Choose a pickup location closer to the existing route": "Choose a pickup location closer to the existing route",
        "Select a different driver for this route": "Select a different driver for this route",
        "Contact support for assistance": "Contact support for assistance",
        "Check driver availability": "Check driver availability"
      },
      success: {
        title: "Success!",
        driverAssigned: "Driver assigned successfully!",
        cabAssigned: "Cab assigned successfully!",
        confirmButtonText: "OK"
      },
      loading: {
        assigningDriver: "Assigning Driver...",
        assigningCab: "Assigning Cab...",
        pleaseWait: "Please wait while we process your request"
      }
    },
    hi: {
      driverAssignmentFailed: "ड्राइवर असाइनमेंट असफल!",
      overallMessage: "सभी तारीखों के लिए ड्राइवर असाइनमेंट असफल",
      failedDates: "असफल तारीखें",
      suggestions: "सुझाव",
      ok: "ठीक है",
      switchToHindi: "English",
      routeConflict: "मौजूदा बुकिंग के साथ रूट का टकराव",
      existingRoute: "मौजूदा रूट",
      networkError: "ड्राइवर असाइन करने में असफल। कृपया अपना कनेक्शन जांचें और पुनः प्रयास करें।",
      genericError: "ड्राइवर असाइन करने में असफल।",
      errorCodes: {
        ROUTE_OVERLAP: "मौजूदा बुकिंग के साथ रूट का टकराव",
        DRIVER_UNAVAILABLE: "ड्राइवर उपलब्ध नहीं है",
        TIME_CONFLICT: "समय स्लॉट का टकराव पाया गया",
        INVALID_ROUTE: "अमान्य रूट निर्दिष्ट"
      },
      commonSuggestions: {
        "Try a different pickup time": "एक अलग पिकअप समय का प्रयास करें",
        "Choose a pickup location closer to the existing route": "मौजूदा रूट के करीब एक पिकअप स्थान चुनें",
        "Select a different driver for this route": "इस रूट के लिए एक अलग ड्राइवर चुनें",
        "Contact support for assistance": "सहायता के लिए सपोर्ट से संपर्क करें",
        "Check driver availability": "ड्राइवर की उपलब्धता जांचें"
      },
      success: {
        title: "सफलता!",
        driverAssigned: "ड्राइवर सफलतापूर्वक असाइन किया गया!",
        cabAssigned: "कैब सफलतापूर्वक असाइन की गई!",
        confirmButtonText: "ठीक है"
      },
      loading: {
        assigningDriver: "ड्राइवर असाइन कर रहे हैं...",
        assigningCab: "कैब असाइन कर रहे हैं...",
        pleaseWait: "कृपया प्रतीक्षा करें जब तक हम आपके अनुरोध को प्रोसेस करते हैं"
      }
    }
  }

  // Get current translations
  const t = translations[currentLanguage]

  // Get vendor details from localStorage
  const vendor = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("vendor")) : null

  const vendorId = vendor ? vendor.vendorId : null

  // Fetch booking details by ID
  const fetchBooking = async () => {
    try {
      const response = await axios.get(`https://ets.worldtriplink.com/schedule/getId/${params.id}`)
      setBooking(response.data)
      console.log(booking);
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
    setIsDriverAssigning(true)
    try {
      const response = await axios.put(`https://ets.worldtriplink.com/schedule/${params.id}/assignDriver/${vendorDriverId}`)

      // Success message with language support
      Swal.fire({
        title: t.success.title,
        text: t.success.driverAssigned,
        icon: "success",
        confirmButtonText: t.success.confirmButtonText,
      })
      fetchBooking()
    } catch (error) {
      console.error("Error assigning driver:", error)

      // Check if error response contains detailed failure information
      if (error.response && error.response.data) {
        const errorData = error.response.data

        // Check if it's a driver assignment failure with multiple dates
        if (!errorData.overallSuccess && errorData.dateResults) {
          // Function to create enhanced error display with language support
          const createEnhancedErrorDisplay = (language) => {
            const currentT = translations[language]

            let htmlContent = `
              <div style="font-family: 'Inter', 'Noto Sans Devanagari', sans-serif; text-align: ${language === 'hi' ? 'left' : 'left'};">
                <!-- Language Toggle Button -->
                <div style="text-align: right; margin-bottom: 20px;">
                  <button class="language-toggle-btn" onclick="window.toggleLanguage()">
                    🌐 ${currentT.switchToHindi}
                  </button>
                </div>

                <!-- Main Error Message -->
                <div style="
                  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
                  border-radius: 12px;
                  padding: 16px;
                  margin-bottom: 20px;
                  border-left: 6px solid #dc2626;
                  box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.1);
                ">
                  <div style="
                    font-weight: 700;
                    color: #991b1b;
                    font-size: 16px;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                  ">
                    🚫 ${errorData.overallMessage || currentT.overallMessage}
                  </div>
                </div>
            `

            // Add failed dates summary
            if (errorData.failedDates && errorData.failedDates.length > 0) {
              htmlContent += `
                <div style="
                  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                  border-radius: 8px;
                  padding: 12px;
                  margin-bottom: 20px;
                  border-left: 4px solid #6b7280;
                ">
                  <div style="
                    font-weight: 600;
                    color: #374151;
                    font-size: 14px;
                    margin-bottom: 8px;
                  ">
                    📊 ${currentT.failedDates}: ${errorData.failedDates.join(", ")}
                  </div>
                </div>
              `

              // Create individual enhanced boxes for each failed date
              errorData.failedDates.forEach((date, index) => {
                const dateResult = errorData.dateResults[date]
                if (dateResult && dateResult.message) {
                  // Translate the error message
                  let translatedMessage = dateResult.message
                  if (language === 'hi') {
                    // Basic translation for route conflict messages
                    translatedMessage = translatedMessage
                      .replace(/Route conflicts with existing booking on/g, `${currentT.routeConflict} दिनांक`)
                      .replace(/Existing route:/g, `${currentT.existingRoute}:`)
                  }

                  htmlContent += `
                    <div class="error-box" style="
                      animation: slideInUp 0.${index + 3}s ease-out;
                      transform: translateY(0);
                    ">
                      <div style="
                        font-weight: 700;
                        color: #dc2626;
                        margin-bottom: 12px;
                        font-size: 15px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                      ">
                        <span style="
                          background: linear-gradient(135deg, #dc2626, #ef4444);
                          color: white;
                          padding: 4px 8px;
                          border-radius: 6px;
                          font-size: 12px;
                        ">
                          ${index + 1}
                        </span>
                        📅 ${date}
                      </div>

                      <div style="
                        color: #374151;
                        margin-bottom: 12px;
                        line-height: 1.6;
                        font-size: 14px;
                        background: rgba(255, 255, 255, 0.7);
                        padding: 12px;
                        border-radius: 8px;
                        border-left: 3px solid #f59e0b;
                      ">
                        ⚠️ ${translatedMessage}
                      </div>
                  `

                  // Add suggestions if available
                  if (dateResult.suggestions && dateResult.suggestions.length > 0) {
                    htmlContent += `
                      <div class="suggestion-box">
                        <div style="
                          font-weight: 600;
                          color: #1e40af;
                          margin-bottom: 8px;
                          font-size: 13px;
                          display: flex;
                          align-items: center;
                          gap: 6px;
                        ">
                          💡 ${currentT.suggestions}:
                        </div>
                        <ul style="
                          margin: 0;
                          padding-left: 20px;
                          color: #1e40af;
                          font-size: 13px;
                          line-height: 1.5;
                        ">
                    `

                    dateResult.suggestions.forEach(suggestion => {
                      // Translate suggestions
                      const translatedSuggestion = language === 'hi'
                        ? (currentT.commonSuggestions[suggestion] || suggestion)
                        : suggestion

                      htmlContent += `
                        <li style="
                          margin-bottom: 4px;
                          padding: 2px 0;
                        ">
                          ✨ ${translatedSuggestion}
                        </li>
                      `
                    })

                    htmlContent += `
                        </ul>
                      </div>
                    `
                  }

                  htmlContent += `</div>`
                }
              })
            }

            htmlContent += `</div>`
            return htmlContent
          }

          // Create the initial display
          const initialContent = createEnhancedErrorDisplay(currentLanguage)

          // Add global function for language toggle
          window.toggleLanguage = () => {
            const newLanguage = currentLanguage === 'en' ? 'hi' : 'en'
            setCurrentLanguage(newLanguage)

            // Update the popup content
            const newContent = createEnhancedErrorDisplay(newLanguage)
            const popup = Swal.getPopup()
            if (popup) {
              const htmlContainer = popup.querySelector('.swal2-html-container')
              if (htmlContainer) {
                htmlContainer.innerHTML = newContent
              }
            }
          }

          Swal.fire({
            title: t.driverAssignmentFailed,
            html: initialContent,
            icon: "error",
            confirmButtonText: t.ok,
            customClass: {
              popup: 'swal-wide'
            },
            didOpen: () => {
              // Add animation styles
              const style = document.createElement('style')
              style.textContent = `
                @keyframes slideInUp {
                  from {
                    opacity: 0;
                    transform: translateY(20px);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `
              document.head.appendChild(style)
            }
          })
        } else {
          // Handle other types of errors with language support
          const errorMessage = errorData.message || errorData.overallMessage || t.genericError
          Swal.fire({
            title: t.driverAssignmentFailed,
            text: errorMessage,
            icon: "error",
            confirmButtonText: t.ok,
          })
        }
      } else {
        // Fallback for network or other errors with language support
        Swal.fire({
          title: t.driverAssignmentFailed,
          text: t.networkError,
          icon: "error",
          confirmButtonText: t.ok,
        })
      }
    } finally {
      setIsDriverAssigning(false)
    }
  }

  // Assign the cab to the booking
  const assignVendorCab = async (vendorCabId) => {
    setIsCabAssigning(true)
    try {
      const response = await axios.put(`https://ets.worldtriplink.com/schedule/assignCab/${params.id}/${vendorCabId}`)
      Swal.fire({
        title: t.success.title,
        text: t.success.cabAssigned,
        icon: "success",
        confirmButtonText: t.success.confirmButtonText,
      })
      fetchBooking()
    } catch (error) {
      console.error("Error assigning cab:", error)
      Swal.fire({
        title: t.driverAssignmentFailed,
        text: t.genericError.replace("driver", "cab"),
        icon: "error",
        confirmButtonText: t.ok,
      })
    } finally {
      setIsCabAssigning(false)
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
                              <td className="py-2 px-4 border">{booking.user.userName +" "+booking.user.lastName}</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-4 border font-semibold">Contact</td>
                              <td className="py-2 px-4 border">{booking.user.phone}</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-4 border font-semibold">Email</td>
                              <td className="py-2 px-4 border">{booking.user.email}</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-4 border font-semibold">PickUp Location</td>
                              <td className="py-2 px-4 border">{booking.pickUpLocation}</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-4 border font-semibold">Drop Location</td>
                              <td className="py-2 px-4 border">{booking.dropLocation}</td>
                            </tr>
                            <tr>
                              <td className="py-2 px-4 border font-semibold">Trip Type</td>
                              <td className="py-2 px-4 border">
                                {booking.bookingType
                                  ? booking.bookingType.replace(/[- ]/g, "").replace(/^./, (match) => match.toUpperCase())
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
                          <Button
                            onClick={() => setIsDriverModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-700"
                            disabled={isDriverAssigning}
                          >
                            {isDriverAssigning ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t.loading.assigningDriver}
                              </>
                            ) : (
                              "Assign Driver"
                            )}
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
                          <Button
                            onClick={() => setIsCabModalOpen(true)}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isCabAssigning}
                          >
                            {isCabAssigning ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {t.loading.assigningCab}
                              </>
                            ) : (
                              "Assign Cab"
                            )}
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

      {/* Enhanced Loading Overlay for Assignment Operations */}
      {(isLoading || isDriverAssigning || isCabAssigning) && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-black/60 to-black/80 backdrop-blur-sm z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4">
            <div className="flex flex-col items-center">
              {/* Enhanced Loading Animation */}
              <div className="relative mb-6">
                {/* Outer rotating ring */}
                <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                {/* Inner pulsing circle */}
                <div className="absolute inset-2 w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse flex items-center justify-center">
                  {isDriverAssigning ? (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  ) : isCabAssigning ? (
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  )}
                </div>
              </div>

              {/* Dynamic Loading Text */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: "'Inter', 'Noto Sans Devanagari', sans-serif" }}>
                  {isDriverAssigning ? t.loading.assigningDriver :
                   isCabAssigning ? t.loading.assigningCab :
                   "Processing..."}
                </h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: "'Inter', 'Noto Sans Devanagari', sans-serif" }}>
                  {t.loading.pleaseWait}
                </p>
              </div>

              {/* Progress Dots */}
              <div className="flex space-x-2 mt-4">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Original Cancellation Loading Overlay */}
      {isLoading && !isDriverAssigning && !isCabAssigning && (
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
                            disabled={isDriverAssigning}
                          >
                            {isDriverAssigning ? (
                              <>
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                Assigning...
                              </>
                            ) : (
                              "Assign"
                            )}
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
                            disabled={isCabAssigning}
                          >
                            {isCabAssigning ? (
                              <>
                                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                Assigning...
                              </>
                            ) : (
                              "Assign"
                            )}
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

