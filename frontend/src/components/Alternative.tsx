import { AlertCircle, MessageCircle } from "lucide-react";

const Alternative = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 shadow-sm bg-white">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <span role="img" aria-label="alert">
            🚨
          </span>
          Mero Alert
        </h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition">
            Login
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-1 px-6 py-12">
        <h2 className="text-4xl font-bold text-blue-700 mb-3 text-center">
          Welcome to Mero Alert
        </h2>
        <p className="text-gray-600 text-lg text-center mb-10 max-w-2xl">
          Quickly report incidents and connect with responders in real-time.
          Your safety matters to us.
        </p>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
          {/* Report Incident Card */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center">
            <div className="bg-red-100 text-red-600 rounded-full p-3 mb-4">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Report an Incident</h3>
            <p className="text-gray-500 text-center mb-6">
              Submit a report quickly and securely.
            </p>
            <button className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
              Report Now
            </button>
          </div>

          {/* Join Chat Room Card */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 flex flex-col items-center">
            <div className="bg-blue-100 text-blue-600 rounded-full p-3 mb-4">
              <MessageCircle size={40} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Join the Chat Room</h3>
            <p className="text-gray-500 text-center mb-6">
              Connect with responders in real-time.
            </p>
            <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Join Chat
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        <p>
          © 2025 Mero Alert. All rights reserved. ·{" "}
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>{" "}
          ·{" "}
          <a href="#" className="hover:underline">
            Terms of Service
          </a>{" "}
          ·{" "}
          <a href="#" className="hover:underline">
            Contact
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Alternative;
