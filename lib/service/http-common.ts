import axios from "axios";

const baseURL = "https://api.cert.tastyworks.com"

export async function postData(url: string, data: object = {}, headers: object = {}): Promise<any> {
  return axios.request({
    url,
    baseURL,
    method: 'post',
    data,
    headers  
  })
}