import { connect } from 'mongoose';

export const connectDB = (url) => {  
  return connect(url);
};
