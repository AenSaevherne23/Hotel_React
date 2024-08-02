import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [values, setValues] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const handleInput = (event) => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    useEffect(() => {
        axios.get("http://localhost:8081")
            .then(res => {
                if (res.data.valid) {
                    navigate("/");
                } else {
                    navigate("/login");
                }
            })
            .catch(err => console.log(err))
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8081/login', values)
            .then(res => {
                if (res.data.Login) {
                    if (res.data.userType === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/');
                    }
                } else {
                    alert("Brak podanego użytkownika w bazie danych");
                }
            })
            .catch(err => console.log(err));
    };

    return (
        <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Zaloguj się</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email"><strong>Email:</strong></label>
                        <input type="email" placeholder="Wpisz swój email" name="email" onChange={handleInput} className="form-control rounded-0"></input>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password"><strong>Hasło:</strong></label>
                        <input type="password" placeholder="Wpisz swoje hasło" name="password" onChange={handleInput} className="form-control rounded-0"></input>
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0"><strong>Zaloguj się</strong></button>
                    <p>Wyrażasz zgodę na naszą politykę prywatności</p>
                    <Link to="/signup" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">Zarejestruj się</Link>
                </form>
            </div>
        </div>
    );
}

export default Login;
