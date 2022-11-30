import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";

const Conversations = ({ conversation, currentUser }) => {
  const [user, setUser] = useState([]);

  const PF = "http://localhost:5000/images/";

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id)
    const getUser = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users?userId=" + friendId)
        setUser(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    getUser()
  }, [])
  

  return (
    <div className="conversation">
      <img
        className="conversationImg"
        src={user?.profilePicture ? user.profilePicture : PF + "person/noAvatar.png"}
        alt="NoImg"
      />
      <span>{user?.username}</span>
    </div>
  );
};

export default Conversations;
