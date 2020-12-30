import React from 'react'
import './LoginPage.css'
import {Link} from 'react-router-dom'
import {useState} from 'react'
function LoginPage() {
    const [userId, setuserId] = useState('');
    const [Password, setPassword] = useState('')

    const Login=async()=>{
        const response=await fetch('/hello',{
            method:'POST',
            headers:{
                'Content-type':'application/Json'
            },
            body:JSON.stringify({
                id:userId,
                password:Password
            }
            )
        })
        console.log(response)
    }
    return (
        <div className='LoginPage'>
            <div className='LoginPage__header'>
                <h1>MHoP(Medical History of Patient)</h1>
            </div>
            <div className='LoginPage__InputBox'>
                <h1>Log In</h1>
                <div className='LoginPage__Input'>
                <input type='text' onChange={(e)=>setuserId(e.target.value)} placeholder='UserId' />
                <input type='password' onChange={(e)=>setPassword(e.target.value)} placeholder='Password' />
                <button onClick={Login}>Log In</button>
                <div className='LoginPage__Sign'>
                    <h2>Don't have account </h2>
                    <Link to='/Sign'>Sign Up</Link>
                </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage