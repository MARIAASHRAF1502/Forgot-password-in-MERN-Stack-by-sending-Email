import React,{useState} from 'react';
import axios from 'axios';
import {Link,useNavigate} from "react-router-dom";




const Register = ()=>
{

    const [data,setData] = useState({emailid:"", pwd:""});
    const [responseData, setresponseData] = useState("");

    const navigate = useNavigate();

    const handleInput = (e)=>
    {
        e.preventDefault();
        setData({...data,[e.target.name]:e.target.value});
    }


    const handleSubmit =()=>
    {
        axios.post("http://localhost:8000/register",
        {
            emailid:data.emailid,
            pwd:data.pwd
        }
        ).then((response)=>
        {
            if(response.data.msg != "Registered Successfully"){
                setresponseData(response.data.msg);
            }else{
                alert(response.data.msg);
                navigate("/");
            }
            
        }).catch((error)=>
        {
            setresponseData(error);

        });
        
    }



    return(
        <>
        <div className='loginForm'>
        <p>Registration</p>
      
        <input type="text" placeholder='Email id' onChange={handleInput} name="emailid"/><br/>
        <input type="text" placeholder='Password' onChange={handleInput} name="pwd"/>
        <input type="button" onClick={handleSubmit} value="Register"/>

        <div className='text1'>
            Already have an account ? <Link to="/" className='navigator'>Login</Link>
        </div>

        

        {responseData != "" && <p className='msg'>{responseData}</p>}
       

        </div>
        </>

    )

}



export default Register;