"use client";
import { useEffect, useState } from "react";
import { FaArrowRight, FaPlus, FaTimes, FaSpinner } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import React from "react";
import axios from "axios"; // Import axios

const Drivers = () => {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // ✅ ADD: Loading state
  const [formData, setFormData] = useState({
    driverName: "",
    contactNo: "",
    altContactNo: "",
    address: "",
    dLNo: "",
    pvcNo: "",
    emailId: "",
    driverOtherDetails: "",
    driverImage: null,
    driverSelfie: null,
    dLnoImage: null,
    pvcImage: null,
    driverDoc1Image: null,
    driverDoc2Image: null,
    driverDoc3Image: null,
  });

  const vendor = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("vendor")) : null;

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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ✅ UPDATED: Handle submit with loading state
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ START: Set loading to true when submission starts
    setIsLoading(true);

    const driverNameReges = /.+/;
    if (!driverNameReges.test(formData.driverName)) {
      alert("Driver name cannot be empty");
      setIsLoading(false); // ✅ Stop loading on validation error
      return;
    }

    const form = new FormData();

    // Append text fields to form data
    Object.keys(formData).forEach((key) => {
      if (
        key !== "driverImage" &&
        key !== "driverSelfie" &&
        key !== "dLnoImage" &&
        key !== "pvcImage" &&
        key !== "driverDoc1Image" &&
        key !== "driverDoc2Image" &&
        key !== "driverDoc3Image"
      ) {
        form.append(key, formData[key]);
      }
    });

    // Append file fields to form data
    form.append("driverImage", formData.driverImage);
    form.append("driverSelfie", formData.driverSelfie);
    form.append("dLnoImage", formData.dLnoImage);
    form.append("pvcImage", formData.pvcImage);
    form.append("driverDoc1Image", formData.driverDoc1Image);
    form.append("driverDoc2Image", formData.driverDoc2Image);
    form.append("driverDoc3Image", formData.driverDoc3Image);

    try {
      const response = await axios.post(
        `http://localhost:8080/addVendorDriver/${vendorId}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ✅ SUCCESS: Stop loading and show success message
      alert("Driver added successfully!");
      console.log("Response:", response.data);
      setShowForm(false);
      
      // ✅ OPTIONAL: Reset form data
      setFormData({
        driverName: "",
        contactNo: "",
        altContactNo: "",
        address: "",
        dLNo: "",
        pvcNo: "",
        emailId: "",
        driverOtherDetails: "",
        driverImage: null,
        driverSelfie: null,
        dLnoImage: null,
        pvcImage: null,
        driverDoc1Image: null,
        driverDoc2Image: null,
        driverDoc3Image: null,
      });
      
    } catch (error) {
      // ✅ ERROR: Stop loading and show error message
      console.error("Error adding driver:", error);
      alert("Error adding driver. Please try again.");
    } finally {
      // ✅ FINALLY: Always stop loading regardless of success/error
      setIsLoading(false);
    }
  };

  const [cabs, setCabs] = useState([]);

  useEffect(() => {
    const fetchCabs = async () => {
      try {
        if (vendorId) {
          const response = await axios.get(
            `https://api.worldtriplink.com/${vendorId}/drivers`
          );
          setCabs(response.data); // Set fetched cabs data
        }
      } catch (error) {
        console.error("Error fetching cabs data:", error);
      }
    };

    fetchCabs(); // Call the fetch function
  }, [vendorId]);

  console.log(cabs);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 min-h-screen md:ml-64 lg:ml-64 dark:bg-black dark:text-white" >
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="p-4 sm:p-6 pt-20 relative top-12 dark:bg-black dark:text-white">
          {/* Header Section */}
          <div className="bg-gray-200 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between rounded-lg shadow gap-4 dark:bg-black border-white">
            <h2 className="font-semibold text-lg flex items-center  dark:text-white">
              <span className="mr-2">👨‍✈️</span> All Drivers Details
            </h2>
            <button
              onClick={toggleForm}
              className="w-full sm:w-auto border p-2 sm:p-3 rounded-md bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-white font-semibold transition duration-300 ease-in-out"
            >
              + Add Drivers
            </button>
          </div>

          {/* Modal for Adding Drivers */}
          {showForm && (
            <form onSubmit={handleSubmit}>
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-2 sm:p-4 z-50">
                <div className="relative bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl max-h-[90vh] overflow-y-auto">
                  
                  {/* ✅ LOADING OVERLAY: Show spinner when loading */}
                  {isLoading && (
                    <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                      <div className="flex flex-col items-center">
                        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-2" />
                        <span className="text-lg font-medium text-gray-700">Submitting...</span>
                        <span className="text-sm text-gray-500">Please wait</span>
                      </div>
                    </div>
                  )}

                  {/* Close Button */}
                  <button
                    onClick={toggleForm}
                    type="button"
                    disabled={isLoading} // ✅ Disable close button when loading
                    className={`absolute top-2 right-2 text-xl ${
                      isLoading 
                        ? 'text-gray-400 cursor-not-allowed' 
                        : 'text-gray-600 hover:text-red-600'
                    }`}
                  >
                    <FaTimes />
                  </button>

                  <h2 className="text-lg font-bold mb-2">Add Driver Form</h2>
                  <h3 className="text-md font-semibold mb-4">Add New Driver</h3>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    {/* Driver Name */}
                    <div className="flex flex-col sm:flex-row items-center">
                      <label className="w-full sm:w-1/3 mb-2 sm:mb-0">
                        Driver Name
                      </label>
                      <input
                        type="text"
                        name="driverName"
                        value={formData.driverName}
                        onChange={handleInputChange}
                        disabled={isLoading} // ✅ Disable inputs when loading
                        className={`border p-2 w-full sm:w-2/3 rounded-md ${
                          isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                        placeholder="Enter Driver Name"
                        required
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="flex flex-col sm:flex-row items-center">
                      <label className="w-full sm:w-1/3 mb-2 sm:mb-0">
                        Contact No.
                      </label>
                      <input
                        type="text"
                        name="contactNo"
                        value={formData.contactNo}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={`border p-2 w-full sm:w-2/3 rounded-md ${
                          isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                        placeholder="Enter Contact No."
                        required
                      />
                    </div>

                    {/* Alternate Contact Number */}
                    <div className="flex flex-col sm:flex-row items-center">
                      <label className="w-full sm:w-1/3 mb-2 sm:mb-0">
                        Alternate Contact No.
                      </label>
                      <input
                        type="text"
                        name="altContactNo"
                        value={formData.altContactNo}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={`border p-2 w-full sm:w-2/3 rounded-md ${
                          isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                        placeholder="Enter Alternate Contact No."
                      />
                    </div>

                    {/* Email Id */}
                    <div className="flex flex-col sm:flex-row items-center">
                      <label className="w-full sm:w-1/3 mb-2 sm:mb-0">
                        Email Id
                      </label>
                      <input
                        type="text"
                        name="emailId"
                        value={formData.emailId}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={`border p-2 w-full sm:w-2/3 rounded-md ${
                          isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                        placeholder="Enter Email Id"
                      />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col sm:flex-row items-center">
                      <label className="w-full sm:w-1/3 mb-2 sm:mb-0">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={`border p-2 w-full sm:w-2/3 rounded-md ${
                          isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                        placeholder="Enter Address"
                      />
                    </div>

                    {/* Driver's Image & Selfie */}
                    <div className="flex flex-col sm:flex-row items-center">
                      <label className="w-full sm:w-1/3 mb-2 sm:mb-0">
                        Driver&apos;s Image & Selfie
                      </label>
                      <div className="w-full sm:w-2/3 space-y-2">
                        <input
                          type="file"
                          name="driverImage"
                          onChange={handleFileChange}
                          disabled={isLoading}
                          className={`border p-2 w-full rounded-md ${
                            isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                        />
                        <input
                          type="file"
                          name="driverSelfie"
                          onChange={handleFileChange}
                          disabled={isLoading}
                          className={`border p-2 w-full rounded-md ${
                            isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Driver's License Number */}
                    <div className="flex flex-col sm:flex-row items-center">
                      <label className="w-full sm:w-1/3 mb-2 sm:mb-0">
                        Driver&apos;s License No.
                      </label>
                      <div className="w-full sm:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          name="dLNo"
                          value={formData.dLNo}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className={`border p-2 rounded-md ${
                            isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                          placeholder="Enter DL No."
                          required
                        />
                        <input
                          type="file"
                          name="dLnoImage"
                          onChange={handleFileChange}
                          disabled={isLoading}
                          className={`border p-2 rounded-md ${
                            isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* PVC Number */}
                    <div className="flex flex-col sm:flex-row items-center">
                      <label className="w-full sm:w-1/3 mb-2 sm:mb-0">
                        PUC Number
                      </label>
                      <div className="w-full sm:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          name="pvcNo"
                          value={formData.pvcNo}
                          onChange={handleInputChange}
                          disabled={isLoading}
                          className={`border p-2 rounded-md ${
                            isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                          placeholder="Enter PVC No."
                        />
                        <input
                          type="file"
                          name="pvcImage"
                          onChange={handleFileChange}
                          disabled={isLoading}
                          className={`border p-2 rounded-md ${
                            isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Additional Documents */}
                    {["Driver Doc 1", "Driver Doc 2", "Driver Doc 3"].map(
                      (label, index) => (
                        <div className="flex flex-col sm:flex-row items-center" key={index}>
                          <label className="w-full sm:w-1/3 mb-2 sm:mb-0">
                            {label}
                          </label>
                          <input
                            type="file"
                            name={`driverDoc${index + 1}Image`}
                            onChange={handleFileChange}
                            disabled={isLoading}
                            className={`border p-2 w-full sm:w-2/3 rounded-md ${
                              isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                            }`}
                          />
                        </div>
                      )
                    )}

                    {/* Additional Details */}
                    <div className="flex flex-col sm:flex-row items-center">
                      <label className="w-full sm:w-1/3 mb-2 sm:mb-0">
                        Additional Details
                      </label>
                      <textarea
                        name="driverOtherDetails"
                        value={formData.driverOtherDetails}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className={`border p-2 w-full sm:w-2/3 rounded-md ${
                          isLoading ? 'bg-gray-100 cursor-not-allowed' : ''
                        }`}
                        placeholder="Enter additional details"
                      />
                    </div>
                  </div>

                  {/* ✅ UPDATED: Submit Button with loading state */}
                  <div className="mt-6">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full px-6 py-2 rounded-md font-medium transition duration-200 ${
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
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Table Section */}
        <div className="mt-6 bg-white p-2 sm:p-4 rounded-lg shadow-md relative top-3 dark:bg-black dark:text-white">
          <div className="overflow-x-auto">
            <div className="min-w-full inline-block align-middle">
              <div className="overflow-hidden">
                <table className="min-w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-sm dark:bg-black">
                        Driver
                      </th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-sm dark:bg-black">
                        Driver Name
                      </th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-sm dark:bg-black">
                        Contact No
                      </th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-sm dark:bg-black">
                        DL. No
                      </th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-sm dark:bg-black">
                        PVC. No
                      </th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-sm dark:bg-black">
                        Email Id
                      </th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-sm dark:bg-black">
                        Address
                      </th>
                      <th className="border border-gray-300 px-2 sm:px-4 py-2 text-left text-sm dark:bg-black">
                        View
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {cabs.length > 0 ? (
                      cabs.map((cab, index) => (
                        <tr key={index} className="border-b border-gray-300">
                          <td className="border px-2 sm:px-4 py-2 text-sm">{cab.vendorDriverId}</td>
                          <td className="border px-2 sm:px-4 py-2 text-sm">{cab.driverName}</td>
                          <td className="border px-2 sm:px-4 py-2 text-sm">{cab.contactNo}</td>
                          <td className="border px-2 sm:px-4 py-2 text-sm">{cab.dLNo}</td>
                          <td className="border px-2 sm:px-4 py-2 text-sm">{cab.pvcNo}</td>
                          <td className="border px-2 sm:px-4 py-2 text-sm">{cab.emailId}</td>
                          <td className="border px-2 sm:px-4 py-2 text-sm">{cab.address}</td>
                          <td className="border px-2 sm:px-4 py-2 text-sm">
                            <button className="text-blue-500 hover:text-blue-700">
                              <FaArrowRight />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="text-center py-4 text-sm">
                          No drivers available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drivers;