import './App.css';
import { Navigate } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookingCar from './pages/BookingCar';
import UserBookings from './pages/UserBookings';
import AddCar from './pages/AddCar';
import AdminHome from './pages/AdminHome';
import EditCar from './pages/EditCar';
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getStoredUser } from "./utils/authStorage";
import DefaultLayout from './components/DefaultLayout'
// import ProtectedRoute from "./components/ProtectedRoute";

// export { getStoredUser };

export const ProtectedRoute = ({ children }) => {
  if (getStoredUser()) {
    return children;
  }
  return <Navigate to="/login" replace />;
};

export const AdminRoute = ({ children }) => {
  const user = getStoredUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        {/* <DefaultLayout> */}
          <Home />
        {/* </DefaultLayout> */}
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/booking/:carid',
    element: (
      <ProtectedRoute>
        <BookingCar />
      </ProtectedRoute>
    ),
    loader: ({ params }) => params.carid,
  },
  {
    path: '/userbookings',
    element: (
      <ProtectedRoute>
        <UserBookings />
      </ProtectedRoute>
    ),
  },
  {
    path: '/addcar',
    element: (
      <AdminRoute>
        <AddCar />
      </AdminRoute>
    ),
  },
  {
    path: '/editcar/:carid',
    element: (
      <AdminRoute>
        <EditCar />
      </AdminRoute>
    ),
    loader: ({ params }) => params.carid,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
          <AdminHome />
      </ProtectedRoute>
    ),
  },
]);

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const user = getStoredUser();
    if (user) {
      dispatch({
        type: "SET_USER",
        payload: user,
      });
    }
  }, [dispatch]);
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
