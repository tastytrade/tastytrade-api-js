import axios from "axios";

const api = axios.create({
  baseURL: "https://api.cert.tastyworks.com",
  headers: {
    "Content-type": "application/json",
    "Accept": "application/json",
  }
});

export async function postData(url: string, data: object, headers: object): Promise<any> {
  const response = await api.post(url, data, { headers });
  return response;
}