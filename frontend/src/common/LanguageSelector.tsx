import type React from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector : React.FC = ()=>{
    const {i18n} = useTranslation();
    const currentLang = i18n.language;

    const toggleLanguage = ()=>{
        const nextLang = currentLang === "en" ? "ne" :"en";
        i18n.changeLanguage(nextLang)
    };
    return(
        <button 
        onClick={toggleLanguage}
        className="px-3 py-1 rounded-lg border border-gray-400 hover:bg-gray-100">
            {currentLang === "en" ? "ने" : "En"}

        </button>
    )
}

export default LanguageSelector;