import React, {useState, useEffect} from 'react'
import {Form } from 'react-bootstrap'
import SessionService from '../lib/service/session-service.ts'
import TastytradeSession from "../lib/models/tastytrade-session.ts"

export default function Login() {
  const [login_information_object, setLogin_information_object] = useState({});
  const [error, setError] = useState("");
  const tastytradeSession = new TastytradeSession();
  const sessionService = new SessionService(tastytradeSession)

  useEffect(()=>{
    console.log('in login useEffect')
  }, []);
  
  const handleLogin = async (e) =>{
    e.preventDefault();
    setError("")
    try {
      await sessionService.login(login_information_object.login, login_information_object.password);
      await sessionService.validate();
      console.log(tastytradeSession.authToken)
    } catch (error) {
        console.log(error)
      setError(error.message);
    }
  };

  const handleLogout = async (e) =>{
    e.preventDefault();
    console.log(tastytradeSession.isValid)
    if(tastytradeSession.isValid){
      try {
          await sessionService.logout();
          console.log(tastytradeSession.authToken)
        }catch (error) {
          console.log(error)
          setError(error.message);
        }
    }else{

    }
  }

  return (
    <>
        <h2 className = "text-center mb-4">Log In</h2>
        <form onSubmit={handleLogin}>
            <Form.Group id = "email">
                <Form.Label>Email</Form.Label>
                <Form.Control id="email"  placeholder="Username" name="username" value={login_information_object.login} onChange={(event) => setLogin_information_object({...login_information_object, login: event.target.value})} required/>
            </Form.Group>
            <Form.Group id = "Password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" id="password" placeholder="Password" name="password" value={login_information_object.password} onChange={(event) => setLogin_information_object({...login_information_object, password: event.target.value})} required/>
            </Form.Group>
            {error && <alert variant="danger">{error}</alert>}
            <br/>
            <button type = "submit" className="btn btn-primary w-100">Log In</button>
        </form>
        <button type = "submit" className = "btn btn-primary w-100" onClick = {handleLogout}>Logout</button>
    </>
  )
};
