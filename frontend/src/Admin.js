import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from "react-router-dom"

function Admin() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [room, setRoom] = useState([]);
    const [rezerwacja, setRezerwacja] = useState([]);

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get("http://localhost:8081")
            .then(res => {
                if (res.data.valid) {
                    setName(res.data.username);
                } else {
                    navigate("/login");
                }
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8081/rooms')
            .then(res => setRoom(res.data))
            .catch(err => console.log(err));
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8081/rezerwacje')
            .then(res => setRezerwacja(res.data))
            .catch(err => console.log(err));
    }, [])

    const handleLogout = () => {
        axios.get("http://localhost:8081/logout")
            .then(res => {
                if (res.data.success) {
                    navigate("/login");
                }
            })
            .catch(err => console.log(err));
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete('http://localhost:8081/room/' + id)
            window.location.reload()
        } catch (err) {
            console.log(err);
        }
    }

    const handleDeleteRezerwacje = async (id) => {
        try {
            await axios.delete('http://localhost:8081/rezerwacje/' + id)
            window.location.reload()
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="d-flex flex-column vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-75 bg-white rounded p-3 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Link to="/create" className="btn btn-success me-2">Dodaj pokój</Link>
                    <h2 className="mb-0">Lista pokoi</h2>
                    <button onClick={handleLogout} className="btn btn-danger">Wyloguj</button>
                </div>
                <table className="table" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>Nr pokoju</th>
                            <th>Typ pokoju</th>
                            <th>Cena za noc (zł)</th>
                            <th>Dostępność</th>
                            <th>Aktualizowanie</th>
                            <th>Usuwanie</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            room.map((data, i) => (
                                <tr key={i}>
                                    <td>{data.room_number}</td>
                                    <td>{data.room_type}</td>
                                    <td>{data.price_per_night} zł</td>
                                    <td>{data.availability === 1 ? "Dostępny" : "Niedostępny"}</td>
                                    <td><Link to={`update/${data.room_id}`} className="btn btn-primary">Zaktualizuj</Link></td>
                                    <td><button className="btn btn-danger ms-2" onClick={e => handleDelete(data.room_id)}>Usuń</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <div className="w-75 bg-white rounded p-3">
                <div className="d-flex align-items-center justify-content-center mb-3"> {/* Dodano styl */}
                    <h2 className="mb-0">Lista rezerwacji</h2>
                </div>
                <table className="table" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>Nr rezerwacji</th>
                            <th>Nr pokoju</th>
                            <th>ID użytkownika</th>
                            <th>Data zameldowania</th>
                            <th>Data wymeldowania</th>
                            <th>Koszt pobytu</th>
                            <th>Usuwanie</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            rezerwacja.map((data, i) => (
                                <tr key={i}>
                                    <td>{data.booking_id}</td>
                                    <td>{data.room_id}</td>
                                    <td>{data.user_id}</td>
                                    <td>{new Date(data.check_in_date).toLocaleString([], {day: '2-digit', month: '2-digit', year: 'numeric'})}</td>
                                    <td>{new Date(data.check_out_date).toLocaleString([], {day: '2-digit', month: '2-digit', year: 'numeric'})}</td>
                                    <td>{data.cost} zł</td>
                                    <td><button className="btn btn-danger ms-2" onClick={e => handleDeleteRezerwacje(data.booking_id)}>Usuń</button></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Admin;
