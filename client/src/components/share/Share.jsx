import { useState } from "react";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./share.scss";
import { makeRequest } from "../../axios";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

  const {currentUser} = useContext(AuthContext)

  const queryClient = useQueryClient();

  // POST text
  // With useMutation, we are gonna make post request and if successful, refetch our posts in home page. So after adding new post, it will immediately refresh fetch methods and show post
  const mutation = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    // https://tanstack.com/query/latest/docs/reference/QueryClient/#queryclientinvalidatequeries
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['posts']
      })
    } 
  });

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err)
    }
  }

  const handleClick = async (e) => {
    e.preventDefault()
    let imgUrl = "";
    if (file) imgUrl = await upload();
    mutation.mutate({ desc, img: imgUrl });
    setDesc("")
    setFile(null)
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img
              src={currentUser.profilePic}
              alt=""
            />
            <input 
              type="text" 
              placeholder={`What's on your mind ${currentUser.name}?`} 
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />            
          </div>
          <div className="right">
            {file && <img 
              className="file" 
              alt="" 
              src={URL.createObjectURL(file)} // createObjectURL() static method of the URL interface creates a string containing a URL representing the object given in the parameter. Basically creates a fake URL to show object added in.
            />}
          </div>

        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input 
              type="file" 
              id="file" 
              style={{display:"none"}} 
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
