// Utility function to extract events from API response
// Handles both old array format and new paginated format
export const extractEventsFromResponse = (response) => {
    if (!response) {
        return [];
    }

    // If response has events property (paginated format)
    if (response.events && Array.isArray(response.events)) {
        return response.events;
    }

    // If response is directly an array (old format)
    if (Array.isArray(response)) {
        return response;
    }

    // Fallback to empty array
    return [];
};

// Utility function to extract pagination info from API response
export const extractPaginationFromResponse = (response) => {
    return response?.pagination || null;
};