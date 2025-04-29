// "use client";
// import { useRouter } from "next/navigation";
// import {
//   FaTachometerAlt,
//   FaCar,
//   FaUserFriends,
//   FaExclamationTriangle,
//   FaCreditCard,
//   FaUser,
//   FaEnvelope,
//   FaLock,
// } from "react-icons/fa";
// import { useEffect, useState } from "react";
// import axios from "axios";

// const Sidebar = ({ isOpen, toggleSidebar }) => {
//   const router = useRouter();
//   const [vendor, setVendor] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [showLogin, setShowLogin] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         "https://api.worldtriplink.com/vendors/vendorLogin",
//         {
//           email,
//           password,
//         }
//       );

//       const data = response.data;
//       setVendor(data);
//       localStorage.setItem("vendor", JSON.stringify(data));
//       setShowLogin(false);
//       router.push("/");
//       console.log("Vendor login successful:", data);
//     } catch (error) {
//       console.error("Login failed:", error);  
//       alert("Login failed. Please check your credentials and try again.");
//     }
//   };

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const vendorData = localStorage.getItem("vendor");
//       setVendor(vendorData ? JSON.parse(vendorData) : null);
//     }
//     setIsLoading(false);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("vendor");
//     setVendor(null);
//     router.refresh();
//   };

//   if (isLoading) {
//     return (
//       <div className="fixed left-0 top-0 w-64 h-screen bg-white dark:bg-black flex items-center justify-center z-40">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Login Modal */}
//       {showLogin && (
//         <div className="fixed inset-0 z-50 flex flex-col items-center justify-center min-h-screen bg-gradient-to-b bg-black/50 to-transparent backdrop-blur-sm p-6">
//         {/* Larger Container with enhanced glass effect */}
//         <div className="w-full max-w-lg p-4 rounded-3xl  bg-gray-300 bg-opacity-60 backdrop-blur-md border-spacing-3 border-gray-700 shadow-2xl">
//           {/* Gradient Header with more spacing */}
//           <div className="text-center mb-6">
//             <h2 className=" text-4xl p-4  font-bold bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 bg-clip-text text-transparent">
//               Login Vendor
//             </h2>
//           </div>
  
//           <form onSubmit={handleSubmit} className="space-y-8 ">
//             {/* Email Field - enlarged */}
//             <div className="relative ">
//               <div className="absolute inset-y-0  left-5 flex items-center pl-3">
//                 <FaEnvelope className="h-5 w-5 mr-3 text-gray-400" />
//                 <span className="text-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
//                   Email
//                 </span>
//               </div>
//               <input
//                 type="email"
//                 className="w-full pl-32 pr-6 py-4 text-lg bg-gray-800 text-white border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 placeholder="Enter Your Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>
  
//             {/* Password Field - enlarged */}
//             <div className="relative">
//               <div className="absolute inset-y-0 left-5 flex items-center pl-3">
//                 <FaLock className="h-5 w-5 mr-3 text-gray-400" />
//                 <span className="text-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
//                   Password
//                 </span>
//               </div>
//               <input
//                 type="password"
//                 className="w-full pl-40 pr-6  py-4 text-lg bg-gray-800 text-white border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 placeholder="Enter Your Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//             </div>
  
//             {/* Submit Button - enlarged */}
//             <button
//               type="submit"
//               className="w-full py-4 text-xl font-semibold text-white bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:from-purple-500 hover:via-pink-600 hover:to-red-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-full shadow-xl transition-all duration-300"
//             >
//               Login
//             </button>
//           </form>
//         </div>
//       </div>
  
//       )}

//       {/* Sidebar */}
//       <div
//         className={`w-64 h-screen bg-white dark:bg-gray-900 shadow-lg fixed left-0 top-0 z-40 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "-translate-x-full"
//         } md:translate-x-0`}
//       >
//         <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
//           <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
//             {vendor ? vendor.name || "Vendor Dashboard" : "Welcome"}
//           </h2>
//           {vendor && (
//             <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//               {vendor.email}
//             </p>
//           )}
//         </div>

