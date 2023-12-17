import axios from "axios";

const URL = "http://localhost:8081"
export const callLogin = (data) => {
    return axios.post(`${URL}/user/login-admin`, data);
};
  
export const callFetchBooks = () => {
  return axios.get(`${URL}/book/all`);
};

export const callCreateBook = (data) => {
  return axios.post(`${URL}/book/create`, data);
};

export const callCreateImport = (data) => {
  return axios.post(`${URL}/book/import`, data);
};

export const callUpdateBook = (id, data) => {
  return axios.put(`${URL}/book/update/${id}`, data);
};

export const callDeleteBook = (id) => {
  return axios.delete(`${URL}/book/delete/${id}`);
};

export const callFetchOrders = () => {
  return axios.get(`${URL}/order/all`);
};

export const callFetchUsers = () => {
  return axios.get(`${URL}/user/all`);
};

export const callChangeStatus = (data) => {
  return axios.put(`${URL}/order/status`, data);
};

export const callUploadImage = (file) => {
  const bodyFormData = new FormData();
  bodyFormData.append("image", file);
  return axios({
    method: "POST",
    url: `${URL}/book/upload`,
    data: bodyFormData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};