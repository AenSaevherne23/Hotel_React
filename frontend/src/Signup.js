import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './SignupValidation'
import axios from 'axios'

function Signup() {

    const [values, setValues] = useState({
        name: "",
        email: "",
        password: ""
    })

    const navigate = useNavigate();
    const [errors, setErrors] = useState({})

    const handleInput =(event) => {
        setValues(prev => ({...prev, [event.target.name]: [event.target.value]}))
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);

        if (!validationErrors.name && !validationErrors.email && !validationErrors.password) {
            try {
                const response = await axios.post('http://localhost:8081/signup', values);
                if (response.status === 200) {
                    navigate("/login");
                }
            } catch (error) {
                console.error(error);
            }
        }
    };


    return (
        <div className="d-flex justify-content-center align-items-center bg-primary vh-100">
            <div className="bg-white p-3 rounded w-25">
                <h2>Załóż swoje konto</h2>
                <form action="" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name"><strong>Nazwa:</strong></label>
                        <input type="text" placeholder="Wpisz swoją nazwę" name="name" className="form-control rounded-0" onChange={handleInput}></input>
                        {errors.name && <span className='text-danger'>{errors.name}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email"><strong>Email:</strong></label>
                        <input type="email" placeholder="Wpisz swój email" name="email" className="form-control rounded-0" onChange={handleInput}></input>
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password"><strong>Hasło:</strong></label>
                        <input type="password" placeholder="Wpisz swoje hasło" name="password" className="form-control rounded-0" onChange={handleInput}></input>
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0"><strong>Zarejestruj się</strong></button>
                    <p>Wyrażasz zgodę na naszą politykę prywatności</p>
                    <Link to="/" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">Zaloguj się</Link>
                </form>
            </div>
        </div>
    )
}

export default Signup