//         <nav className="mt-6">
//           <ul className="space-y-2 px-4">
//             {vendor ? (
//               <li className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800">
//                 <FaUser className="text-lg text-blue-600 dark:text-blue-400" />
//                 <span className="text-base font-medium text-gray-800 dark:text-white">
//                   {vendor.email}
//                 </span>
//               </li>
//             ) : (
//               <li
//                 className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200"
//                 onClick={() => setShowLogin(true)}
//               >
//                 <FaTachometerAlt className="text-lg text-gray-600 dark:text-gray-400" />
//                 <span className="text-base font-medium text-gray-700 dark:text-gray-300">
//                   Login
//                 </span>
//               </li>
//             )}

//             <li
//               className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200"
//               onClick={() => router.push("/")}
//             >
//               <FaTachometerAlt className="text-lg text-gray-600 dark:text-gray-400" />
//               <span className="text-base font-medium text-gray-700 dark:text-gray-300">
//                 Dashboard
//               </span>
//             </li>

//             <li
//               className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200"
//               onClick={() => router.push("/Bookings")}
//             >
//               <FaCar className="text-lg text-gray-600 dark:text-gray-400" />
//               <span className="text-base font-medium text-gray-700 dark:text-gray-300">
//                 Bookings
//               </span>
//             </li>

//             <li
//               className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200"
//               onClick={() => router.push("/Cabs")}
//             >
//               <FaCar className="text-lg text-gray-600 dark:text-gray-400" />
//               <span className="text-base font-medium text-gray-700 dark:text-gray-300">
//                 Cabs
//               </span>
//             </li>

//             <li
//               className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200"
//               onClick={() => router.push("/Drivers")}
//             >
//               <FaUserFriends className="text-lg text-gray-600 dark:text-gray-400" />
//               <span className="text-base font-medium text-gray-700 dark:text-gray-300">
//                 Drivers
//               </span>
//             </li>

//             <li
//               className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200"
//               onClick={() => router.push("/Complaints")}
//             >
//               <FaExclamationTriangle className="text-lg text-gray-600 dark:text-gray-400" />
//               <span className="text-base font-medium text-gray-700 dark:text-gray-300">
//                 Complaints
//               </span>
//             </li>

//             <li
//               className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200"
//               onClick={() => router.push("/Payments")}
//             >
//               <FaCreditCard className="text-lg text-gray-600 dark:text-gray-400" />
//               <span className="text-base font-medium text-gray-700 dark:text-gray-300">
//                 Payments
//               </span>
//             </li>

//             <li
//               className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200"
//               onClick={() => router.push("/Notification")}
//             >
//               <FaExclamationTriangle className="text-lg text-gray-600 dark:text-gray-400" />
//               <span className="text-base font-medium text-gray-700 dark:text-gray-300">
//                 Notifications
//               </span>
//             </li>

//             <li
//               className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200"
//               onClick={() => router.push("/Vendor")}
//             >
//               <FaUser className="text-lg text-gray-600 dark:text-gray-400" />
//               <span className="text-base font-medium text-gray-700 dark:text-gray-300">
//                 Vendor Profile
//               </span>
//             </li>

//             {vendor && (
//               <li
//                 className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-all duration-200"
//                 onClick={handleLogout}
//               >
//                 <FaTachometerAlt className="text-lg text-gray-600 dark:text-gray-400" />
//                 <span className="text-base font-medium text-gray-700 dark:text-gray-300">
//                   Logout
//                 </span>
//               </li>
//             )}
//           </ul>
//         </nav>
//       </div>
//     </>
//   );
// };

// export default Sidebar;





