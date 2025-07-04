import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const Dashboard: React.FC = () => {
  const userContext = useContext(UserContext);

  if (!userContext) return null;
  const { user } = userContext;

  return (
    <div className="flex min-h-screen bg-[#F0F4FA]">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-[#005EB8] via-[#00A9E0] to-[#005EB8] text-white flex flex-col items-center py-8 shadow-lg">
        {user.profileImage && (
          <img
            src={user.profileImage}
            alt="Profile"
            className="w-20 h-20 rounded-full mb-4 object-cover border-4 border-[#00A9E0] shadow"
          />
        )}
        <h2 className="text-xl font-semibold">{user.fullName}</h2>
        <p className="text-blue-100 text-sm">{user.email}</p>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-[#005EB8] mb-6">Welcome back!</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 - Email */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-[#005EB8]">
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-[#005EB8]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4V4zm0 0l8 8 8-8" />
              </svg>
              <h2 className="text-xl font-semibold text-[#005EB8]">Email</h2>
            </div>
            <p className="text-gray-600">{user.email}</p>
          </div>

          {/* Card 2 - Profile Info */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-[#00A9E0]">
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-[#00A9E0]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14a4 4 0 100-8 4 4 0 000 8zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5z" />
              </svg>
              <h2 className="text-xl font-semibold text-[#00A9E0]">Profile</h2>
            </div>
            <p className="text-gray-600">Full Name: {user.fullName}</p>
          </div>

          {/* Card 3 - Status */}
          <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-[#FFA500]">
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-[#FFA500]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z" />
              </svg>
              <h2 className="text-xl font-semibold text-[#FFA500]">Status</h2>
            </div>
            <p className="text-gray-600">You are all set!</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
