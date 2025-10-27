import MapView, { type Incident } from '@/components/MapVIew'
import { apiUrl } from '@/env';
import {  incidentReportStore } from '@/store/incidentReportStore';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

const IncidentView: React.FC = observer(() => {
    const [selectedHazardId, setSelectedHazardId] = useState<number | null>(null);
    const [incidents, setIncident] = useState<Incident[]>([]);

    const {t} = useTranslation();

    //fetching all the hazards for sidebar
    useEffect(() => {
       incidentReportStore.fetchHazards();
    },[])
    console.log(incidentReportStore.fetchHazards)

    // Fetch incidents when hazard is selected
    useEffect(() => {
        if (!selectedHazardId) return;
        axios
            .get(`${apiUrl}/hazards/${selectedHazardId}`)
            .then((res) => {
                setIncident(res.data.data.incidents);
                console.log("inside useEffect incidents: ", res.data.data.incidents)
            })
            .catch((err) => console.error(err))
    }, [selectedHazardId])

    // console.log("hazards: ", hazards)
    // console.log("incidents:", incidents)
    // console.log("selectedhazardId: ", selectedHazardId)

    return (
        <div className='flex flex-col h-screen'>
            {/* navbar */}
            <div className='py-4 '>
                <li>
                    <NavLink to="/" className="flex items-center gap-1 text-gray-800">
                        <ArrowLeft size={15} />
                        <h1 className="">{t("back")}</h1>
                    </NavLink>
                </li>
            </div>
            <div className='flex flex-1 overflow-hidden'>
                {/* sidebar */}
                <section
                    className='w-64 sm:w-56 md:w-64 lg-72 bg-gray-100 overflow-y-auto'
                >
                    <aside>
                        <h3 className="font-bold p-4">Hazard Categories</h3>
                    </aside>
                    <ul>
                        {incidentReportStore.hazardTypes.map((hazard) => (
                            <li
                                key={hazard.id}
                                className='p-2 cursor-pointer rounded capitalize hover:bg-gray-200'
                                onClick={() => setSelectedHazardId(hazard.id)}
                            >
                                {hazard.name}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* map section */}
                <main className="flex-1 mr-2">
                    <MapView incidents={incidents} />
                    {incidents.length > 0 ? (
                        <h1></h1>
                    ) : (
                        <div>
                            <p>select a hazard to view incidents on map</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
})

export default IncidentView