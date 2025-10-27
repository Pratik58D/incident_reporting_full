import axios from "axios";

export const extractLocation = async (lat: number, lon: number) => {
    try {
        const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
        );
        
        console.log("the location is: ", response.data.display_name)
        return response.data.display_name

    } catch (error) {
        console.error("Error fetching location:", error);
        return "Location unavailable";
    }

}