// "use client";
// import React from "react";
// import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";

// const Complaints = () => {
//   return (
//     <div className="flex h-screen overflow-hidden">
//       {/* Sidebar */}
//       <div className="w-64 bg-gray-900 text-white fixed h-full z-50">
//         <Sidebar />
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col ml-64">
//         {/* Navbar */}
//         <div className="fixed w-[calc(100%-16rem)] bg-white shadow-md z-40">
//           <Navbar />
//         </div>

//         {/* Page Content */}
//         <div className="p-6 pt-24 bg-gray-100 flex-1 overflow-auto">
//           {/* Page Title */}

//           {/* Table Section */}
//           <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
//             <table className="w-full border-collapse border border-gray-300">
//               {/* Table Header */}
//               <thead className="bg-gray-100">
//                 <tr className="border border-gray-300">
//                   <th className="p-3 text-left font-semibold border border-gray-300">Driver Name</th>
//                   <th className="p-3 text-left font-semibold border border-gray-300">Customer Name</th>
//                   <th className="p-3 text-left font-semibold border border-gray-300">Car Type</th>
//                   <th className="p-3 text-left font-semibold border border-gray-300">Status</th>
//                   <th className="p-3 text-left font-semibold border border-gray-300">Check Trip</th>
//                 </tr>
//               </thead>

//               {/* Table Body */}
//               <tbody>
//                 {/* Row 1 */}
//                 <tr className="border border-gray-300">
//                   <td className="p-3 border border-gray-300">
//                     <div className="flex items-center space-x-3">
//                       <img
//                         src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwsiRJRJVZsNbhMQvW5_jHqApzmQwPrGBvOqCg6CLWtvmvDYJUcpkzGeoXXs8Lmv-NMs4&usqp=CAU"
//                         alt="Driver Profile"
//                         className="w-10 h-10 rounded-full"
//                       />
//                       <div>
//                         <p className="font-medium">John Doe</p>
//                         <p className="text-sm text-gray-500">john.doe@gmail.com</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-3 border border-gray-300">
//                     <div className="flex items-center space-x-3">
//                       <img
//                         src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwsiRJRJVZsNbhMQvW5_jHqApzmQwPrGBvOqCg6CLWtvmvDYJUcpkzGeoXXs8Lmv-NMs4&usqp=CAU"
//                         alt="Customer Profile"
//                         className="w-10 h-10 rounded-full"
//                       />
//                       <div>
//                         <p className="font-medium">John Doe</p>
//                         <p className="text-sm text-gray-500">john.doe@gmail.com</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="p-3 border border-gray-300">Swift</td>
//                   <td className="p-3 border border-gray-300 text-green-600 font-semibold">
//                     <button className="bg-green-500 text-white px-2 py-1 text-sm rounded-md hover:bg-green-600">
//                       Active
//                     </button>
//                   </td>
//                   <td className="p-3">
//                     <div className="flex justify-center items-center">
//                       <span className="w-8 h-8 rounded-full border-2 border-gray-300 text-center flex items-center justify-center text-lg cursor-pointer hover:bg-gray-200 transition">
//                         &gt;
//                       </span>
//                     </div>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Complaints;
