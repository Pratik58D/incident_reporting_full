import { AlertTriangle } from "lucide-react"
import { NavLink } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="flex flex-col bg-gray-100 border-t border-gray-200 shadow-inner py-5 px-5">

      {/* footer top section */}
      <section className="flex flex-col sm:flex-row gap-10 pb-5">
        <div className="flex-1 flex flex-col gap-4">
        <NavLink to="/" className="flex items-center gap-1">       
         <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primaryCol text-white">
           <AlertTriangle />
         </div>
        <div>
          <h1 className="font-semibold text-xl text-black">Mero Alert</h1>
          <h3 className="text-sm text-gray-500">Emergency resposes</h3>
        </div>
          </NavLink>
          <p className="text-base text-gray-500">Dedicated to providing fast, reliable emergency response services. Your safety is our priority, 24 hours a day, 7 days a week.</p>
      </div>
      {/* link section */}
      <section className="flex flex-1 justify-between">
        <div className="flex flex-col gap-2">
          <h3>Quick Action</h3>
           <a href="#" className="text-gray-500 hover:text-primaryCol transition">Report Incident</a>
          <a href="#" className="text-gray-500 hover:text-primaryCol transition">Emergency Chat</a>
          <a href="#" className="text-gray-500 hover:text-primaryCol transition">Service Status</a>
        </div>
        <div className="flex flex-col gap-2">
          <h3>Legal</h3>
          <a href="#" className="text-gray-500 hover:text-primaryCol transition">Privacy Policy</a>
          <a href="#" className="text-gray-500 hover:text-primaryCol transition">Terms of Service</a>
          <a href="#" className="text-gray-500 hover:text-primaryCol transition">Contact</a>
        </div>
      <div>
      </div>
      </section>
      </section>

      <hr  className="text-gray-300"/>

       <p className="text-gray-500 text-sm pt-5">
          &copy; 2025 Mero Alert . All right reserved.
        </p>

    </footer>
  )
}

export default Footer