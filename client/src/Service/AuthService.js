import axios from "axios";

export const login = async (data) => {
    try {
        console.log('Sending login request with data:', data);
        
        // Try different field name combinations
        const payloads = [
            { email: data.email, password: data.password },
            { username: data.email, password: data.password },
            { email: data.email, password: data.password, grant_type: 'password' }
        ];
        
        for (const payload of payloads) {
            try {
                console.log('Trying payload:', payload);
                const response = await axios.post("/api/v1.0/login", payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                console.log('Login response:', response);
                return response;
            } catch (payloadError) {
                console.log('Payload failed:', payloadError.response?.status);
                if (payloadError.response?.status !== 403) {
                    // If it's not 403, it might be the right payload but wrong credentials
                    throw payloadError;
                }
            }
        }
        
        // If all JSON payloads fail, try form data
        console.log('Trying form data...');
        const formData = new URLSearchParams();
        formData.append('email', data.email);
        formData.append('password', data.password);
        
        const response = await axios.post("/api/v1.0/login", formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
        });
        console.log('Login response (form data):', response);
        return response;
        
    } catch (error) {
        console.error('Login error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
}