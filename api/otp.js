import axios from 'axios';
import qs from 'qs'; // To encode the form data for the request

// Function to send SMS using Exotel
export const sendSmsExotel = async (phoneNumber, message) => {
  const exotelSid = 'bakenjoy1'; // Your Exotel SID
  const exotelApiKey = '7c1e931077882f30a7f20f49ebfb44073f76062b899a8b64'; // Your Exotel API Key
  const exotelApiToken = 'c1f0c2ef0fc3ae4fbd248bb2c6977a4928ff068f25f21b9f'; // Your Exotel API Token
  const senderId = 'YourSenderID'; // Replace with the sender ID approved by Exotel

  // API URL for sending SMS via Exotel
  const url = `https://${exotelApiKey}:${exotelApiToken}@api.exotel.com/v1/Accounts/${exotelSid}/Sms/send`;

  // Data to be sent with the API request
  const data = {
    From: senderId,      // Sender ID
    To: phoneNumber,     // Recipient's phone number
    Body: message,       // The actual SMS content
  };

  try {
    // Send a POST request to the Exotel API
    const response = await axios.post(url, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // Form-encoded data
      },
    });

    // Log the response for debugging purposes
    console.log('SMS sent successfully:', response.data);
    return response.data;
  } catch (error) {
    // Handle any errors that occur during the API request
    console.error('Error sending SMS via Exotel:', error.response ? error.response.data : error.message);
    throw error;
  }
};
