// src/lib/api.ts
const API_URL = '/api';

export const api = {
    auth: {
        login: async (username: string, password: string) => {
            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                    credentials: 'include'
                });
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || response.statusText);
                }
                const result = await response.json();
                return result;
            } catch (error) {
                console.error('Login error:', error);
                throw error;
            }
        },
        logout: async () => {
            try {
                const response = await fetch(`${API_URL}/logout`, {
                    method: 'POST',
                    credentials: 'include', // 這樣才能清除 cookie
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || response.statusText);
                }

                return response.json();
            } catch (error) {
                console.error('Logout error:', error);
                throw error;
            }
        },
        me: async () => {
            try {
                const response = await fetch(`${API_URL}/me`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || response.statusText);
                }
                const result = await response.json();
                return result;
            } catch (error) {
                console.error('Get user info error:', error);
                throw error;
            }
        }
    },
    reserve: {
        add: async (reservationData: any) => {
            try {
                const response = await fetch(`${API_URL}/reserve/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(reservationData),
                    credentials: 'include'
                });
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || response.statusText);
                }
                const text = await response.text();
                return text ? JSON.parse(text) : null;
            } catch (error) {
                console.error('Add reservation error:', error);
                throw error;
            }
        },
        all: async () => {
            try {
                const url = `${API_URL}/reserve/all`;
                console.log('Get all reservations request:', {
                    url,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });

                console.log('Get all reservations raw response:', {
                    status: response.status,
                    statusText: response.statusText,
                    headers: Object.fromEntries(response.headers.entries())
                });

                if (!response.ok) {
                    const text = await response.text();
                    console.error('API Error response:', text);
                    throw new Error(text || response.statusText);
                }
                const text = await response.text();
                console.log('Raw response text:', text);
                const data = text ? JSON.parse(text) : null;
                console.log('Get all reservations parsed data:', data);
                console.log('Data type:', typeof data);
                console.log('Is array?', Array.isArray(data));

                // 處理不同的返回格式
                if (!data) {
                    return { reserves: [] };
                }

                // 如果 data 本身就是數組，則包裝成期望的格式
                if (Array.isArray(data)) {
                    return { reserves: data };
                }

                // 如果 data 是對象且有 reserves 屬性
                if (data && Array.isArray(data.reserves)) {
                    return data;
                }

                // 其他情況，返回空數組
                console.warn('Invalid response format from /reserve/all:', data);
                return { reserves: [] };
            } catch (error) {
                console.error('Get all reservations error:', error);

                if (error instanceof Error) {
                    if (
                        error.message.includes('timeout') ||
                        error.message.includes('FUNCTION_INVOCATION_TIMEOUT')
                    ) {
                        return { reserves: [] };
                    }
                }

                throw error;
            }
        },
        updateStatus: async (reservationId: string, status: string, inspector: string) => {
            try {
                const response = await fetch(`${API_URL}/reserve/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        reservationId,
                        status,
                        inspector
                    }),
                    credentials: 'include'
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(text || response.statusText);
                }

                const text = await response.text();
                return text ? JSON.parse(text) : null;
            } catch (error) {
                console.error('Update reservation status error:', error);
                throw error;
            }
        }
    },
};
