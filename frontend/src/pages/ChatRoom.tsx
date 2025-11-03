import HazardTypeCard from "@/common/HazardTypeCard"
import axios from "axios";
import { ArrowLeft, CircleAlert, MessageCircle, Search } from "lucide-react"
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Personal_Information from "@/common/Personal_Information"
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import LanguageSelector from "@/common/LanguageSelector";
import { useTranslation } from "react-i18next";
import { incidentReportStore } from "@/store/incidentReportStore";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { debounce } from "lodash"
import Pagination from "@/components/Pagination";
import { getOrCreateUser } from "@/utils/user";

interface PersonalData {
    name: string;
    phone_number: string;
    email?: string;
}
const defaultValues: PersonalData = {
    name: "",
    phone_number: "",
    email: ""
}

const ChatRoom: React.FC = observer(() => {
    const [incidentId, setIncidentId] = useState("");
    const { incidents, fetchIncidents, loading } = incidentReportStore;
    const [searchHazard, setSearchHazard] = useState("");

    const navigate = useNavigate();
    const { t } = useTranslation();
    const methods = useForm<PersonalData>({ defaultValues });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
        const debouncedFetch = debounce(() => {
            fetchIncidents(searchHazard);
        }, 500);      //wait 500ms after typing stops
        debouncedFetch();
        // cleanup on unmound or when searchHazard changes
        return () => {
            debouncedFetch.cancel();
        }
    }, [fetchIncidents, searchHazard]);

    // join the chat based on incident ID
    const handleJoinEmergency: SubmitHandler<PersonalData> = async (data) => {
        console.log("the data is :", data)

        try {
            await getOrCreateUser(data);
            // console.log("User stored after registration:", userStore.user);
            reset(defaultValues);
            toast.success("user register sucessfully")
            navigate(`/incident-chatroom/${incidentId}`);
        } catch (error) {
            console.error(error);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || error.message;
                toast.error(`Error: ${errorMessage}`);
            } else {
                toast.error("Something went wrong.");
            }
        }
    }
    console.log("incident+ hazard + user chitchatroom :", toJS(incidents));

    return (
        <>
            <nav className="fixed top-0 right-0 left-0 z-50 bg-backgrounds/95 backdrop-blur-sm border-b border-b-gray-300 shadow-md p-5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* desktop menu */}
                    <div className="flex items-center gap-4">
                        <NavLink to="/" className="flex items-center gap-1 text-gray-800">
                      <ArrowLeft className="w-5 h-5" />
                            <p className="text-lg">Back</p>
                        </NavLink>
                    </div>
                    {/* logo */}
                    <div className="hidden md:flex items-center gap-1">
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primaryCol text-white">
                            < MessageCircle />
                        </div>
                        <h1 className="hidden sm:flex font-semibold text-xl text-black">Chit Chat</h1>
                    </div>
                    <div className="flex items-center gap-10">
                        {/* search  */}
                        <div className="flex gap-2 items-center border p-1 rounded-lg border-gray-300">
                            <Search className="w-6 h-6 cursor-pointer" />
                            <input
                                type="text"
                                placeholder="Search by hazard type..."
                                value={searchHazard}
                                onChange={(e) => setSearchHazard(e.target.value)}
                                className=" p-1 w-full focus:outline-none"
                            />
                        </div>
                        <LanguageSelector />
                    </div>
                </div>
            </nav>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(handleJoinEmergency)}>
                    <div className="px-6 sm:px-10 md:px-16 ">
                        <div className=" max-w-sm sm:max-w-xl md:max-w-5xl flex flex-col  mt-20 mx-auto p-5">
                            {/* name , phone , email section */}
                            <Personal_Information />
                            {/* section hazard type */}
                            <section className="mt-7 py-5 ">
                                <div className="flex items-center gap-2 mb-5">
                                    <CircleAlert size={30} className="text-error" />
                                    <h1 className="font-bold text-lg">{t("current_incident")}</h1>
                                </div>
                                {
                                    loading ? (
                                        <p>Loading incidents....</p>
                                    ) : (
                                        <section className="flex flex-col gap-8">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {incidents.map((incident) => (
                                                    <HazardTypeCard
                                                        key={incident.incident_id}
                                                        title={incident.title}
                                                        onClick={() => setIncidentId(incident.incident_id)}
                                                        selected={incidentId === incident.incident_id}
                                                        hazard={incident.hazard_name}
                                                        fullName={incident.reporter_name}
                                                        IncidentDescription={incident.description}
                                                        createdAt={incident.created_at}
                                                        status={incident.priority}
                                                    />
                                                ))}
                                            </div>
                                            <Pagination
                                                currentPage={incidentReportStore.currentPage}
                                                totalPages={incidentReportStore.totalPages}
                                                onPageChange={(page) => incidentReportStore.fetchIncidents(searchHazard, page)}
                                            />
                                        </section>
                                    )}
                            </section>

                            <button
                                type="submit"
                                className="bg-primaryCol text-white w-full md:w-72 py-3 rounded-md  text-lg font-semibold hover:bg-primary-dark cursor-pointer">
                                Lets Chit Chat
                            </button>



                        </div>
                    </div>
                </form>
            </FormProvider>
        </>
    )
})
export default ChatRoom;