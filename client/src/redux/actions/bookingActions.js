import axios from 'axios';
import { message } from 'antd';

export const bookCar = (reqObj) => async (dispatch) => {
  dispatch({ type: 'LOADING', payload: true });
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    if (!token) {
      dispatch({ type: 'LOADING', payload: false });
      return;
    }

    await axios.post('/api/bookings/bookcar', reqObj, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: 'LOADING', payload: false });
    message.success('Your car booked successfully');
    setTimeout(() => { window.location.href = '/userbookings'; }, 500);
  } catch (error) {
    console.log(error);
    dispatch({ type: 'LOADING', payload: false });
    message.error('Something went wrong, please try later');
  }
};

export const getAllBookings = () => async (dispatch) => {
  dispatch({ type: 'LOADING', payload: true });
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    if (!token) {
      dispatch({ type: 'LOADING', payload: false });
      return;
    }

    const response = await axios.get('/api/bookings/getallbookings', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: 'GET_ALL_BOOKINGS', payload: response.data });
    dispatch({ type: 'LOADING', payload: false });
  } catch (error) {
    console.log(error);
    dispatch({ type: 'LOADING', payload: false });
  }
};
