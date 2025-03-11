"use client";
import { useEffect, useState } from "react";
import { FaArrowRight, FaPlus, FaTimes } from "react-icons/fa";

import React from "react";
import axios from "axios"; // Import axios

const Drivers = () => {
  const vendor = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("vendor")) : null;

  if (!vendor) {
    console.error("Vendor not found in localStorage");
    // Optionally handle the case when vendor is not found, like redirecting the user
  }

  const email = vendor ? vendor.email : null;
  const vendorId = vendor ? vendor.vendorId : null;

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64 bg-gray-100 min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <div className="p-6 pt-20">
          {/* Header Section */}

          {/* Table Section */}
          <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Driver
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Driver Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Contact No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      DL. No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      PVC. No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Email Id
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Address
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      View
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cabs.length > 0 ? (
                    cabs.map((cab, index) => (
                      <tr key={index} className="border-b border-gray-300">
                        <td className="border px-4 py-2">
                          {cab.vendorDriverId}
                        </td>
                        <td className="border px-4 py-2">{cab.driverName}</td>
                        <td className="border px-4 py-2">{cab.contactNo}</td>
                        <td className="border px-4 py-2">{cab.dLNo}</td>
                        <td className="border px-4 py-2">{cab.pvcNo}</td>
                        <td className="border px-4 py-2">{cab.emailId}</td>

                        <td className="border px-4 py-2">{cab.address}</td>

                        <td className="border px-4 py-2">
                          <button className="text-blue-500">
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
      </div>
    </div>
  );
};

export default Drivers;
