import {makeAutoObservable,runInAction } from "mobx";
import axios from "axios" ;
import { apiUrl } from "@/env";

interface HazardType {
    id:number;
    name: string;
    priority : string;
}

// incident details
export interface IncidentType {
    incident_id: string;
    title: string;
    reported_by?: number;
    hazard_id?: string;
    hazard_name: string;
    name: string;
    description: string;
    created_at: Date;
    priority: "low" | "medium" | "high";
    latitude?: number,
    longitude?: number, 
}

export class IncidentReportStore{
    hazardTypes : HazardType[] = [];
    incidents :IncidentType[] = [];

    previewUrl : string | null = null;
    uploading = false;
    loading = false;

    constructor(){
        makeAutoObservable(this);
    }

    async fetchHazards(){
        try {
            const res = await axios.get(`${apiUrl}/hazards`);
            console.log(res.data.data)
            runInAction(()=>{
                this.hazardTypes = res.data.data;
                
            })
        } catch (error) {
            console.error("Error Fetching hazard: " , error);
        }
    }

     fetchIncidents = async(hazard?: string)=>{
        this.loading = true;
        try {
            const res = await axios.get(`${apiUrl}/incidents/incident-hazard`,{
                params : {hazard}
            });
            runInAction(()=>{
                this.incidents = res.data.incidentHazard;
                this.loading = false;
            })            
        } catch (error) {
            console.error("error fetching incidents: ", error);
            runInAction(()=>{
                this.loading = false;
            })
        }
    }

    setPreview(file?:FileList){
        if(file && file.length >0){
            this.previewUrl = URL.createObjectURL(file[0]);
        }else{
            this.previewUrl = null;
        }
    }

    setUploading(state :boolean){
        this.uploading = state;
    }
    reset(){
        this.previewUrl = null;
        this.uploading = false;
    }
}

export const incidentReportStore = new IncidentReportStore();