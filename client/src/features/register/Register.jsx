import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useDispatch } from 'react-redux'
import { setCredentials } from './registerSlice'
import { useRegisterMutation } from './registerApiSlice'

const Register = () => {
    const userRef = useRef()
    const errRef = useRef()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const navigate = useNavigate()

    const [register, { isLoading }] = useRegisterMutation()
    const dispatch = useDispatch()

    useEffect(() => {
        userRef.current.focus()
    }, [])

    useEffect(() => {
        setErrMsg('')
    }, [username, email, password])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const userData = await register({ username, email, password }).unwrap()
            dispatch(setCredentials({ ...userData, username }))
            setUsername('')
            setEmail('')
            setPassword('')
            navigate('/login')
        } catch (err) {
            console.log(err)
            if (!err?.originalStatus) {
                setErrMsg('No server response')
            } else if (err.originalStatus === 400) {
                setErrMsg('Missing Username or Password')
            } else {
                setErrMsg('Registration failed')
            }
            errRef.current.focus()
        }
    }

    const handleUserInput = (e) => setUsername(e.target.value)
    const handleEmailInput = (e) => setEmail(e.target.value)
    const handlePwdInput = (e) => setPassword(e.target.value)

    const content = isLoading ? <h1>Loading...</h1> : (
        <section className='login'>
            <p
                ref={errRef}
                className={errMsg ? "errmsg" : "offscreen"}
                aria-live='assertive'
            >
                {errMsg}
            </p>

            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="username">Username:</label>
                <input
                    type='text'
                    id='username'
                    ref={userRef}
                    value={username}
                    onChange={handleUserInput}
                    autoComplete='off'
                    required
                />
                <label htmlFor="email">e-mail:</label>
                <input
                    type='email'
                    id='email'
                    value={email}
                    onChange={handleEmailInput}
                    required
                />
                <label htmlFor="password">Password:</label>
                <input
                    type='password'
                    id='password'
                    value={password}
                    onChange={handlePwdInput}
                    required
                />
                <button>Sign Up</button>
            </form>
            <p>Already registered?</p>
            <Link to='login'>Sign in...</Link>
        </section>
    )

    return content
}

export default Register