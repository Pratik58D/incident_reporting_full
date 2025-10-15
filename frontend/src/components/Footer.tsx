import { AlertTriangle, Facebook, Linkedin, MailPlus } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { NavLink } from "react-router-dom"

const Footer = () => {
  const { t } = useTranslation();
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
              <h1 className="font-semibold text-xl text-black">{t("nav_title")}</h1>
              <h3 className="text-sm text-gray-500">{t("nav_text")}</h3>
            </div>
          </NavLink>
          <p className="text-base text-gray-500">{t("footer_text")}</p>
        </div>
        {/* link section */}
        <section className="flex flex-1 justify-between">
          <div className="flex flex-col gap-2">
            <h3>{t('footer_menu_quick_action')}</h3>
            <Link to="/report" className="text-gray-500 hover:text-primaryCol transition">Report Incident</Link>
            <Link to="/chat" className="text-gray-500 hover:text-primaryCol transition">Emergency Chat</Link>
            <a href="#" className="text-gray-500 hover:text-primaryCol transition">Service Status</a>
          </div>
          <div className="flex flex-col gap-2">
            <h3>{t("footer_menu_legal")}</h3>
            <a href="#" className="text-gray-500 hover:text-primaryCol transition">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-primaryCol transition">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-primaryCol transition">Contact</a>
          </div>
          <div>
          </div>
        </section>
      </section>

      <hr className="text-gray-300" />

      <div className="flex justify-between items-center pt-4">
        <p className="text-gray-500 text-sm ">
          &copy; 2025 Mero Alert . All right reserved.
        </p>
        {/* media */}
        <div className="flex gap-4 items center">
          <Facebook className="w-5 h-5 text-gray-800" />
          <MailPlus className="w-5 h-5 text-gray-800" />
          <Linkedin className="w-5 h-5 text-gray-800"/>
        </div>

      </div>
    </footer>
  )
}

export default Footer