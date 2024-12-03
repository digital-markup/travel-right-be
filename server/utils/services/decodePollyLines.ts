import polyline from '@mapbox/polyline';
// calculate haversine distance between two points
const calculateDistance = (first: { lat: number; lng: number }, next: { lat: number; lng: number }) => {
    // earth radius in km
    const R = 6371;
    // maiden of two points
    let mFirst = next.lat - first.lat;
    let mSecond = next.lng - first.lng;

    // convert to radians
    const dLat = degreesToRadians(mFirst);
    const dLng = degreesToRadians(mSecond);

    // calculate distance
    const log = Math.sin(dLat / 2) **
        2 + Math.cos(degreesToRadians(first.lat)) *
        Math.cos(degreesToRadians(next.lat)) *
        Math.sin(dLng / 2) ** 2;

    return 2 * R * Math.asin(Math.sqrt(log));

}

// convert degrees to radians
const degreesToRadians = (degrees: number) => degrees * Math.PI / 180;

// decode polly lines into single points
export const decodePollyLines = (pollyLines: string): Array<{ lat: number; lng: number }> => {
    return polyline.decode(pollyLines).map(([lat, lng]) => ({ lat, lng }));
}

// release points alongside the route
export const releasePoints = (points: Array<{ lat: number; lng: number }>) => {
    const newPoints: Array<{ lat: number; lng: number }> = []
    let distance = 0;

    points.forEach((point, index) => {
        const start = points[index];
        const end = points[index + 1];
        const midpoint = calculateDistance(start, end);

        distance += midpoint;

        if (distance > 0.55) {
            newPoints.push(end);
            distance = 0;
        }
    })

    return newPoints;
}