"use client";
import { useRouter } from "next/navigation";
import {
  FaTachometerAlt,
  FaCar,
  FaUserFriends,
  FaExclamationTriangle,
  FaCreditCard,
  FaUser,
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaSignOutAlt,
  FaBell,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const router = useRouter();
  const [vendor, setVendor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://api.worldtriplink.com/vendors/vendorLogin",
        {
          email,
          password,
        }
      );

      const data = response.data;
      setVendor(data);
      localStorage.setItem("vendor", JSON.stringify(data));
      setShowLogin(false);
      router.push("/");
      console.log("Vendor login successful:", data);
    } catch (error) {
      console.error("Login failed:", error);  
      alert("Login failed. Please check your credentials and try again.");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const vendorData = localStorage.getItem("vendor");
      setVendor(vendorData ? JSON.parse(vendorData) : null);
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("vendor");
    setVendor(null);
    router.refresh();
  };

  if (isLoading) {
    return (
      <div className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center z-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Enhanced Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md px-6 py-8 mx-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Vendor Login
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">       
                Access your vendor dashboard
              </p>
            </div>  
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-purple-500" />
                  </div>
                  <input
                    type="email"
                    className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-red-500" />
                  </div>
                  <input
                    type="password"
                    className="block w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Sidebar with Colorful Icons */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 z-40 transition-all duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="h-full flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {vendor ? vendor.name || "Vendor Portal" : "Welcome"}
              </h2>
              <button
                onClick={toggleSidebar}
                className="md:hidden p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"   
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation - Scrollable area with hidden scrollbar */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide">
          {/* <nav className="flex-1 px-4 py-6 overflow-y-auto"> */}
            <ul className="space-y-2">
              {vendor ? (
                <li className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 shadow-sm">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 text-blue-600 dark:text-blue-300">
                    <FaUser className="text-lg" />
                  </div>
                  <div>
                    <span className="block text-base font-medium text-gray-800 dark:text-white">
                      {vendor.email.split('@')[0]}
                    </span>
                    <span className="block text-xs text-blue-600 dark:text-blue-400">
                       Your Account
                    </span>
                  </div>
                </li>
              ) : (
                <li
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200 group"
                  onClick={() => setShowLogin(true)}
                >
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 text-green-600 dark:text-green-300">
                    <FaSignInAlt className="text-lg" />
                  </div>
                  <span className="text-base font-medium text-green-700 dark:text-green-400">
                    Login
                  </span>
                </li>
              )}

              {/* Navigation Items with Colorful Icons */}
              {[
                { icon: <FaTachometerAlt />, label: "Dashboard", path: "/", color: "from-indigo-500 to-purple-500", textColor: "text-indigo-700 dark:text-indigo-400" },
                { icon: <FaCar />, label: "Bookings", path: "/Bookings", color: "from-blue-500 to-cyan-500", textColor: "text-blue-700 dark:text-blue-400" },
                { icon: <FaCar />, label: "Cabs", path: "/Cabs", color: "from-teal-500 to-emerald-500", textColor: "text-teal-700 dark:text-teal-400" },
                { icon: <FaUserFriends />, label: "Drivers", path: "/Drivers", color: "from-amber-500 to-yellow-500", textColor: "text-amber-700 dark:text-amber-400" },
                { icon: <FaExclamationTriangle />, label: "Complaints", path: "/Complaints", color: "from-red-500 to-pink-500", textColor: "text-red-700 dark:text-red-400" },
                { icon: <FaCreditCard />, label: "Payments", path: "/Payments", color: "from-green-500 to-lime-500", textColor: "text-green-700 dark:text-green-400" },
                { icon: <FaBell />, label: "Notifications", path: "/Notification", color: "from-purple-500 to-fuchsia-500", textColor: "text-purple-700 dark:text-purple-400" },
                { icon: <FaUser />, label: "Vendor Profile", path: "/Vendor", color: "from-cyan-500 to-sky-500", textColor: "text-cyan-700 dark:text-cyan-400" },
              ].map((item, index) => (
                <li
                  key={index}
                  className="group"
                  onClick={() => router.push(item.path)}
                >
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition-all duration-200">
                    <div className={`flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br ${item.color} text-white`}>
                      {item.icon}
                    </div>
                    <span className={`text-base font-medium ${item.textColor}`}>
                      {item.label}
                    </span>
                  </div>
                </li>
              ))}

              {vendor && (
                <li
                  className="group mt-8"
                  onClick={handleLogout}
                >
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 cursor-pointer transition-all duration-200">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 text-white">
                      <FaSignOutAlt className="text-lg" />
                    </div>
                    <span className="text-base font-medium text-red-700 dark:text-red-400">
                      Logout
                    </span>
                  </div>
                </li>
              )}
            </ul>
          </nav>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Cab Booking System
            </p>
          </div>
        </div>
      </div>

{/* Add this style tag to hide scrollbars globally */}
<style jsx global>{`
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`}</style>
    </>
  );
};

export default Sidebar;



