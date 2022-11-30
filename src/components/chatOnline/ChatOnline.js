import axios from "axios";
import React, { useEffect, useState } from "react";
import "./chatOnline.css";

const ChatOnline = ({ onlineUsers, currentId, setCurrentChat }) => {
  console.log(onlineUsers);

  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const PF = "http://localhost:5000/images/";

  useEffect(() => {
    const getFriends = async () => {
      const res = await axios.get(
        "http://localhost:5000/api/users/friends/" + currentId
      );
      setFriends(res.data);
      console.log(res.data);
    };
    getFriends();
  }, []);

  useEffect(() => {
    setOnlineFriends(friends.filter((f) => onlineUsers.includes(f._id)));
    // console.log(onlineFriends)
  }, [friends]);

  const handleClick = async (user) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/conversations/find/${currentId}/${user._id}`)
      setCurrentChat(res.data)
    } catch (error) {
      console.log(error);
    }
  }

  console.log(onlineFriends);

  return (
    <div className="chatOnline">
      {onlineFriends.map((o) => (
        <div className="chatOnlineFriend" onClick={() => {handleClick(o)}}>
          <div className="chatOnlineImgContainer">
            <img
              src={
                o.profilePicture ? o.profilePicture : PF + "person/noAvatar.png"
              }
              alt=""
              className="chatOnlineImg"
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{o.username}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatOnline;
