import BaseUrl from "./BaseUrl";
import axios from 'axios';

export const getData=(subUrl)=>{
    const url = sessionStorage.getItem("mktUrl")+"api/"+subUrl
    return  axios.get(url)
    .then((res)=>{
      return res;
    })
}

export const postData=(subUrl,data)=>{
  const url = sessionStorage.getItem("mktUrl")+"api/"+subUrl;
  return axios.post(url,data)
  .then((res)=>{
    return res;
  })
}
export const putData=(subUrl,data)=>{
    const url = sessionStorage.getItem("mktUrl")+"api/"+subUrl;
    return axios.put(url,data)
        .then((res)=>{
            return res;
        })
}
export const deletData=(subUrl)=>{
    const url = sessionStorage.getItem("mktUrl")+"api/"+subUrl;
    return axios.delete(url)
        .then((res)=>{
            return res;
        })
}