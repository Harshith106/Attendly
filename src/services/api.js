// Use relative URLs since frontend and backend are on the same domain
const API_BASE_URL = '';

export const api = {
    async loginAndScrape(username, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/scrape-attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Login failed');
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};
