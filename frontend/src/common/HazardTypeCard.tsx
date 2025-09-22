import { AlertCircle } from "lucide-react";
import type React from "react";

interface HazardTypeCardProps {
    title: string;
    onClick?: () => void;
    selected?: boolean;

}

const HazardTypeCard: React.FC<HazardTypeCardProps> = ({ title, onClick, selected }) => {
    return (
        <div
            onClick={onClick}
            className={` p-4 rounded-lg bg-white cursor-pointer transition-all duration-200 border border-gray-200
                      ${selected ? "scale-105 shadow-2xl border-2 " : "shadow-md hover:shadow-2xl"}`}
            >
            <div className="flex flex-col items-center justify-center gap-4 py-8">
                <div className="bg-error w-[40px] h-[40px] flex items-center justify-center rounded-full ">
                    <AlertCircle className="text-white" />
                </div>
                <h2 className="text-2xl font-semibold capitalize text-center">{title}</h2>

            </div>

        </div>
    )
}

export default HazardTypeCard