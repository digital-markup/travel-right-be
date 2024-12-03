import { getLocationProcess } from "~/utils/actions/getLocationProcess"

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        if (!query) {
            return {
                message: "Error: No query found",
                statusCode: 400,
                body: null,
                success: false
            } as HTTPResponse
        }
        const { start, end } = query;
        const response = await getLocationProcess({ start: start.toLocaleString(), end: end.toLocaleString() });
        
        return {
            message: "Fetched successfully",
            body: response,
            statusCode: 200,
            success: true
        } as HTTPResponse
    } catch (error) {
        return error
    }
})