import { NavLink } from "react-router-dom"
import { useState } from "react"
import {  AlertTriangle, Facebook, Linkedin, MailPlus, Menu, X } from "lucide-react";
import LanguageSelector from "@/common/LanguageSelector";
import { useTranslation } from "react-i18next";

const NavBar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-backgrounds/95 backdrop-blur-sm border-b border-b-gray-300 shadow-lg p-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* logo */}
        <NavLink to="/" className="flex items-center gap-1">       
         <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primaryCol text-white">
           <AlertTriangle />
         </div>
        <div>
          <h1 className="font-semibold text-xl text-black">{t("nav_title")}</h1>
          <h3 className="text-sm text-gray-500">{t("nav_text")}</h3>
        </div>
          </NavLink>
          <h2><NavLink to= "/current-incidents" className="hidden">Current Incidents</NavLink></h2>


        {/* desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex gap-4 items center">
          <Facebook className="w-5 h-5 text-gray-800" />
          <MailPlus className="w-5 h-5 text-gray-800" />
          <Linkedin className="w-5 h-5 text-gray-800"/>
        </div>

          <NavLink to= "login" className="button-secondary">Login</NavLink>
          <NavLink to="signup" className="button-primary">SignUp</NavLink>
           <LanguageSelector />

        </div>

        {/* mobile menu */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}

          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-2 flex flex-col gap-2 px-2 w-full shadow-md">
          <button className="w-full button-primary">
            <NavLink to="/login">Login</NavLink>
          </button>
          <button className="w-full button-primary">
            <NavLink to="/signup">Sign Up</NavLink>
          </button>
           <LanguageSelector />

         

        </div>
      )}

    </nav>
  
  )
}

export default NavBar