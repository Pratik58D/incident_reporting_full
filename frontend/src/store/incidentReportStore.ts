import {makeAutoObservable,runInAction } from "mobx";
import axios from "axios" ;
import { apiUrl } from "@/env";

interface HazardType {
    id:string;
    name: string;
    priority : string;
}

export class IncidentReportStore{
    hazardTypes : HazardType[] = [];
    previewUrl : string | null = null;
    uploading = false;

    constructor(){
        makeAutoObservable(this);
    }

    async fetchHazards(){
        try {
            const res = await axios.get(`${apiUrl}/hazards`);
            runInAction(()=>{
                this.hazardTypes = res.data.data;
            })
        } catch (error) {
            console.error("Error Fetching hazard: " , error);
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