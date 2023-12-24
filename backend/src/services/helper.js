import axios from 'axios';
import asyncHandler from '../services/asyncHandler.js';
import CustomError from '../services/CustomError.js';

export const checkAPIResponse = asyncHandler(async (url) => {
  const response = await axios.get(url);
  if (response.status === 200) {
    return response.status;
  }
  throw new CustomError('Server is down', response.status);
});
