import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { AlertTriangle, ArrowLeft, File, MapPin } from "lucide-react";
import { NavLink } from "react-router-dom";

interface IncidentFormData {
  hazardTypeId: string;
  newHazardType?: string;
  priority: string;
  title: string;
  description: string;
  latitude: string;
  longitude: string;
  file?: FileList;
  isRoadBlockage: boolean;
  roadName?: string;
  estimatedClearance?: string;
}

const defaultValues: IncidentFormData = {
  hazardTypeId: "",
  newHazardType: "",
  priority: "",
  title: "",
  description: "",
  latitude: "",
  longitude: "",
  isRoadBlockage: false,
  roadName: "",
  estimatedClearance: "",
};

const IncidentHandling: React.FC = () => {
  const [hazardTypes, setHazardTypes] = useState<{ id: string; name: string, priority: string }[]>([]);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<IncidentFormData>({
    defaultValues,
  });

  const watchHazardTypeId = watch("hazardTypeId");
  const watchIsRoadBlockage = watch("isRoadBlockage");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/hazards")
      .then((res) => setHazardTypes(res.data.data))
      .catch((err) => console.error("Error fetching hazard types", err));
  }, []);

  console.log(hazardTypes)

  // Get device location automatically
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue("latitude", position.coords.latitude.toString());
          setValue("longitude", position.coords.longitude.toString());
        },
        (error) => {
          console.warn("Error getting location:", error.message);
        }
      );
    } else {
      console.warn("Geolocation is not supported by this browser.");
    }
  };

  const onSubmit: SubmitHandler<IncidentFormData> = async (data) => {
    try {
      let hazardId = data.hazardTypeId;

      // If user entered new hazard type
      if (data.hazardTypeId === "other" && data.newHazardType) {
        const res = await axios.post("http://localhost:5000/api/hazards", { name: data.newHazardType });
        hazardId = res.data.data.id;
      }

      // 1. Create incident
      const incidentRes = await axios.post("http://localhost:5000/api/incidents", {
        title: data.title,
        description: data.description,
        lat: parseFloat(data.latitude),
        lon: parseFloat(data.longitude),
        hazardId,
        reportedBy: 100, // replace with actual user id
        file_id: null,
      });

      const incidentId = incidentRes.data.incident.id;
      let fileId = null;

      // 2. Upload file if exists
      if (data.file && data.file.length > 0) {
        const formData = new FormData();
        formData.append("file", data.file[0]);
        formData.append("incidentId", incidentId);

        const fileRes = await axios.post("http://localhost:5000/api/files/upload", formData);
        fileId = fileRes.data.data.id;

        await axios.put(`http://localhost:5000/api/incidents/${incidentId}`, { file_id: fileId });
      }

      // 3. Create road blockage if selected
      if (data.isRoadBlockage) {
        await axios.post("http://localhost:5000/api/road-blockages", {
          incidentId,
          roadName: data.roadName,
          blockageType: hazardId,
          estimatedClearanceTime: data.estimatedClearance,
        });
      }

      toast.success("Incident reported successfully!");
      reset(defaultValues);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <>
     <nav className="fixed top-0 right-0 left-0 z-50 bg-backgrounds/95 backdrop-blur-sm border-b border-b-gray-300 shadow-lg p-5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
         {/* desktop menu */}
        <div className="flex items-center gap-4">
          <NavLink to= "/" className="flex items-center gap-1 text-gray-800">
            <ArrowLeft size={15} />
            <h1 className="">Back</h1>
            </NavLink>
        </div>
        {/* logo */}
        <div  className="flex items-center gap-1">       
         <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-button-secondary text-white">
           <AlertTriangle />
         </div>
        <div>
          <h1 className="hidden sm:flex font-semibold text-xl text-black">Report incident</h1>
        </div>
          </div>
       
        </div>
    </nav>
     <div className="max-w-4xl mx-auto mt-25 mb-5 p-5 bg-white shadow-lg hover:shadow-2xl">
        {/* logo */}
        <div className="flex items-center justify-center gap-2 mb-5">       
         <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-button-secondary text-white">
           <AlertTriangle  size={40}/>
         </div>
          <h1 className="font-extrabold text-2xl text-button-secondary">Incident Report</h1>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:space-x-4">
        {/* Hazard Type */}
        <div className=" flex flex-col gap-2 col-span-2 sm:col-span-1">
          <label>Hazard Type</label>
          <select
            {...register("hazardTypeId", { required: "Hazard type is required" })}
            className="bg-gray-200 p-2 border border-slate-300 rounded-md"
          >
            <option value="" className="text-slate-500">
              Select Hazard Type
            </option>
            {hazardTypes.map((h) => (
              <option key={h.id} value={h.id} className="text-slate-500">
                {h.name}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
          {watchHazardTypeId === "other" && (
            <input
              {...register("newHazardType", { required: "Please specify new hazard type" })}
              placeholder="Enter new hazard type"
              className="border border-slate-300 rounded-md p-2"
            />
          )}
          {errors.hazardTypeId && <p className="text-red-500">{errors.hazardTypeId.message}</p>}
          {errors.newHazardType && <p className="text-red-500">{errors.newHazardType.message}</p>}

        </div>

        {/*Hazard priority  */}
        <div className=" flex flex-col gap-2 col-span-2 sm:col-span-1">
          <label>Priority</label>
          <select
            {...register("priority", { required: "Hazard type is required" })}
            className="bg-gray-200 p-2 border border-slate-300 rounded-md"
          >
            <option value="" className="text-slate-500">
              select priority
            </option>
            {hazardTypes.map((h) => (
              <option key={h.id} value={h.id} className="text-slate-500">
                {h.priority}
              </option>
            ))}
          </select>
          {errors.priority && <p className="text-red-500">{errors.priority.message}</p>}
        </div>

        {/* Incident title */}
        <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">

          <label>Incident Title</label>
          <input
            {...register("title", { required: "Title is required" })}
            placeholder="Title"
            className="border border-slate-300 rounded-md p-2"
          />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        </div>
        {/* Incident description */}
        <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">

          <label>Description</label>
          <textarea
            {...register("description", { required: "Description is required" })}
            rows={4}
            className="border border-slate-300 rounded-md p-2"
          />
          {/* {errors.description && <p className="text-red-500">{errors.description.message}</p>} */}

        </div>
        {/* Location */}
        <div className="col-span-2 flex flex-col gap-2">
          <div className="flex  items-center gap-2">
            <label className="hidden sm:block sm:w-1/2 ">
            We'll detect your GPS coordinates automatically
            </label>           
              <button
              type="button"
              className="flex justify-between items-center px-5 py-2 bg-blue-600 text-white font-semibold p-2 rounded cursor-pointer sm:w-1/2 w-full" 
              onClick={getLocation}
            >
                 <MapPin />
              Use My Location
            </button>

          </div>

          {/* manually latitude long */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-between">
            {/* latitude */}
            <div className="flex flex-col gap-2 md:w-1/2">
              <label>Latitude</label>
              <input
                {...register("latitude", { required: "Latitude is required" })}
                placeholder="Latitude"
                className="border border-slate-300 rounded-md p-2 w-full"
              />
              {errors.latitude && <p className="text-red-500">{errors.latitude.message}</p>}
            </div>

            {/* longitude */}
            <div className="flex flex-col gap-2 md:w-1/2">
              <label>Longitude</label>
              <input
                {...register("longitude", { required: "Longitude is required" })}
                placeholder="Longitude"
                className="border border-slate-300 rounded-md p-2 w-full"
              />
              {errors.longitude && <p className="text-red-500">{errors.longitude.message}</p>}
            </div>
          </div>

        </div>

        {/* File upload */}
        <div className="col-span-2">
          <input id="file" type="file" {...register("file")} className="sr-only" />
          <label htmlFor="file"
            className="border-2 border-dashed min-h-[200px] flex items-center justify-center rounded-md"
          >
            <div className="flex flex-col items-center text-center gap-2">
              <File size={50} className="text-[#07074D]"/>
              <span className="mb-2 block text-xl font-semibold text-[#07074D]">
               Upload photos or documents related to the incident
              </span>
              <span
                className="inline-flex  rounded border border-[#e0e0e0] py-2 px-7 text-base font-medium text-[#07074D]">
                Browse file
              </span>
            </div>
          </label>
        </div>

        {/* Road blockage */}
        <div className=" col-span-2 flex flex-col gap-2">
          <div>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("isRoadBlockage")} />
              Road Blockage
            </label>
          </div>

          {watchIsRoadBlockage && (
            <div className="flex flex-col md:flex-row md:justify-between md:gap-4 gap-2">
              <div className="flex flex-col gap-2 md:w-1/2">
                <label>Road Name</label>
                <input
                  {...register("roadName", { required: "Road name is required" })}
                  placeholder="Road Name"
                  className="border border-slate-300 rounded-md p-2"
                />
                {errors.roadName && <p className="text-red-500">{errors.roadName.message}</p>}

              </div>
              <div className="flex flex-col gap-2 md:w-1/2">
                <label>Estimated Clearance Time</label>
                <input
                  {...register("estimatedClearance", { required: "Estimated clearance is required" })}
                  placeholder="e.g. 2 hours"
                  className="border border-slate-300 rounded-md p-2"
                />
                {errors.estimatedClearance && <p className="text-red-500">{errors.estimatedClearance.message}</p>}
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          className=" bg-red-600 text-white p-2 rounded mt-2 cursor-pointer sm:w-50"
        >
          Submit Incident
        </button>
      </form>

    </div>
    </>
   
  );
};

export default IncidentHandling;
