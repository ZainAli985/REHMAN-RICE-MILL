import React, { useEffect, useState } from "react";

const Notification = ({ message, type = "info", onClose }) => {
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (message) {
      // Force re-render even if same message
      setKey((prev) => prev + 1);
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onClose && onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!visible || !message) return null;

  const colorMap = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-yellow-500",
  };

  return (
    <div
      key={key}
      className={`${colorMap[type]} fixed top-5 right-5 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-500 z-[9999]`}
    >
      {message}
    </div>
  );
};

export default Notification;
