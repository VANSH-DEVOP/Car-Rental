import { message } from 'antd';
import axios from 'axios';
// const authMiddleware = require("../middleware/authMiddleware");

export const getAllCars = () => async (dispatch) => {
  dispatch({ type: 'LOADING', payload: true });

  try {
    // ✅ Get user from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      dispatch({ type: 'LOADING', payload: false });
      return;
    }

    const response = await axios.get("/api/cars/getallcars", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch({ type: 'GET_ALL_CARS', payload: response.data });
    dispatch({ type: 'LOADING', payload: false });

  } catch (error) {
    console.log(error.response?.data);
    dispatch({ type: 'LOADING', payload: false });
  }
};

export const addCar = (reqObj) => async (dispatch) => {
  dispatch({ type: 'LOADING', payload: true });
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    if (!token) {
      dispatch({ type: 'LOADING', payload: false });
      return;
    }

    await axios.post('/api/cars/addcar', reqObj, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: 'LOADING', payload: false });
    message.success('New car added successfully');
    setTimeout(() => { window.location.href = '/admin'; }, 500);
  } catch (error) {
    console.log(error);
    dispatch({ type: 'LOADING', payload: false });
  }
};

export const editCar = (reqObj) => async (dispatch) => {
  dispatch({ type: 'LOADING', payload: true });
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    if (!token) {
      dispatch({ type: 'LOADING', payload: false });
      return;
    }

    await axios.post('/api/cars/editcar', reqObj, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: 'LOADING', payload: false });
    message.success('Car details updated successfully');
    setTimeout(() => { window.location.href = '/admin'; }, 500);
  } catch (error) {
    console.log(error);
    dispatch({ type: 'LOADING', payload: false });
  }
};

export const deleteCar = (reqObj) => async (dispatch) => {
  dispatch({ type: 'LOADING', payload: true });
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;
    if (!token) {
      dispatch({ type: 'LOADING', payload: false });
      return;
    }

    await axios.post('/api/cars/deletecar', reqObj, {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: 'LOADING', payload: false });
    message.success('Car deleted successfully');
    setTimeout(() => { window.location.reload(); }, 500);
  } catch (error) {
    console.log(error);
    dispatch({ type: 'LOADING', payload: false });
  }
};
