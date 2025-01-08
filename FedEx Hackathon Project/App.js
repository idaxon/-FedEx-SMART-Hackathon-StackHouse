import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [booked, setBooked] = useState(false);

  const handleLogin = () => {
    // Mock login - you can extend this to use backend authentication
    setUser({ email: 'test@example.com' });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const searchWarehouses = async () => {
    const response = await fetch(`http://localhost:5000/api/warehouses?location=${location}&start_date=${startDate}&end_date=${endDate}`);
    const data = await response.json();
    setWarehouses(data);
  };

  const handleBooking = async (warehouseId) => {
    const response = await fetch('http://localhost:5000/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 1,  // You can link this to the logged-in user
        warehouse_id: warehouseId,
        start_date: startDate,
        end_date: endDate,
      }),
    });

    const data = await response.json();
    if (data.message === 'Booking successful') {
      setBooked(true);
    }
  };

  const handleSelectWarehouse = (warehouse) => {
    setSelectedWarehouse(warehouse);
  };

  return (
    <div className="App">
      {!user ? (
        <div className="login-container">
          <h2>Login</h2>
          <button onClick={handleLogin}>Login as Guest</button>
        </div>
      ) : (
        <>
          <button onClick={handleLogout}>Logout</button>
          <div className="search-container">
            <h2>Search Warehouses</h2>
            <input 
              type="text" 
              placeholder="Location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
            />
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
            />
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
            />
            <button onClick={searchWarehouses}>Search</button>
          </div>

          {warehouses.length > 0 && !selectedWarehouse && (
            <div className="warehouses-list">
              {warehouses.map((warehouse) => (
                <div key={warehouse.warehouse_id} className="warehouse-card" onClick={() => handleSelectWarehouse(warehouse)}>
                  <h3>{warehouse.location}</h3>
                  <p>Size: {warehouse.size} sq ft</p>
                  <p>Price: ${warehouse.price_per_day}/day</p>
                  <button>View Details</button>
                </div>
              ))}
            </div>
          )}

          {selectedWarehouse && !booked && (
            <div className="booking-container">
              <h2>Book {selectedWarehouse.location}</h2>
              <p>Size: {selectedWarehouse.size} sq ft</p>
              <p>Price: ${selectedWarehouse.price_per_day}/day</p>
              <button onClick={() => handleBooking(selectedWarehouse.warehouse_id)}>Book Now</button>
            </div>
          )}

          {booked && (
            <div className="booking-success">
              <h2>Booking Successful!</h2>
              <p>You have successfully booked the warehouse.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
