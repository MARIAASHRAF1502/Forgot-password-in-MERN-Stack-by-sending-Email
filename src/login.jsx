import React,{useState} from 'react';
import './login.css';
import axios from 'axios';
import {Link} from "react-router-dom";



const Login = ()=>
{

    const [user,setuser] = useState({
        emailid:"",pwd:""
    });

    const [responseData, setresponseData] = useState("");

    const handleInput = (e)=>
    {
        setuser({...user,[e.target.name]:e.target.value});
    };

    const handleSubmit =()=>
    {
        axios.post("http://localhost:8000/login",
        {
            emailid : user.emailid,
            pwd : user.pwd
        }).then((response)=>
        {
            setresponseData(response.data.msg);
        }).catch((error)=>
        {
            setresponseData(error);
        })
    }

    return(
        <>
        
        <div class='loginForm'>
        <p>Login</p>
        <div className='text1'>
          Don't have an account yet ? <Link to="/register">sign up</Link>
        </div>
        
        <input type="text" onChange={handleInput} name="emailid" placeholder='Email id'></input><br/>
        <input type="password" onChange={handleInput} name="pwd" placeholder='Password'></input>
        <Link to="/forgetpwd" className='navigator'>Forget Password ?</Link>
        <input type="button" onClick={handleSubmit} value="Login"/>
            

        {responseData != "" && <p className='msg'>{responseData}</p>}
        
        </div>
        </>
    )
}

export default Login;