import { getGeoCodes } from "../query/getGeoCodes";
import { listPollyLines } from "../query/listPlooylines";

type GeoCode = {
    start: string;
    end: string;
};

export const getLocationProcess = async ({ start, end }: GeoCode): Promise<any> => {
    try {
        const response = await getGeoCodes({ startLocation: start, endLocation: end });
        if (!response) {
            return "An error occurred while processing your request.";
        }
        // get the direction & pollyline data
        const polyLineData = await listPollyLines({ start: response.departure, end: response.destination });
        const points = decodePollyLines(polyLineData);

        return {
            coordinates: [response.departure, response.destination],
            points: releasePoints(points),
        };
    } catch (error) {
        console.error("Chat process error:", error);
        return "An error occurred while processing your request.";
    }
};