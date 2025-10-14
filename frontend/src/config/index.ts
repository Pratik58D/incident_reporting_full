// import type { FormControl } from "../common/CommonForm";

// export const formControls: FormControl[] = [
//    {
//     name: "name",
//     label: "Hazard Name",
//     placeholder: "Flood, Landslide…",
//     componentType: "input",
//     type: "text",
//   },
//   {
//     name: "priority",
//     label: "Priority Level",
//     componentType: "select",
//     options: [
//       { label: "High", value: "high" },
//       { label: "Medium", value: "medium" },
//       { label: "Low", value: "low" },
//     ],
//   },
//     { 
//       componentType: "input", 
//       type: "text", 
//       name: "title",
//        label: "Title"
//        },
//     {
//       componentType: "textarea",
//       name: "description",
//       label: "Description",
//       placeholder: "Enter description",
//     },
//     {
//       componentType: "select",
//       name: "hazardType",
//       label: "Hazard Type",
//       options: [
//         { label: "Flood", value: "flood" },
//         { label: "Landslide", value: "landslide" },
//         { label: "Earthquake", value: "earthquake" },
//       ],
//     },
//      {
//     name: "latitude",
//     label: "Latitude",
//     placeholder: "27.7",
//     componentType: "input",
//     type: "number",
//   },
//   {
//     name: "longitude",
//     label: "Longitude",
//     placeholder: "85.3",
//     componentType: "input",
//     type: "number",
//   },
//      {
//     name: "file",
//     label: "Attach Photo/Video",
//     componentType: "input",
//     type: "file",
//   },
//     {
//     name: "road_name",
//     label: "Road Name",
//     placeholder: "Highway name or local road",
//     componentType: "input",
//     type: "text",
//   },
 
//      {
//     name: "blockage_type",
//     label: "Blockage Type",
 
//     componentType: "select", // hazard list again
//     options: [],
//   },

//      {
//     name: "estimated_clearance_time",
//     label: "Estimated Clearance Time (hours)",
//     placeholder: "e.g. 5",
//     componentType: "input",
//     type: "number",
//   },
//   ];


// export interface Hazard {
//   id: string;
//   name: string;
// }

// export interface IncidentFormData {
//   hazardTypeId: string;
//   newHazardType?: string;
//   title: string;
//   description: string;
//   latitude: string;
//   longitude: string;
//   isRoadBlockage: boolean;
//   file?: FileList;
//   roadName?: string;
//   estimatedClearance?: string;
// }

// export const defaultValues: IncidentFormData = {
//   hazardTypeId: "",
//   newHazardType: "",
//   title: "",
//   description: "",
//   latitude: "",
//   longitude: "",
//   isRoadBlockage: false,
// };


// import CommonForm from "../common/CommonForm";
// import { toast } from "react-toastify";

// interface IncidentFormData {
//   hazardTypeId: string;
//   newHazardType: string;
//   title: string;
//   description: string;
//   latitude: string;
//   longitude: string;
//   isRoadBlockage: boolean;
//   file: FileList | null;
//   roadName: string;
//   estimatedClearance: string;
// }

// const defaultValues: IncidentFormData = {
//   hazardTypeId: "",
//   newHazardType: "",
//   title: "",
//   description: "",
//   latitude: "",
//   longitude: "",
//   isRoadBlockage: false,
//   file: null,
//   roadName: "",
//   estimatedClearance: "",
// };

// // Sample hazard types - replace with your actual data
// const hazardTypeOptions = [
//   { value: "flood", label: "Flood" },
//   { value: "landslide", label: "Landslide" },
//   { value: "accident", label: "Traffic Accident" },
//   { value: "construction", label: "Construction" },
//   { value: "other", label: "Other" },
// ];

// const fields = [
//   { 
//     name: "hazardTypeId" as const, 
//     label: "Hazard Type", 
//     component: "select" as const, 
//     options: hazardTypeOptions,
//     required: true 
//   },
//   { 
//     name: "newHazardType" as const, 
//     label: "New Hazard Type (if Other)", 
//     component: "input" as const, 
//     placeholder: "Enter new hazard type" 
//   },
//   { 
//     name: "title" as const, 
//     label: "Title", 
//     component: "input" as const, 
//     placeholder: "Incident title",
//     required: true 
//   },
//   { 
//     name: "description" as const, 
//     label: "Description", 
//     component: "textarea" as const, 
//     placeholder: "Describe the incident in detail",
//     rows: 4,
//     required: true 
//   },
//   { 
//     name: "latitude" as const, 
//     label: "Latitude", 
//     component: "input" as const, 
//     type: "number",
//     placeholder: "e.g., 27.7172",
//     required: true 
//   },
//   { 
//     name: "longitude" as const, 
//     label: "Longitude", 
//     component: "input" as const, 
//     type: "number",
//     placeholder: "e.g., 85.3240",
//     required: true 
//   },
//   { 
//     name: "file" as const, 
//     label: "Upload Photo/Video", 
//     component: "file" as const 
//   },
//   { 
//     name: "isRoadBlockage" as const, 
//     label: "Is this a road blockage?", 
//     component: "checkbox" as const 
//   },
//   { 
//     name: "roadName" as const, 
//     label: "Road Name (if applicable)", 
//     component: "input" as const, 
//     placeholder: "Enter road name" 
//   },
//   { 
//     name: "estimatedClearance" as const, 
//     label: "Estimated Clearance Time", 
//     component: "input" as const, 
//     placeholder: "e.g., 2 hours, 1 day" 
//   },
// ];

// const IncidentReport = () => {
//   const onSubmit = async (data: IncidentFormData) => {
//     try {
//       // Validate required fields
//       if (!data.title || !data.description || !data.hazardTypeId) {
//         toast.error("Please fill in all required fields");
//         return;
//       }

//       // If "other" is selected, require new hazard type
//       if (data.hazardTypeId === "other" && !data.newHazardType.trim()) {
//         toast.error("Please specify the new hazard type");
//         return;
//       }

//       // Create FormData for file upload
//       const formData = new FormData();
      
//       // Append all form fields
//       Object.entries(data).forEach(([key, value]) => {
//         if (key === "file" && value && value.length > 0) {
//           formData.append(key, value[0]);
//         } else if (key !== "file") {
//           formData.append(key, String(value));
//         }
//       });

//       console.log("Form data to submit:", data);
      
//       // Replace this with your actual API call
//       // const response = await fetch('/api/incidents', {
//       //   method: 'POST',
//       //   body: formData,
//       // });
//       // 
//       // if (!response.ok) {
//       //   throw new Error('Failed to submit incident');
//       // }

//       toast.success("Incident reported successfully!");
//     } catch (err) {
//       console.error("Error submitting incident:", err);
//       toast.error("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="px-6 py-10 max-w-2xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Report an Incident</h1>
//           <p className="text-gray-600">
//             Help keep our community safe by reporting incidents and hazards in your area.
//           </p>
//         </div>
        
//         <CommonForm
//           fields={fields}
//           defaultValues={defaultValues}
//           onSubmit={onSubmit}
//           submitText="Submit Incident Report"
//         />
//       </div>
//     </div>
//   );
// };

// export default IncidentReport;