const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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
