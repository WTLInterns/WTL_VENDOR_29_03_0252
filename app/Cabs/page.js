"use client";
import { useEffect, useState } from "react";
import { FaArrowRight, FaTimes, FaSpinner } from "react-icons/fa"; // ✅ ADD: FaSpinner import
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import axios from "axios"; // Import axios
import { useRouter } from "next/navigation";

const Cabs = () => {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ ADD: Loading state

  const route = useRouter();
  const [formData, setFormData] = useState({
    carName: "",
    rCNo: "",
    vehicleNo: "",
    cabOtherDetails: "",
    rCImage: null,
    vehicleNoImage: null,
    insuranceImage: null,
    permitImage: null,
    authorizationImage: null,
    cabNoPlateImage: null,
    cabImage: null,
    cabFrontImage: null,
    cabBackImage: null,
    cabSideImage: null,
  });

  const vendor = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("vendor")) : null;

  // Ensure vendor data exists in localStorage before proceeding
  if (!vendor) {
    console.error("Vendor not found in localStorage");
    // Optionally handle the case when vendor is not found, like redirecting the user
  }

  const email = vendor ? vendor.email : null;
  const vendorId = vendor ? vendor.vendorId : null;

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0],
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // For RC Number and Vehicle Number, convert to uppercase
    if (name === "rCNo" || name === "vehicleNo") {
      const uppercaseValue = value.toUpperCase();

      // Format the input as user types (optional)
      const formattedValue = uppercaseValue;

      setFormData((prevData) => ({
        ...prevData,
        [name]: formattedValue,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // ✅ UPDATED: Handle submit with loading state
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ START: Set loading to true when submission starts
    setIsLoading(true);

    const form = new FormData();

    // Append all form fields to the FormData
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        form.append(key, formData[key]);
      }
    });

    try {
      const response = await axios.post(
        `http://localhost:8080/addVendorCab/${vendorId}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ SUCCESS: Stop loading and show success message
      console.log("Vehicle added successfully:", response.data);
      alert("Vehicle added successfully!");
      setShowForm(false);
      
      // ✅ OPTIONAL: Reset form data on success
      setFormData({
        carName: "",
        rCNo: "",
        vehicleNo: "",
        cabOtherDetails: "",
        rCImage: null,
        vehicleNoImage: null,
        insuranceImage: null,
        permitImage: null,
        authorizationImage: null,
        cabNoPlateImage: null,
        cabImage: null,
        cabFrontImage: null,
        cabBackImage: null,
        cabSideImage: null,
      });
      
    } catch (error) {
      // ✅ ERROR: Stop loading and show error message
      console.error("Error adding vehicle:", error);
      alert("Error adding vehicle. Please try again.");
    } finally {
      // ✅ FINALLY: Always stop loading regardless of success/error
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      carName: "",
      rCNo: "",
      vehicleNo: "",
      cabOtherDetails: "",
      rCImage: null,
      vehicleNoImage: null,
      insuranceImage: null,
      permitImage: null,
      authorizationImage: null,
      cabNoPlateImage: null,
      cabImage: null,
      cabFrontImage: null,
      cabBackImage: null,
      cabSideImage: null,
    });
  };

  const [cabs, setCabs] = useState([]);

  useEffect(() => {
    const fetchCabs = async () => {
      try {
        if (vendorId) {
          const response = await axios.get(
            `https://api.worldtriplink.com/${vendorId}/cabs`
          );
          setCabs(response.data); // Set fetched cabs data
        }
      } catch (error) {
        console.error("Error fetching cabs data:", error);
      }
    };

    fetchCabs(); // Call the fetch function
  }, [vendorId]);
  
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 md:ml-64 lg:ml-64 bg-gray-100 min-h-screen  dark:bg-black">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="p-6 pt-20">
          {/* Header Section */}
          <div className="bg-gray-200 p-4 flex items-center justify-between rounded-lg shadow dark:bg-[#ECDCBF] dark:text-black">
            <h2 className="font-semibold text-lg flex items-center">
              <span className="mr-2">🚖</span> All Cabs Details
            </h2>
            <button
              onClick={toggleForm}
              className="border p-3 rounded-md bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-white font-semibold transition duration-300 ease-in-out dark:bg-red-600 dark:text-white"
            >
              + Add Vehicle
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {/* Card 1 */}
            <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md dark:bg-[#ded9df] dark:text-white">
              <img
                src="https://imgd.aeplcdn.com/600x337/n/cw/ec/159099/swift-exterior-right-front-three-quarter.jpeg?isig=0&q=80"
                alt="Hatchback"
                className="w-full h-45  mb-2 rounded-md md:object-contain"
              />
              <h3 className="font-semibold text-lg dark:text-black">Hatchback</h3>
              <p className="text-sm text-gray-600">4+1 Seater</p>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md dark:bg-[#ded9df] dark:text-white">
              <img
                src="https://imgd.aeplcdn.com/600x337/n/cw/ec/127563/alto-k10-exterior-right-front-three-quarter-58.jpeg?isig=0&q=80"
                alt="Sedan"
                className="w-full h-45  mb-2 rounded-md md:object-contain"
              />
              <h3 className="font-semibold text-lg dark:text-black">Sedan</h3>
              <p className="text-sm text-gray-600">4+1 Seater</p>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md dark:bg-[#ded9df] dark:text-white">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8l-ScnpWkIhxbxk_IbShOPh9opks7jOyLJQ&s"
                alt="SUV"
                className="w-full h-45  mb-2 rounded-md md:object-contain"
              />
              <h3 className="font-semibold text-lg dark:text-black">SUV</h3>
              <p className="text-sm text-gray-600">6+1 Seater</p>
            </div>

            {/* Card 4 */}
            <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md dark:bg-[#ded9df] dark:text-white">
              <img
                src="https://imgd-ct.aeplcdn.com/664x374/n/cw/ec/41160/tigor-exterior-right-front-three-quarter-21.jpeg?isig=0&q=80"
                alt="SUV+"
                className="w-full h-45  mb-2 rounded-md md:object-contain"
              />
              <h3 className="font-semibold text-lg dark:text-black">SUV+</h3>
              <p className="text-sm text-gray-600">6+1 Seater</p>
            </div>
          </div>

          {/* Status Buttons */}
          <div className="flex space-x-4 mt-6 relative sm:left-8 lg:left-8">
            <button className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center shadow-sm">
              Pending{" "}
              <span className="ml-2 bg-white text-black px-2 py-0.5 rounded">
                0
              </span>
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded flex items-center shadow-sm">
              Approved{" "}
              <span className="ml-2 bg-white text-black px-2 py-0.5 rounded">
                0
              </span>
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded flex items-center shadow-sm">
              Blocked{" "}
              <span className="ml-2 bg-white text-black px-2 py-0.5 rounded">
                0
              </span>
            </button>
          </div>

          {/* Table Section */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md dark:bg-slate-500">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200 dark:bg-black dark:text-white">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Car Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left dark:bg-black dark:text-white">
                      Rc Number
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left dark:bg-black dark:text-white">
                      Vehicle NUmber
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left dark:bg-black dark:text-white">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cabs.length > 0 ? (
                    cabs.map((cab, index) => (
                      <tr key={index} className="border-b border-gray-300">
                        <td className="border px-4 py-2 dark:bg-black dark:text-white">{cab.carName}</td>
                        <td className="border px-4 py-2 dark:bg-black dark:text-white">{cab.rCNo}</td>
                        <td className="border px-4 py-2 dark:bg-black dark:text-white">{cab.vehicleNo}</td>
                        <td className="border px-4 py-2 dark:bg-black dark:text-white">
                          <button
                            className="text-blue-500 "
                            // onClick={() => route.push(`/Cabs/${cab.vendorCabId}`)}
                          >
                            <FaArrowRight />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        No cabs available.
                      </td>
                    </tr>
                  )}
                </tbody>{" "}
              </table>
            </div>
          </div>
        </div>

        {/* Modal for Adding Cabs */}
        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl max-h-[80vh] overflow-y-auto">
              
              {/* ✅ LOADING OVERLAY: Show spinner when loading */}
              {isLoading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                  <div className="flex flex-col items-center">
                    <FaSpinner className="animate-spin text-4xl text-blue-500 mb-2" />
                    <span className="text-lg font-medium text-gray-700">Adding Vehicle...</span>
                    <span className="text-sm text-gray-500">Please wait</span>
                  </div>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={toggleForm}
                disabled={isLoading} // ✅ Disable close button when loading
                className={`absolute top-2 right-2 text-xl ${
                  isLoading 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-600 hover:text-red-600'
                }`}
              >
                <FaTimes />
              </button>

              <h2 className="text-lg font-bold mb-2">Add Vehicle | Form</h2>
              <h3 className="text-md font-semibold mb-4">Add New Vehicle</h3>

              {/* Vehicle Name & Reg. No. */}
              <div className="flex flex-col md:flex-row items-center mt-4">
                <label className="w-full md:w-1/3 mb-2 md:mb-0">
                  Car Name
                </label>
                <input
                  type="text"
                  name="carName"
                  value={formData.carName}
                  onChange={handleInputChange}
                  disabled={isLoading} // ✅ Disable inputs when loading
                  className={`border p-2 w-full md:w-2/3 rounded-md ${
                    isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter Cars | Cabs Name"
                />
              </div>

              {/* Vehicle RC No. */}
              <div className="flex flex-col md:flex-row items-center mt-4">
                <label className="w-full md:w-1/3 mb-2 md:mb-0">
                  RC Number
                </label>
                <input
                  type="text"
                  name="rCNo"
                  value={formData.rCNo}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`border p-2 w-full md:w-1/2 rounded-md ${
                    isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter RC No. (e.g., MH12AB1234)"
                />

                <input
                  type="file"
                  name="rCImage"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className={`border p-2 w-full md:w-1/2 rounded-md md:ml-2 mt-2 md:mt-0 ${
                    isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              {/* Vehicle Number */}
              <div className="flex flex-col md:flex-row items-center mt-4">
                <label className="w-full md:w-1/3 mb-2 md:mb-0">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  name="vehicleNo"
                  value={formData.vehicleNo}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`border p-2 w-full md:w-1/2 rounded-md ${
                    isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter Vehicle Number (e.g., MH12AB1234)"
                />
                <input
                  type="file"
                  name="vehicleNoImage"
                  onChange={handleFileChange}
                  disabled={isLoading}
                  className={`border p-2 w-full md:w-1/2 rounded-md md:ml-2 mt-2 md:mt-0 ${
                    isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              {/* File Upload Fields */}
              {[
                "insuranceImage",
                "permitImage",
                "authorizationImage",
                "cabNoPlateImage",
                "cabImage",
                "cabFrontImage",
                "cabBackImage",
                "cabSideImage",
              ].map((field, index) => (
                <div
                  className="flex flex-col md:flex-row items-center mt-4"
                  key={index}
                >
                  <label className="w-full md:w-1/3 mb-2 md:mb-0">
                    {field.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    type="file"
                    name={field}
                    onChange={handleFileChange}
                    disabled={isLoading}
                    className={`w-full md:w-2/3 rounded-md ${
                      isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
              ))}

              {/* Other Details */}
              <div className="flex flex-col md:flex-row items-center mt-4">
                <label className="w-full md:w-1/3 mb-2 md:mb-0">
                  Cars | Cabs Other Details
                </label>
                <input
                  type="text"
                  name="cabOtherDetails"
                  value={formData.cabOtherDetails}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`border p-2 w-full md:w-2/3 rounded-md ${
                    isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="Enter Cab's Details"
                />
              </div>

              {/* ✅ UPDATED: Buttons with loading state */}
              <div className="flex justify-center mt-6 space-x-4">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-md font-medium transition duration-200 ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                      : 'bg-blue-500 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <FaSpinner className="animate-spin mr-2" />
                      Submitting...
                    </div>
                  ) : (
                    'Submit'
                  )}
                </button>
                
                <button
                  onClick={handleReset}
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-md font-medium transition duration-200 ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                      : 'bg-green-500 hover:bg-green-700 text-white'
                  }`}
                >
                  Reset
                </button>
                
                <button
                  onClick={toggleForm}
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-md font-medium transition duration-200 ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                      : 'bg-red-500 hover:bg-red-700 text-white'
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cabs;