import React, { useContext, useState } from "react";
import { PermMedia, Label, Room, EmojiEmotions, Cancel } from "@material-ui/icons";
import "./share.css";
import { AuthContext } from "../../context/AuthContext";
import { useRef } from "react";
import axios from "axios";

const Share = () => {
  const { user } = useContext(AuthContext);
  const PF = "http://localhost:5000/images/";
  console.log(user);
  const desc = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };
    if(file){
      const data = new FormData()
      const fileName = Date.now() + file.name
      data.append("file",file)
      data.append("name",fileName)
      newPost.img = fileName
      try {
        console.log('first')
        await axios.post("http://localhost:5000/api/upload",data)
      } catch (error) {
        console.log(error);
      }
    }
    try {
      await axios.post("http://localhost:5000/api/posts", newPost);
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              user.profilePicture
                ? user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
          />
          <input
            placeholder={"What's in your mind " + user.username + " ?"}
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img src={URL.createObjectURL(file)} alt="ffgf" className="shareImg" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label className="shareOption" htmlFor="file">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg,.jfif"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
};

export default Share;
