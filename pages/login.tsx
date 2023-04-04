import React, {useState, useEffect, useContext} from 'react'
import {Form} from 'react-bootstrap'
import { useRouter } from 'next/router';
import {AppContext} from '../contexts/context';

function parseLoginError(error:any){
  if (error.message === 'Network Error'){
    console.log('network error')
    return(error.message);
  }else if (error.code === "ERR_BAD_REQUEST"){
    console.log(error)
    return(error.response.data.error.code);
  }else{
    console.log(error)
  }
}

export default function Login() {
  const [login_information_object, setLogin_information_object] = useState({
    "login":'',
    "password": '',
    "remember-me": true
  });
  const [error, setError] = useState("");
  const appContext = useContext(AppContext);
  const router = useRouter();

  useEffect(()=>{
    console.log('in login useEffect')
  }, []);
  
  const handleLogin = async (e: any) =>{
    e.preventDefault();
    setError("")
    const isValidSession = appContext.tastytradeApi.sessionService.httpClient.session.isValid;

    if(!isValidSession){
      try {
        await appContext.handleLogin(login_information_object)
        router.push('/balances')
      } catch (error: any) {
        setError(parseLoginError(error));
      }
    }else{
      setError('Someone is already logged in. Logout first before logging in');
    }
  };

  const handleLogout = async (e: any) =>{
    e.preventDefault();
    try{
      const response = await appContext.handleLogout();
      setError(response);
    }catch(error: any){
      console.log(error)
      setError(error.message);
    }
  }

  return (
    <>
        <h2 className = "text-center mb-4">Log In</h2>
        <form onSubmit={handleLogin}>
            <Form.Group id = "username">
                <Form.Label>Email</Form.Label>
                <Form.Control id="username"  placeholder="Username" name="username" value={login_information_object.login} onChange={(event) => setLogin_information_object({...login_information_object, login: event.target.value})} required/>
            </Form.Group>
            <Form.Group id = "password">
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
