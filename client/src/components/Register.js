import "./register.css"
import RoomIcon from "@material-ui/icons/Room";
import CancelIcon from '@material-ui/icons/Cancel';
import React,{useState,useRef} from "react";
import {axiosInstance} from "../util";

export default function Register({setShowRegister}) {
    const[success,setSuccess]=useState(false)
    const[error,setError]=useState(false)
    const usernameRef=useRef();
    const emailRef=useRef();
    const passwordRef=useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
          username: usernameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
        };
    
        try {
          await axiosInstance.post("/users/register", newUser);
          setError(false);
          setSuccess(true);
        } catch (err) {
          setError(true);
        }
      };

    return (
            <div className="registerContainer">
                <div className="logo">
                    <RoomIcon/>BirdTracker
                </div>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="username" ref={usernameRef} />
                    <input type="email" placeholder="email" ref={emailRef}/>
                    <input type="password"  min="6" max="15" placeholder="password" ref={passwordRef}/>
                    <button className="registerButton">Register</button>
                    {success&&<span className="success">Welcome, Login permitted.</span>}
                    {error&& <span className="failure">Something went wrong!</span>}
                </form>
                <CancelIcon className="registerCancel" onClick={()=> setShowRegister(false)} />
            </div>
    )
}