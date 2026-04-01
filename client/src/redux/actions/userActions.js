import axios from 'axios';
import { message } from 'antd';

export const userLogin = (reqObj) => async (dispatch) => {
  dispatch({ type: 'LOADING', payload: true });
  try {
    const response = await axios.post('/api/users/login', reqObj);
    localStorage.setItem('user', JSON.stringify(response.data));
    message.success('Login success');
    setTimeout(() => { window.location.href = '/'; }, 500);
  } catch (error) {
    const msg = error.response?.data?.message;
    message.error(msg || 'Invalid username or password');
    console.error(error.response?.data || error.message);
  } finally {
    dispatch({ type: 'LOADING', payload: false });
  }
};

export const userRegister = (reqObj) => async (dispatch) => {
  dispatch({ type: 'LOADING', payload: true });
  try {
    await axios.post('/api/users/register', reqObj);
    message.success('Registration successful');
    setTimeout(() => { window.location.href = '/login'; }, 500);
  } catch (error) {
    const msg = error.response?.data?.message;
    message.error(msg || 'Something went wrong');
    console.error(error.response?.data || error.message);
  } finally {
    dispatch({ type: 'LOADING', payload: false });
  }
};
