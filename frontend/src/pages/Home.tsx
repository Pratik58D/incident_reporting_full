import { ArrowRight, CircleAlert, MessageCircleMore } from "lucide-react"
import Footer from "../components/Footer"
import NavBar from "../components/NavBar"
import { NavLink } from "react-router-dom"

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 ">
      <NavBar />
      <main className="flex flex-col justify-center items-center flex-1 sm:px-10 py-12">
        {/* hero section */}
        <section className="px-6 pt-24 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primaryCol md:text-center">
            Welcome to Mero Alert
          </h1>
          <p className="text-gray-600 text-lg text-center md:text-xl mb-6">
            Quickly report incidents and connect with responders in real-time.
            Your safety matters to us.
          </p>

        </section>

        {/* card section */}
        <section className="px-6 py-6 grid md:grid-cols-2 gap-10">
          {/* report incident Card */}
          <div className="flex flex-col justify-between p-6 rounded-xl border border-gray-200 shadow-md bg-white hover:shadow-xl hover:scale-105 hover:bg-red-100 transition cursor-pointer h-full">
            <NavLink to="/report" className="flex flex-col justify-between h-full">
              <div className="flex flex-col items-center gap-2">
                <CircleAlert size={60} className="text-error" />
                <h2 className="text-xl font-bold">Report an incident</h2>
                <p className="text-gray-600 text-center">
                  Share details about hazards and keep community safe.
                </p>
              </div>
              <button className="button-red w-full flex gap-3 justify-center items-center mt-4">
                <p className="font-semibold">Report Incident</p>
                <ArrowRight />
              </button>
            </NavLink>
          </div>

          {/* Chat Room Card */}
          <div className="flex flex-col justify-between p-6 rounded-xl border border-gray-200 shadow-md bg-white hover:shadow-xl hover:scale-105 hover:bg-blue-100 transition cursor-pointer h-full">
            <NavLink to="/chat" className="flex flex-col justify-between h-full">
              <div className="flex flex-col items-center gap-2">
                <MessageCircleMore size={60} className="text-primaryCol" />
                <h2 className="text-xl font-bold">Join the Chat Room</h2>
                <p className="text-gray-600 text-center">
                  Talk with responders instantly and stay updated together.
                </p>
              </div>
              <button className="button-primary w-full flex gap-3 justify-center items-center mt-4">
                <p className="font-semibold">Enter Chat</p>
                <ArrowRight />
              </button>
            </NavLink>
          </div>
        </section>


      </main>


      <Footer />


    </div>
  )
}

export default Home