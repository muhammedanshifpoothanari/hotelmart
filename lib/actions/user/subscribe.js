'use server'
import axios from 'axios';

export const Subscribers = async (data) => {
    
    return axios.post(`${process.env.IPOUTBOUND}/Subscribers/`, data)
    .then(response => {
     console.log(response.data);
      return response.data;
    })
    .catch(error => {
      console.log(error.message);
      return error.message
    });
  };
