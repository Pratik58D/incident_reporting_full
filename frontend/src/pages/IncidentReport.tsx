import React, { useEffect } from "react";
import {observer} from "mobx-react-lite";
import { FormProvider, useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { AlertTriangle, ArrowLeft, Camera, MapPin, Upload } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { apiUrl } from "@/env";
import Personal_Information from "@/common/Personal_Information";
import { incidentReportStore } from "@/store/incidentReportStore";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/common/LanguageSelector";


interface IncidentFormData {
  // Personal Information fields
  name: string;
  phone_number: string;
  email?: string;

  // incident fields
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
  name: "",
  phone_number: "",
  email: "",
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

const IncidentHandling: React.FC = observer(() => {
  
  const methods = useForm<IncidentFormData>({
    defaultValues,
  })

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = methods;

  const watchHazardTypeId = watch("hazardTypeId");
  const watchIsRoadBlockage = watch("isRoadBlockage");
  const watchFile = watch("file");
  const navigate = useNavigate();

  const {t} = useTranslation();

  // file preview 
  useEffect(() => {
    incidentReportStore.setPreview(watchFile)
  }, [watchFile])

  //fetch hazards once
  useEffect(() => {
    incidentReportStore.fetchHazards();
  }, []);


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
      // 1. first create user Information
      const userResponse = await axios.post(`${apiUrl}/users`, {
        name: data.name,
        phone_number: data.phone_number,
        email: data.email || null
      })
      const userId = userResponse.data.user?.id || userResponse.data.id;

      let hazardId = data.hazardTypeId;;
      // If user entered new hazard type
      if (hazardId === "other" && data.newHazardType) {
        const res = await axios.post(`${apiUrl}/hazards`, { name: data.newHazardType });
        hazardId = res.data.data.id;
      }

      // 2. Create incident with user Id
      const incidentRes = await axios.post(`${apiUrl}/incidents`, {
        title: data.title,
        description: data.description,
        lat: parseFloat(data.latitude),
        lon: parseFloat(data.longitude),
        hazardId,
        reportedBy: userId,
        file_id: null,
      });

      const incidentId = incidentRes.data.incident.id;
      let fileId = null;

      // 3. Upload file if exists
      if (data.file && data.file.length > 0) {
        incidentReportStore.setUploading(true);
        const formData = new FormData();
        formData.append("file", data.file[0]);
        formData.append("incidentId", incidentId);
        const fileRes = await axios.post(`${apiUrl}/files/upload`, formData);
        fileId = fileRes.data.data.id;
        await axios.put(`${apiUrl}/incidents/${incidentId}`, { file_id: fileId });
        incidentReportStore.setUploading(false);
      }

      // 4. Create road blockage if selected
      if (data.isRoadBlockage) {
        await axios.post(`${apiUrl}/road-blockages`, {
          incidentId,
          roadName: data.roadName,
          blockageType: hazardId,
          estimatedClearanceTime: data.estimatedClearance,
        });
      }

      toast.success("Incident reported successfully!");
      reset(defaultValues);
      incidentReportStore.reset();
      setValue("file",undefined)

    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(`Error: ${errorMessage}`);
      } else {
        toast.error("Something went wrong.");
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <nav className="fixed top-0 right-0 left-0 z-50 bg-backgrounds/95 backdrop-blur-sm border-b border-b-gray-300 shadow-md p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* desktop menu */}
          <div className="flex items-center gap-4">
            <NavLink to="/" className="flex items-center gap-1 text-gray-800">
              <ArrowLeft size={15} />
              <h1 className="">{t("back")}</h1>
            </NavLink>
          </div>
          {/* logo */}
          <div className="flex items-center gap-1">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-button-secondary text-white">
              <AlertTriangle />
            </div>
            <div>
              <h1 className="hidden sm:flex font-semibold text-xl text-black">{t("incident_card_title")}</h1>
            </div>
          </div>
          <LanguageSelector />

        </div>
      </nav>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className=" max-w-sm sm:max-w-xl md:max-w-3xl mx-auto mt-32 flex flex-col gap-8 bg-transparent ">
          <section>
            <Personal_Information/>
          </section>

          {/* incident form */}

          <section className=" bg-white shadow-lg  hover:shadow-2xl rounded-2xl border border-gray-200 mb-10">
            <h1 className="font-bold text-lg py-4 text-center">{t("report_new_incident")}</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 justify-between sm:grid-cols-2 gap-y-4 px-8 py-4 gap-x-8  ">
              {/* Hazard Type */}
              <div className=" flex flex-col gap-2 col-span-2 sm:col-span-1">
                <label>{t("hazard_type")} *</label>
                <select
                  {...register("hazardTypeId", { required: "Hazard type is required" })}
                  className="bg-gray-100 p-2 border border-slate-300 rounded-md text-sm"
                >
                  <option value="" className="text-form-label">
                    Select Hazard Type
                  </option>
                  {incidentReportStore.hazardTypes.map((h) => (
                    <option key={h.id} value={h.id} className="text-form-label">
                      {h.name}
                    </option>
                  ))}
                  <option value="other" className="text-form-label">Other</option>
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
                <label>{t("priority")} *</label>
                <select
                  {...register("priority", { required: "Hazard type is required" })}
                  className="bg-gray-200 p-2 border border-slate-300 rounded-md text-sm text-form-label"
                >
                  <option value="">
                    Select priority
                  </option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                {errors.priority && <p className="text-red-500">{errors.priority.message}</p>}
              </div>

              {/* Incident title */}
              <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">

                <label>{t("incident_title")} *</label>
                <input
                  {...register("title", { required: "Title is required" })}
                  placeholder="Brief description of incident"
                  className="input-field"
                />
                {errors.title && <p className="text-error">{errors.title.message}</p>}

              </div>
              {/* Incident description */}
              <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">

                <label>{t("incident_desc")} *</label>
                <textarea
                  {...register("description", { required: "Description is required" })}
                  rows={4}
                  className="border border-slate-300 rounded-md p-2 placeholder:text-sm"
                  placeholder="Summarize what happened, when it took place, and any important context.."
                />
                {/* {errors.description && <p className="text-red-500">{errors.description.message}</p>} */}

              </div>
              {/* Location */}
              <div className="col-span-2 flex flex-col gap-2">
                <div className="flex  items-center gap-2 ">
                  <label className=" hidden sm:block text-form-placeholder sm:w-1/2 ">
                    {t("auto_location")} *
                  </label>
                  <div className=" sm:w-1/2 w-full sm:pl-2">
                    <button
                      type="button"
                      className="flex items-center justify-center gap-2 py-2 bg-red-700 text-white font-semibold rounded cursor-pointer w-full"
                      onClick={getLocation}
                    >
                      <MapPin />
                      {t("use_location")}

                    </button>

                  </div>
                </div>

                {/* manually latitude long */}
                <div className="flex flex-col md:flex-row justify-between space-x-8 space-y-4">
                  {/* latitude */}
                  <div className="flex flex-col gap-2 md:w-1/2">
                    <label>{t("latitude")}</label>
                    <input
                      {...register("latitude", { required: "Latitude is required" })}
                      placeholder="Latitude"
                      className="border border-slate-300 rounded-md p-2 w-full"
                    />
                    {errors.latitude && <p className="text-red-500">{errors.latitude.message}</p>}
                  </div>

                  {/* longitude */}
                  <div className="flex flex-col gap-2 md:w-1/2">
                    <label>{t("longitude")}</label>
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
                <label className="flex items-center gap-2 mb-2 text-form-label" >
                  <Camera size={20} />
                  <p className="text-form-label">{t("media")}</p>
                </label>
                <label htmlFor="file"
                  className="border-2 border-dashed border-form-placeholder min-h-[200px] flex items-center justify-center rounded-md"
                >
                  <div className="flex flex-col items-center text-center  text-form-placeholder">
                    <Upload size={50} />
                    <span className="text-lg ">
                      Upload photos or documents related to the incident
                    </span>
                    <span
                      className="text-base">
                      Photos and videos can help emergency responders
                    </span>
                  </div>
                </label>

                {incidentReportStore.previewUrl && (
                  <div className="mt-3">
                    <p className="font-semibold">Preview:</p>
                    <img
                      src={incidentReportStore.previewUrl}
                      alt="file preview"
                      className="mt-2 max-h-48 object-contain border"
                    />
                  </div>
                )}

                {incidentReportStore.uploading && (
                  <p className="mt-2 text-blue-600 font-medium">Uploading file...</p>
                )}
              </div>

              {/* Road blockage */}
              <div className="col-span-2 flex flex-col gap-2">
                <div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" {...register("isRoadBlockage")} />
                   Road Blockage
                  </label>
                </div>

                {watchIsRoadBlockage && (
                  <div className="flex flex-col md:flex-row md:justify-between space-x-8 space-y-4">
                    <div className="flex flex-col gap-2 md:w-1/2">
                      <label>{t("road_name")}</label>
                      <input
                        {...register("roadName", { required: "Road name is required" })}
                        placeholder="Road Name"
                        className="border border-slate-300 rounded-md p-2"
                      />
                      {errors.roadName && <p className="text-red-500">{errors.roadName.message}</p>}

                    </div>
                    <div className="flex flex-col gap-2 md:w-1/2">
                      <label>{t("clearance_time")}</label>
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
                className=" bg-red-600 text-white p-2 rounded cursor-pointer sm:w-50"
              >
                Submit Incident
              </button>
            </form>
          </section>

        </div>
      </div>
    </FormProvider>

  );
});

export default IncidentHandling;
