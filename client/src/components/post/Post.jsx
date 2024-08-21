import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import moment from "moment";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";


const Post = ({ post }) => {
  // console.log('post ', post)
  const [commentOpen, setCommentOpen] = useState(false);

  const {currentUser} = useContext(AuthContext);
  console.log('currentUser ', currentUser)

  const { isPending, error, data } = useQuery({
    queryKey: ['likes', post.id],
    queryFn: () =>
      makeRequest.get("/likes?postId=" + post.id).then((res) => {
        return res.data;
      })
  })
  console.log('data ', data)

  const queryClient = useQueryClient();

  // POST text
  // With useMutation, we are gonna make post request and if successful, refetch our posts in home page. So after adding new post, it will immediately refresh fetch methods and show post
  const mutation = useMutation({
    mutationFn: (liked) => {
      console.log('liked ', liked)

      if (liked) return makeRequest.delete("/likes?postId=" + post.id);
      return makeRequest.post("/likes", {postId: post.id});
    },
    // https://tanstack.com/query/latest/docs/reference/QueryClient/#queryclientinvalidatequeries
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['likes'] // refresh posts query
      })
    } 
  });

  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  }

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">
                {/* 1 min ago */}
                {moment(post.createdAt).fromNow()}
              </span>
            </div>
          </div>
          <MoreHorizIcon />
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={"./upload/" + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {/* 12 Likes */}
            {
              isPending 
                ? "Loading..."
                : data.includes(currentUser.id) 
                  ? <FavoriteOutlinedIcon 
                      style={{color: 'red'}} 
                      onClick={handleLike}
                    /> 
                  : <FavoriteBorderOutlinedIcon onClick={handleLike} />
            }
            {/* {
              data.includes(currentUser.id) 
                ? <FavoriteOutlinedIcon style={{color: 'red'}} /> 
                : <FavoriteBorderOutlinedIcon />
            } */}
            {/* { data.length } Likes */}
            {
              data ? data.length + " Likes" : ""
            }

          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
