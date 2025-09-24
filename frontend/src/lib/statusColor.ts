const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "low":
                return "bg-green-500";
            case "medium":
                return "bg-yellow-500";
            case "high":
                return "bg-red-500";
            default:
                return "bg-gray-400";
        }
};

export default getStatusColor;