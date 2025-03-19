


import Dashboard from "./Dashboard/page"; // ✅ Import Dashboard
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export default function Home() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 md:ml-64">
        {/* Navbar */}
        <Navbar />

        {/* Main Page Content */}
        <main className="p-6 pt-20">
          <Dashboard />  {/* ✅ Now rendering Dashboard correctly */}
        </main>
      </div>
    </div>
  );
}
