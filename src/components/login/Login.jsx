import React, { useState } from "react";
import API_BASE_URL from "../../../config/API_BASE_URL";
import Notification from "../Notification.jsx";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [notificationMessage, setnotificationMessage] = useState('');
    const [notificationType, setnotificationType] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (username !== '' && password !== '') {
            try {
                const res = await fetch(`${API_BASE_URL}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                });

                if (res.ok) {
                    const data = await res.json();
                    setnotificationMessage(data.message);
                    setnotificationType('success');
                    navigate('/dashboard')
                } else {
                    const data = await res.json();
                    setnotificationMessage(data.message);
                    setnotificationType('error');
                }

                setTimeout(() => setnotificationMessage(''), 3000);
            } catch (err) {
                setnotificationMessage('SERVER ERROR CONTACT DEV');
                setnotificationType('warning');
                setTimeout(() => setnotificationMessage(''), 3000);
            }
        } else {
            setnotificationMessage('KINDLY FILL IN ALL FIELDS');
            setnotificationType('warning');
            setTimeout(() => setnotificationMessage(''), 3000);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row">
            {/* Left side - branding / image */}
            <div className="hidden md:flex md:w-1/2 bg-blue-600 items-center justify-center p-10">
                <div className="text-center">
                    <img
                        src="/logo.png"
                        alt="Logo"
                        className="w-24 h-24 mx-auto rounded-full shadow-lg mb-6 border-4 border-white"
                    />
                    <h1 className="text-4xl font-bold text-white mb-3">
                        AL REHMAN RICE MILL
                    </h1>
                    <p className="text-blue-100 text-lg">
                        The Heart Of Fine Rice
                    </p>
                </div>
            </div>

            {/* Right side - login form */}
            <div className="flex flex-1 items-center justify-center bg-gray-50 px-6 py-12">
                <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
                        BACK TO BUSINESS
                    </h2>

                    <form className="space-y-6">
                        <div>
                            <label className="block text-gray-600 font-medium mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Your Username"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-600 font-medium mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter Your Password"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                            onClick={handleLogin}
                        >
                            LOGIN
                        </button>
                    </form>
                </div>
            </div>
            <Notification message={notificationMessage} type={notificationType} />
        </div>
    );
};
