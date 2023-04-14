import React, {useState, useContext} from 'react'
import { useRouter } from 'next/router';
import {AppContext, TastytradeContext} from '../contexts/context';
import { observer } from 'mobx-react-lite'

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

async function fetchAccounts(context: TastytradeContext) {
  const accounts = await context.tastytradeApi.accountsAndCustomersService.getCustomerAccounts();
  const extractedAccountNumbers = accounts.map((item: any) => item.account['account-number']);

  if(extractedAccountNumbers.length){
    context.accountNumbers = extractedAccountNumbers
  }

  return accounts
}

const Login = observer(() =>{
  const [login_information_object, setLogin_information_object] = useState({
    "login":'',
    "password": '',
    "remember-me": true
  });
  const [error, setError] = useState("");
  const context = useContext(AppContext);
  const router = useRouter();
  
  const handleLogin = async (e: any) =>{
    e.preventDefault();
    setError("")
    const isValidSession =  false//context.tastytradeApi.sessionService.httpClient.session.isValid;

    if(!isValidSession){
      try {
        await context.tastytradeApi.sessionService.login(
          login_information_object.login, login_information_object.password, login_information_object['remember-me']
        )
        await fetchAccounts(context)

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
      if(context.accountNumbers){
        await context.tastytradeApi.sessionService.logout()
        .then(context.accountNumbers = null);
        setError('Logged out');
      }else{
        setError('Not Logged in')
      }
    }catch(error: any){
      console.log(error)
      setError(error.message);
    }
  }

  return (
    <div className='w-3/12'>
        <h2 className="text-center mb-4">Log In</h2>
        <div>Count: {context.count}</div>
        <div className="my-3">
          <div>Email</div>
          <input
            type='text'
            className="p-2 w-full border border-gray-400"
            onChange={(event) => setLogin_information_object({...login_information_object, login: event.target.value})}
            required
          />
        </div>
        <div className="my-3">
          <div>Password</div>
          <input
            type='password'
            className="p-2 w-full border border-gray-400"
            onChange={(event) => setLogin_information_object({...login_information_object, password: event.target.value})}
            required
          />
        </div>
        {error && <div className='text-red-500'>TEST</div>}
        <button className="rounded cursor-pointer p-5 bg-black text-white" onClick={handleLogin}>Log In</button>
        <button className="rounded cursor-pointer p-5 bg-black text-white ml-2" onClick={handleLogout}>Logout</button>
    </div>
  )
});

export default Login
