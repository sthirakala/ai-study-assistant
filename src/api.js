const API_URL = "http://localhost:8000";


export async function testBackend(){

    const response = await fetch(`${API_URL}/test`);

    const data = await response.json();

    return data;

}