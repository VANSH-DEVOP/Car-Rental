import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DefaultLayout from '../components/DefaultLayout';
import { getAllCars } from '../redux/actions/carsActions';
import { Col, Row, DatePicker, Typography, Empty, Button } from 'antd';
import { Link } from 'react-router-dom';
import { CarOutlined, SafetyOutlined, ThunderboltOutlined } from '@ant-design/icons';
import Spinner from '../components/Spinner';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Title, Paragraph } = Typography;

function Home() {
  const { cars } = useSelector((state) => state.carsReducer);
  const { loading } = useSelector((state) => state.alertsReducer);
  const [totalCars, setTotalcars] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCars());
  }, [dispatch]);

  useEffect(() => {
    setTotalcars(cars);
  }, [cars]);

  function setFilter(values) {
    if (!values || values.length !== 2) {
      setTotalcars(cars);
      return;
    }
    const selectedFrom = moment(values[0], 'MMM DD yyyy HH:mm');
    const selectedTo = moment(values[1], 'MMM DD yyyy HH:mm');
    const temp = [];

    for (const car of cars) {
      const slots = car.bookedTimeSlots || [];
      if (slots.length === 0) {
        temp.push(car);
        continue;
      }
      let available = true;
      for (const booking of slots) {
        if (
          selectedFrom.isBetween(booking.from, booking.to) ||
          selectedTo.isBetween(booking.from, booking.to) ||
          moment(booking.from).isBetween(selectedFrom, selectedTo) ||
          moment(booking.to).isBetween(selectedFrom, selectedTo)
        ) {
          available = false;
          break;
        }
      }
      if (available) temp.push(car);
    }
    setTotalcars(temp);
  }

  return (
    <DefaultLayout>
      <div className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-badge">Drive your way</div>
          <Title level={1} className="home-hero-title">
            Premium cars. Simple booking.
          </Title>
          <Paragraph className="home-hero-sub">
            Browse our fleet, pick your dates, and hit the road — insurance-ready vehicles and hourly pricing.
          </Paragraph>
          <Row gutter={[24, 24]} className="home-features">
            <Col xs={24} md={8}>
              <div className="home-feature-card">
                <CarOutlined className="home-feature-icon" />
                <strong>Wide selection</strong>
                <p>Sedans, SUVs, and EVs for every trip.</p>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="home-feature-card">
                <ThunderboltOutlined className="home-feature-icon" />
                <strong>Fast checkout</strong>
                <p>Book in minutes with instant confirmation.</p>
              </div>
            </Col>
            <Col xs={24} md={8}>
              <div className="home-feature-card">
                <SafetyOutlined className="home-feature-icon" />
                <strong>Trusted fleet</strong>
                <p>Well-maintained cars with clear pricing.</p>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <Row className="mt-4 mb-3" justify="center">
        <Col lg={20} sm={24}>
          <div className="home-filter-bar">
            <span className="home-filter-label">Filter by availability</span>
            <RangePicker
              showTime={{ format: 'HH:mm' }}
              format="MMM DD yyyy HH:mm"
              onChange={setFilter}
              style={{ maxWidth: '100%' }}
            />
          </div>
        </Col>
      </Row>

      {loading === true && <Spinner />}

      {!loading && totalCars.length === 0 && (
        <div className="home-empty-wrap">
          <Empty
            description="No cars match this range (or the fleet is empty). Try clearing the date filter or different dates."
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          >
            <Button type="primary" href="/register">
              Create an account
            </Button>
          </Empty>
        </div>
      )}

      <Row justify="center" gutter={[16, 24]} className="pb-5">
        {totalCars.map((car) => (
          <Col key={car._id} lg={5} sm={12} xs={24}>
            <div className="car p-2 bs1">
              <img src={car.image} className="carimg" alt={car.name} />
              <div className="car-content d-flex align-items-center justify-content-between">
                <div className="text-left pl-2">
                  <p>{car.name}</p>
                  <p>
                    Rent Per Hour {car.rentPerHour} /-
                  </p>
                </div>
                <div>
                  <button type="button" className="btn1 mr-2">
                    <Link to={`/booking/${car._id}`}>Book Now</Link>
                  </button>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>
    </DefaultLayout>
  );
}

export default Home;
