import HazardTypeCard from "@/common/HazardTypeCard"
import { apiUrl } from "@/env";
import axios from "axios";
import { ArrowLeft, CircleAlert, MessageCircle } from "lucide-react"
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Personal_Information from "@/common/Personal_Information"
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import userStore from "@/store/userStore";

//type of Incident
interface Incident {
    incident_id: string;
    title: string;
    reported_by?: number;
    hazard_id?: string;
    hazard_name: string;
    name: string;
    description: string;
    created_at: Date;
    priority: "low" | "medium" | "high";
}

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


const ChatRoom: React.FC = () => {
    const [incidentData, setIncidentData] = useState<Incident[]>([]);
    const [incidentId, setIncidentId] = useState("");

    const navigate = useNavigate();

    const methods = useForm<PersonalData>({
        defaultValues
    });

    const { handleSubmit, reset } = methods;

    useEffect(() => {
        const getIncident = async () => {
            try {
                const res = await axios.get(`${apiUrl}/incidents/incident-hazard`);
                setIncidentData(res.data.incidentHazard);
            } catch (error) {
                console.error(error);
            }
        }
        getIncident();
    }, []);

    // join the chat based on incident ID
    const handleJoinEmergency: SubmitHandler<PersonalData> = async (data) => {
        try {

            // check if the user exists (by email, phone_number)
            const checkRes = await axios.get(`${apiUrl}/users/check`,{
                params :{
                    email  : data.email || undefined,
                    phone_number : data.phone_number
                }
            })
            let user;
            if(checkRes.data.exists){
                // if user already exists , use it
                user = checkRes.data.user;
            }else{
                //create a new user
                const res = await axios.post(`${apiUrl}/users`, {
                name: data.name,
                phone_number: data.phone_number,
                email: data.email || null
            });
              user = res.data.user
            }

            // // save user data (id comes from backend)
            // localStorage.setItem("chatUser", JSON.stringify(user.id));
            // localStorage.setItem("displayName", JSON.stringify(user.name));

            userStore.setUser({
                id : user.id,
                name : user.name,
                phone_number : user.phone_number,
                email : user.email
            })

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

    console.log("incident+ hazard + user chitchatroom :", incidentData);

    return (
        <>
            <nav className="fixed top-0 right-0 left-0 z-50 bg-backgrounds/95 backdrop-blur-sm border-b border-b-gray-300 shadow-md p-5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* desktop menu */}
                    <div className="flex items-center gap-4">
                        <NavLink to="/" className="flex items-center gap-1 text-gray-800">
                            <ArrowLeft size={15} />
                            <h1 className="">Home</h1>
                        </NavLink>
                    </div>
                    {/* logo */}
                    <div className="flex items-center gap-1">
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primaryCol text-white">
                            < MessageCircle />
                        </div>
                        <div>
                            <h1 className="hidden sm:flex font-semibold text-xl text-black">Emergency Chat</h1>
                        </div>
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
                                    <h1 className="font-bold text-lg">Hazard Type</h1>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {incidentData.map((incident) => (
                                        <HazardTypeCard
                                            key={incident.incident_id}
                                            title={incident.title}
                                            onClick={() => setIncidentId(incident.incident_id)}
                                            selected={incidentId === incident.incident_id}
                                            hazard={incident.hazard_name}
                                            fullName={incident.name}
                                            IncidentDescription={incident.description}
                                            createdAt={incident.created_at}
                                            status={incident.priority}
                                        />
                                    ))}
                                </div>
                            </section>
                            <button
                                type="submit"
                                className="bg-primaryCol text-white w-full md:w-72 py-3 rounded-md  text-lg font-semibold hover:bg-primary-dark cursor-pointer"
                            >
                                Join Emergency Room
                            </button>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default ChatRoom;