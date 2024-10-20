'use server'
import axios from 'axios';

export const createOrders =  (data) => {
    
    return axios.post(`${process.env.IPOUTBOUND}/createOrder/`, data)
    .then(response => {
    
      return response.data;
    })
    .catch(error => {
      
      console.error('Error creating profile:', error);
    });
  };

  
export const getOrdersByUserId =  (id) => {

  return axios.get(`${process.env.IPOUTBOUND}/getOrdersByUserId/${id}`)
  .then(response => {
  
    return response.data;
  })
  .catch(error => {
    
    console.error('Error creating profile:', error);
  });
};



export const removeFromOrdersDb =  (id) => {

    return axios.patch(`${process.env.IPOUTBOUND}/cancelOrder/`, {"_id":id})
    .then(response => {
    
      return response.data;
    })
    .catch(error => {
      
      console.error('Error creating profile:', error);
    });
  };
  
