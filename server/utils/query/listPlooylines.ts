import axios from "axios"

type ListCoordinates = {
    start: {
        lat: number,
        lng: number
    },
    end: {
        lat: number,
        lng: number
    }
}
export const listPollyLines = async ({ start, end }: ListCoordinates) => {
    const params = {
        origin: `${start.lat},${start.lng}`,
        destination: `${end.lat},${end.lng}`,
        key: process.env.GCLOUD_API_KEY!,
    };

    const response = await axios.get("https://maps.googleapis.com/maps/api/directions/json", {
        params
    });

    if (!response) {
        console.log("No response" + response);
    }
    const route = response.data.routes[0];
    return route.overview_polyline.points;
}