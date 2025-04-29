"use client";
import { useEffect, useState } from "react";
import { FaArrowRight, FaPlus, FaTimes } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import React from "react";
import axios from "axios"; // Import axios

const Drivers = () => {
  const [showForm, setShowForm] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const driverNameReges = /.+/;
    if (!driverNameReges.test(formData.driverName)) {
      alert("Driver name cannot be empty");
      return;
    }

    const addressReges = /.+/;
    if (!addressReges.test(formData.address)) {
      alert("Address cannot be empty");
      return;
    }

    const altContactNoRegex = /^[0-9]\d{10}$/;
    if (!altContactNoRegex.test(formData.altContactNo)) {
      alert("Contact no shoulde be greater than 9");
      return;
    }

    const contactNoRegex = /^[0-9]\d{10}$/;
    if (!contactNoRegex.test(formData.contactNo)) {
      alert("Alternate Contact no shoulde be greater than 9");

      return;
    }

    // // Validate Vehicle Number
    // const vehicleNoRegex = /^[A-Z]{2}\s*[0-9]{2}\s*[A-Z]{1,2}\s*[0-9]{4}$/;
    // if (!vehicleNoRegex.test(formData.vehicleNo)) {
    //   alert(
    //     "Please enter a valid Vehicle Number in Indian format (e.g., MH12AB1234)"
    //   );
    //   return;
    // }

    const dLNoRegex = /^[A-Z]{2}[0-9]{13}$/;
    if (!dLNoRegex.test(formData.dLNo)) {
      alert("Driver License are incorrect");

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
        `https://api.worldtriplink.com/addVendorDriver/${vendorId}`,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Vendor added successfully:", response.data);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding vendor:", error);
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
                  {/* Close Button */}
                  <button
                    onClick={toggleForm}
                    className="absolute top-2 right-2 text-gray-600 hover:text-red-600 text-xl"
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
                        className="border p-2 w-full sm:w-2/3 rounded-md"
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
                        className="border p-2 w-full sm:w-2/3 rounded-md"
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
                        className="border p-2 w-full sm:w-2/3 rounded-md"
                        placeholder="Enter Alternate Contact No."
                        required
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
                        className="border p-2 w-full sm:w-2/3 rounded-md"
                        placeholder="Enter Email Id"
                        required
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
                        className="border p-2 w-full sm:w-2/3 rounded-md"
                        placeholder="Enter Address"
                        required
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
                          className="border p-2 w-full rounded-md"
                          required
                        />
                        <input
                          type="file"
                          name="driverSelfie"
                          onChange={handleFileChange}
                          className="border p-2 w-full rounded-md"
                          required
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
                          className="border p-2 rounded-md"
                          placeholder="Enter DL No."
                          required
                        />
                        <input
                          type="file"
                          name="dLnoImage"
                          onChange={handleFileChange}
                          className="border p-2 rounded-md"
                          required
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
                          className="border p-2 rounded-md"
                          placeholder="Enter PVC No."
                          required
                        />
                        <input
                          type="file"
                          name="pvcImage"
                          onChange={handleFileChange}
                          className="border p-2 rounded-md"
                          required
                        />
                      </div>
                    </div>

                    {/* Additional Documents */}
                    {["Driver&apos;s Doc 1", "Driver&apos;s Doc 2", "Driver&apos;s Doc 3"].map(
                      (label, index) => (
                        <div className="flex flex-col sm:flex-row items-center" key={index}>
                          <label className="w-full sm:w-1/3 mb-2 sm:mb-0">
                            {label}
                          </label>
                          <input
                            type="file"
                            name={`driverDoc${index + 1}Image`}
                            onChange={handleFileChange}
                            className="border p-2 w-full sm:w-2/3 rounded-md"
                            required
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
                        className="border p-2 w-full sm:w-2/3 rounded-md"
                        placeholder="Enter additional details"
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700"
                    >
                      Submit
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
