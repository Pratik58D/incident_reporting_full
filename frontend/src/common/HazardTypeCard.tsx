import { Card, CardContent, CardHeader } from "@/components/ui/card";
import getStatusColor from "@/lib/statusColor";
import { Clock } from "lucide-react";
import type React from "react";

interface HazardTypeCardProps {
    title: string;
    onClick?: () => void;
    selected?: boolean;
    hazard?: string;
    fullName: string;
    IncidentDescription: string;
    createdAt: Date;
    status: "low" | "medium" | "high";
}

const HazardTypeCard: React.FC<HazardTypeCardProps> = ({
    title,
    onClick,
    selected,
    hazard,
    fullName,
    IncidentDescription,
    createdAt,
    status
}) => {
    return (
        <Card
            onClick={onClick}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg border border-gray-200
                      ${selected ? "scale-105 shadow-2xl border border-gray-400 " : "hover:shadow-2xl"}`}
        >
            <CardHeader className="flex flex-col gap-4">
                <div className="w-full">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span
                                className={`w-4 h-4 rounded-full ${getStatusColor(status)}`}
                            ></span>
                          <h2 className="text-xl font-semibold capitalize">{title}</h2>

                           
                        </div>
                         <p className={`capitalize text-sm font-medium text-white  px-4 py-0.5 rounded-md ${getStatusColor(status)} `}>{status}</p>
                    </div>
                     <p className="text-sm text-gray-600 leading-relaxed">
                        {IncidentDescription}
                    </p>
                </div>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="space-y-4">
                   

                    <div className="text-sm text-gray-500 space-y-1 flex justify-between items-center">
                        <div className="inline-flex items-center gap-1">
                            <Clock size={17} />
                            <p >{new Date(createdAt).toLocaleDateString()}</p>
                        </div>
                        {hazard && <p className="capitalize">{hazard}</p>}
                        <p>Reported by <span className="font-medium">{fullName}</span></p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default HazardTypeCard;