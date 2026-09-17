const API_URL = import.meta.env.VITE_API_URL;

export async function testBackend(){

    const response = await fetch(`${API_URL}/test`);

    const data = await response.json();

    return data;

}