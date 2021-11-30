import "./login.css"
import RoomIcon from "@material-ui/icons/Room";
import CancelIcon from '@material-ui/icons/Cancel';
import React,{useState,useRef} from "react";
import {axiosInstance} from "../util";

export default function Login({setShowLogin,myStorage,setCurrentUsername}) {
    const[error,setError]=useState(false)
    const usernameRef=useRef();
    const passwordRef=useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
          username: usernameRef.current.value,
          password: passwordRef.current.value,
        };
    
        try {
          const res=await axiosInstance.post("/users/login", user);
          setCurrentUsername(res.data.username)
          myStorage.setItem("user",res.data.user)
          setShowLogin(false)
          setError(false);
        } catch (err) {
          setError(true);
        }
      };

    return (
            <div className="loginContainer">
                <div className="logo">
                    <RoomIcon/>BirdTracker
                </div>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="username" ref={usernameRef} />
                    <input type="password" placeholder="password" ref={passwordRef}/>
                    <button className="loginButton">Login</button>
                    {error&& <span className="failure">Something went wrong!</span>}
                </form>
                <CancelIcon className="loginCancel" onClick={()=> setShowLogin(false)} />
            </div>
    )
}