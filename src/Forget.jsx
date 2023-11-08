import React ,{useState}from 'react';
import axios from 'axios';

const ForgetPage = ()=>
{
    const [email, setEmail] = useState({mail : ""});
    const [responseData, setresponseData] = useState("");

    const handleInput = (e)=>
    {
        setEmail({...email,[e.target.name]:e.target.value});
    }

    const submit = (e)=>
    {
        axios.post("http://localhost:8000/forgetpwd",{
            emailid:email.mail
        }).then((response)=>
        {
            if(response.data != "Email id not found"){
                setresponseData("Password Reset link sent to entered Email id");
            }else{
                setresponseData(response.data);
            }
        }).catch((error)=>{
            console.log(error);
        })
    }

    return(
        <>
        <div className='loginForm'>
        <p>Forget Password Form</p>
        <input type="text" onChange={handleInput} placeholder='Email id' name="mail"></input>
        <input type="button" onClick={submit} value="verify" />
        {responseData != "" && <p className='msg'>{responseData}</p>}
        </div>
        </>
    )
}

export default ForgetPage;