import React, { useMemo } from 'react';
import { Dropdown, Button, Row, Col } from 'antd';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeStoredUser } from "../utils/authStorage";

function DefaultLayout(props) {
  const user = useSelector((state) => state.authReducer.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = useMemo(() => {
    const items = [
      {
        key: 'home',
        label: <Link to="/">Home</Link>,
      },
      {
        key: 'bookings',
        label: <Link to="/userbookings">Bookings</Link>,
      },
    ];
    if (user?.isAdmin) {
      items.push({
        key: 'admin',
        label: <Link to="/admin">Admin</Link>,
      });
    }
    items.push({
      key: 'logout',
      label: <span style={{ color: 'slateblue' }}>Logout</span>,
      onClick: () => {
        // Clear localStorage
        removeStoredUser();
    
        // Clear Redux
        dispatch({ type: "LOGOUT_USER" });
    
        // Navigate without reload
        navigate("/login");
      },
    });
    return { items };
  }, [user?.isAdmin, user?.username]);

  return (
    <div>
      <div className="header bs1">
        <Row gutter={16} justify="center">
          <Col lg={20} sm={24} xs={24}>
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="mb-0">
                <b>
                  <Link to="/" style={{ color: 'slateblue' }}>
                    Car Rental
                  </Link>
                </b>
              </h1>
              <Dropdown menu={menuItems} placement="bottomRight">
                <Button>{user ? user.username : 'Menu'}</Button>
              </Dropdown>
            </div>
          </Col>
        </Row>
      </div>

      <div className="content">{props.children}</div>

      <div className="footer text-center">
        <hr />
        <p>Designed and Developed By Vansh Bansal 🪽</p>
      </div>
    </div>
  );
}

export default DefaultLayout;
