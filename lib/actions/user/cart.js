'use server'
import axios from 'axios';

export const addToCart =  (data) => {
    
    return axios.post(`${process.env.IPOUTBOUND}/addToCart/`, data)
    .then(response => {
    
      return response.data;
    })
    .catch(error => {
      
      console.error('Error creating profile:', error);
    });
  };

  
export const getCartById =  (id) => {
  
  return axios.get(`${process.env.IPOUTBOUND}/getCartById/${id}`)
  .then(response => {
    return response.data;
  })
  .catch(error => {
    console.error('Error creating profile:', error);
  });
};



export const removeFromCartDb =  (data) => {
    
  return axios.patch(`${process.env.IPOUTBOUND}/removeFromCart/`, data)
  .then(response => {
  
    return response.data;
  })
  .catch(error => {
    
    console.error('Error creating profile:', error);
  });
};