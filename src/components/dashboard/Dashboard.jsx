import React from "react";
import { Link } from "react-router-dom";
import SidebarLayout from "../layout/SidebarLayout.jsx";

export default function Dashboard() {
  return (
    <SidebarLayout>
      <div className="w-full min-h-screen bg-gray-50">
       

        {/* Dashboard Content */}
        <main className="max-w-7xl mx-auto py-8 px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>

          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Card 1 */}
            <Link
              to="/add-invoice"
              className="group bg-white shadow-md hover:shadow-xl transition rounded-xl p-6 flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full mb-4 text-3xl group-hover:bg-blue-600 group-hover:text-white transition">
                🧾
              </div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
                Add Invoice
              </h3>
            </Link>

            {/* Card 2 */}
            <Link
              to="/general-entries"
              className="group bg-white shadow-md hover:shadow-xl transition rounded-xl p-6 flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 bg-green-100 text-green-600 flex items-center justify-center rounded-full mb-4 text-3xl group-hover:bg-green-600 group-hover:text-white transition">
                📘
              </div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-green-600 transition">
                General Entries
              </h3>
            </Link>

            {/* Card 3 */}
            <Link
              to="/create-account"
              className="group bg-white shadow-md hover:shadow-xl transition rounded-xl p-6 flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 bg-yellow-100 text-yellow-600 flex items-center justify-center rounded-full mb-4 text-3xl group-hover:bg-yellow-600 group-hover:text-white transition">
                🧑‍💼
              </div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-yellow-600 transition">
                Create Account
              </h3>
            </Link>

            {/* Card 4 */}
            <Link
              to="/view-accounts"
              className="group bg-white shadow-md hover:shadow-xl transition rounded-xl p-6 flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 bg-purple-100 text-purple-600 flex items-center justify-center rounded-full mb-4 text-3xl group-hover:bg-purple-600 group-hover:text-white transition">
                💳
              </div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition">
                View Accounts
              </h3>
            </Link>
          </div>
        </main>
      </div>
    </SidebarLayout>
  );
}
