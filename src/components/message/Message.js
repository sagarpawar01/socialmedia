import React from 'react'
import './message.css'
import {format} from 'timeago.js'

const Message = ({message,own}) => {

    const PF = "http://localhost:5000/images/";

    if(message.text !== ""){
      return (
      <div className={own ? "message own" : "message"}>
        <div className="messageTop">
            <img src={PF+"person/noAvatar.png"} alt="" className='messageImg' />
            <p className='messageText'>{message.text}</p>
        </div>
        <div className="messageBottom">
            {format(message.createdAt)}
        </div>
    </div>
      )
    }
}

export default Message