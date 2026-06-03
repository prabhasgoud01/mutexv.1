import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Reusable SMS Service for Fast2SMS Bulk V2
 * @param {string|string[]} numbers - Phone number(s) to send to. Array or comma separated string.
 * @param {string} message - The message content
 * @returns {object} The API response data
 */
export const sendSMS = async (numbers, message) => {
  try {
    console.log("-----------------------------------------");
    console.log("SMS SERVICE DEBUGGING INITIALIZED");
    
    // 1. Verify Environment Variables
    if (!process.env.FAST2SMS_API_KEY) {
      console.error("FATAL ERROR: FAST2SMS_API_KEY is not defined in environment variables!");
      throw new Error('FAST2SMS_API_KEY is missing from environment variables');
    }
    console.log("FAST2SMS_API_KEY LOADED:", "OK (Length: " + process.env.FAST2SMS_API_KEY.length + ")");
    console.log("FAST2SMS_API_KEY (raw):", process.env.FAST2SMS_API_KEY);

    // 2. Format Numbers
    let numbersList = Array.isArray(numbers) ? numbers : numbers.split(',');
    let formattedNumbers = numbersList
      .map(num => String(num).replace(/\D/g, '')) // Remove non-digits
      .map(num => {
         // Fast2SMS requires 10 digit numbers without +91 or 91
         if (num.length === 12 && num.startsWith('91')) return num.substring(2);
         if (num.length > 10) return num.substring(num.length - 10);
         return num;
      })
      .filter(num => num.length === 10);

    if (formattedNumbers.length === 0) {
      throw new Error("No valid 10-digit mobile numbers provided");
    }

    const numbersString = formattedNumbers.join(',');
    console.log("FORMATTED NUMBERS STRING:", numbersString);
    console.log("MESSAGE LENGTH:", message.length);

    // 3. Execute Axios Request exactly as requested
    const response = await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "q",
        message: message,
        language: "english",
        numbers: numbersString,
      },
      {
        headers: {
          authorization: process.env.FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // 4. Log Success Response
    console.log("SMS RESPONSE:", response.data);
    console.log("-----------------------------------------");
    return response.data;
  } catch (error) {
    // 5. Log Error Response
    console.error("SMS ERROR:", error.response?.data || error.message);
    console.log("-----------------------------------------");
    throw error;
  }
};
