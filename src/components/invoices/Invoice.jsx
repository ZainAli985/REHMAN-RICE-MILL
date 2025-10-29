import React from "react";

const Invoice = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-10 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          SECTION: INVOICE PAGE
        </h1>
        <h2 className="text-xl text-gray-500">
          STATUS: <span className="font-semibold text-yellow-500">UNDER PROGRESS...</span>
        </h2>
      </div>
    </div>
  );
};

export default Invoice;
