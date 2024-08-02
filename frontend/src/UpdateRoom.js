import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function UpdateStudent() {
    const [room_number, setRoom_number] = useState('');
    const [room_type, setRoom_type] = useState('');
    const [price_per_night, setPrice_per_night] = useState('');
    const [availability, setAvailability] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        axios.put('http://localhost:8081/update/' + id, { room_number, room_type, price_per_night, availability })
            .then(res => {
                console.log(res);
                navigate("/admin");
            }).catch(err => console.log(err));
    }

    function handleCancel() {
        navigate("/admin");
    }

    return (
        <div className="d-flex vh-100 bg-primary justify-content-center align-items-center">
            <div className="w-50 bg-white rounded p-3">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-center mb-4">Zaktualizuj pokój</h2>
                    <div className="mb-2">
                        <label htmlFor="" className="fw-bold">Nr pokoju</label>
                        <input type="text" placeholder="Wpisz nr pokoju" className="form-control"
                            value={room_number} onChange={e => setRoom_number(e.target.value)} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="" className="fw-bold">Typ pokoju</label>
                        <select className="form-control" value={room_type} onChange={e => setRoom_type(e.target.value)}>
                            <option value="" disabled>Wybierz typ pokoju</option>
                            <option value="normalny">Normalny</option>
                            <option value="ekskluzywny">Ekskluzywny</option>
                        </select>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="" className="fw-bold">Cena za jedną noc</label>
                        <input type="number" placeholder="Wpisz cenę" className="form-control"
                            value={price_per_night} onChange={e => setPrice_per_night(e.target.value)} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="" className="fw-bold">Dostępność</label>
                        <select className="form-control" value={availability} onChange={e => setAvailability(e.target.value)}>
                            <option value="" disabled>Wybierz dostępność</option>
                            <option value="0">Niedostępny</option>
                            <option value="1">Dostępny</option>
                        </select>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button className="btn btn-success">Zaktualizuj</button>
                        <button type="button" className="btn btn-danger" onClick={handleCancel}>Anuluj</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UpdateStudent;
