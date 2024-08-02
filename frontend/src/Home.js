import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';

function Home() {
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalCost, setTotalCost] = useState(0);
  const [isCostCalculated, setIsCostCalculated] = useState(false);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get("http://localhost:8081")
      .then(res => {
        if (res.data.valid) {
          setName(res.data.username);
          setUserId(res.data.userId);
        } else {
          navigate("/login");
        }
      })
      .catch(err => console.log(err));

    axios.get("http://localhost:8081/rooms")
      .then(res => {
        setRooms(res.data);
      })
      .catch(err => console.log(err));
  }, []);

  const handleReservation = (room) => {
    setShowModal(true);
    setSelectedRoom(room);
    setStartDate("");
    setEndDate("");
    setIsCostCalculated(false);
  }

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
    setStartDate("");
    setEndDate("");
    setTotalCost(0);
    setIsCostCalculated(false);
  }

  const handleConfirmReservation = () => {
    const pricePerNight = selectedRoom.price_per_night;
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const days = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24));
    const totalPrice = days * pricePerNight;
    setTotalCost(totalPrice);

    axios.post("http://localhost:8081/bookings", {
      room_id: selectedRoom.room_id,
      user_id: userId,
      check_in_date: startDate,
      check_out_date: endDate,
      total_cost: totalCost
    })
      .then(res => {
        const bookingId = res.data.insertId;
        axios.put(`http://localhost:8081/rooms/${selectedRoom.room_id}`, {
          availability: 0
        })
          .then(res => {
            const updatedRoom = { ...selectedRoom, availability: 0, booking_id: bookingId };
            setSelectedRoom(updatedRoom);
            setShowModal(false);
            setStartDate("");
            setEndDate("");
            setIsCostCalculated(false);
            const updatedRooms = rooms.map(room => {
              if (room.room_id === selectedRoom.room_id) {
                return { ...room, availability: 0 };
              }
              return room;
            });
            setRooms(updatedRooms);
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  const handleDateChange = (e) => {
    const { id, value } = e.target;
    const currentDate = new Date().toISOString().split('T')[0];

    if (id === "startDate" && value >= currentDate) {
      setStartDate(value);
    } else if (id === "endDate" && value > startDate) {
      setEndDate(value);
    }
  }

  const handleCalculateCost = () => {
    const pricePerNight = selectedRoom.price_per_night;
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const days = Math.ceil((endDateObj - startDateObj) / (1000 * 60 * 60 * 24));
    const totalPrice = days * pricePerNight;
    setTotalCost(totalPrice);
    setIsCostCalculated(true);
  }

  const handleLogout = () => {
    axios.get("http://localhost:8081/logout")
      .then(res => {
        if (res.data.success) {
          navigate("/login");
        }
      })
      .catch(err => console.log(err));
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Container fluid style={{ padding: 0 }}>
        <div className="banner" style={{ backgroundColor: 'blue', padding: '10px', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ marginRight: '10px', fontSize: '35px', fontWeight: 'bold', marginLeft: '20px' }}>Lista pokoi w naszym hotelu</span>
          <Button variant="danger" onClick={handleLogout} style={{ marginRight: '20px' }}>Wyloguj</Button>
        </div>
      </Container>
      <Container>
        <Row xs={1} md={2} lg={3} className="g-4 justify-content-center">
          {rooms.map(room => (
            <Col key={room.room_id}>
              <Card>
                <Card.Body>
                  <Card.Title style={{ fontSize: '22px', marginBottom: '10px', fontWeight: 'bold' }}>Numer pokoju: {room.room_number}</Card.Title>
                  <Card.Text>
                    <strong>Typ:</strong> {room.room_type}<br />
                    <strong>Cena za noc:</strong> <strong>{room.price_per_night} zł</strong><br />
                    <strong>Dostępność:</strong> <span style={{ color: room.availability ? 'green' : 'red', fontWeight: 'bold' }}>{room.availability ? "Dostępny" : "Zajęty"}</span>
                  </Card.Text>
                  <div>
                    <Button variant="primary" onClick={() => handleReservation(room)} disabled={!room.availability}>
                      Zarezerwuj
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Rezerwacja pokoju</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="startDate">
              <Form.Label>Data zameldowania</Form.Label>
              <Form.Control type="date" value={startDate} onChange={handleDateChange} />
            </Form.Group>
            <Form.Group controlId="endDate">
              <Form.Label>Data wymeldowania</Form.Label>
              <Form.Control type="date" value={endDate} onChange={handleDateChange} />
            </Form.Group>
            <Button variant="primary" onClick={handleCalculateCost} disabled={!startDate || !endDate}>Oblicz koszt</Button>
            {isCostCalculated && <p>Łączny koszt: {totalCost} zł</p>}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Anuluj
          </Button>
          <Button variant="primary" onClick={handleConfirmReservation} disabled={!isCostCalculated}>
            Potwierdź rezerwację
          </Button>
        </Modal.Footer>
      </Modal>

      <footer className="mt-auto text-center" style={{ backgroundColor: '#f8f9fa', padding: '20px', width: '100%' }}>
        <p>&copy; 2024 Hotel XYZ. Wszelkie prawa zastrzeżone.</p>
      </footer>
    </div>
  );
}

export default Home;