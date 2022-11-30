import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useRef } from 'react'
import ChatOnline from '../../components/chatOnline/ChatOnline'
import Conversations from '../../components/conversations/Conversations'
import Message from '../../components/message/Message'
import Topbar from '../../components/topbar/Topbar'
import { AuthContext } from '../../context/AuthContext'
import {io} from "socket.io-client"
import './messenger.css'

const Messenger = () => {

  const [conversations, setConversations] = useState([])
  const [currentChat, setCurrentChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [onlineUsers, setOnlineUsers] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [arrivalMessage, setArrivalMessage] = useState(null)
  // const socket = useRef()
  const socket = useRef(io("ws://localhost:8900"))
  const {user} = useContext(AuthContext)
  const scrollRef = useRef()

  useEffect(() => {
    socket.current = io("ws://localhost:8900", { transports: ['websocket', 'polling', 'flashsocket'] })
    socket.current.on("getMessage",data => {
      setArrivalMessage({
        sender : data.senderId,
        text : data.text,
        createdAt : Date.now()
      })
    })
  }, [])

  useEffect(() => {
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages((prev) => [...prev,arrivalMessage])
  }, [arrivalMessage,currentChat])  
  
  useEffect(() => {
    socket.current.emit("addUser",user._id)
    socket.current.on("getUsers",users => {
      setOnlineUsers(user.followings.filter((f) => users.some((u) => u.userId !== f)))
      console.log(onlineUsers);
    //   user.followings.map(i => console.log(i))
    // users.map(i => console.log(i))
    })
  }, [user])
  
  // useEffect(() => {
  //   // socket.current.emit("addUser",user._id)
  //   // socket.current.on("getUsers",users=>{
  //   //     console.log(users);
  //   // })
  //   socket?.on("addUser",message => {
  //     console.log(message)
  //   })
  // }, [socket])
  

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/conversations/" + user._id)
        setConversations(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getConversations()
  }, [user._id])

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/messages/" + currentChat._id)
        setMessages(res.data)
      } catch (error) {
        // console.log(error)
      }
    }
    getMessages()
  }, [currentChat])

  const handleSubmit = async(e) => {
    e.preventDefault()
    if(newMessage !== ""){
      const message = {
        sender : user._id,
        text : newMessage,
        conversationId : currentChat._id
      }
  
      const receiverId = currentChat.members.find(member => member !== user._id)
  
      socket.current.emit("sendMessage",{
        senderId : user._id,
        receiverId,
        text : newMessage
      })
  
      try {
        const res = await axios.post("http://localhost:5000/api/messages/",message)
        console.log(res.data);
        setMessages([...messages,res.data])
        setNewMessage("")
      } catch (error) {
        console.log(error)
      }
    }    
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior : "smooth"})
  }, [])
  

  console.log(currentChat);

  // const setCurrentChat = (c) => {

  // }
  

  return (
    <>
    <Topbar />
    <div className="messenger">
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          <input type="text" placeholder='Search for friends' className='chatMenuInput' />
          {conversations.map((c) => (
            <div onClick={() => setCurrentChat(c)}>
              <Conversations conversation={c} currentUser={user} />
            </div>
          ))}
        </div>
      </div>
      <div className="chatBox">
      <div className="chatBoxWrapper">
        {
          currentChat ? (
          <>
          <div className="chatBoxTop">
            {messages.map((m) => (
              <div ref={scrollRef}>
              <Message message={m} own={m.sender === user._id} />
              </div>
            ))}
          </div>
          <div className="chatBoxBottom">
            <textarea className='chatMessageInput' placeholder='write something...' onChange={(e) => setNewMessage(e.target.value)} value={newMessage}></textarea>
            <button className='chatSubmitButton' onClick={handleSubmit}>Send</button>
          </div>
          </>
          )
           : <span className='noConversationText'>Open a conversation to start a Chat.</span> }
        </div>
      </div>
      <div className="chatOnline">
      <div className="chatOnlineWrapper">
          <ChatOnline onlineUsers={onlineUsers} currentId={user._id} setCurrentChat={setCurrentChat} />
        </div>
      </div>
    </div>
    </>
  )
}

export default Messenger