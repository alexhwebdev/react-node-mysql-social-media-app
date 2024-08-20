import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import moment from "moment";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Comments = ({ postId }) => {
  const [ desc, setDesc ] = useState("");
  const { currentUser } = useContext(AuthContext);

  // Get all Post comments. React Query
  const { isPending, error, data } = useQuery({
    queryKey: ['comments'],
    queryFn: () =>
      makeRequest.get("/comments?postId=" + postId).then((res) => {
        return res.data;
      })
  })
  // console.log('Comments data ', data)

  const queryClient = useQueryClient();

  // POST comment
  // With useMutation, we are gonna make post request and if successful, refetch our posts in home page. So after adding new post, it will immediately refresh fetch methods and show post
  const mutation = useMutation({
    mutationFn: (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    // https://tanstack.com/query/latest/docs/reference/QueryClient/#queryclientinvalidatequeries
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['comments'] // refresh comments query
      })
    } 
  });
  const handleClick = async (e) => {
    e.preventDefault()
    mutation.mutate({ desc, postId });
    setDesc("")
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input 
          type="text" 
          placeholder="write a comment" 
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {
        isPending
        ? "Loading..."
        : data.map((comment, i) => (
          <div key={`comment_` + i} className="comment">
            <img src={comment.profilePicture} alt="" />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">
              {/* 1 hour ago */}
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
        ))
      }
    </div>
  );
};

export default Comments;







// import { useContext } from "react";
// import "./comments.scss";
// import { AuthContext } from "../../context/authContext";

// const Comments = () => {
//   const { currentUser } = useContext(AuthContext);
//   //Temporary
//   const comments = [
//     {
//       id: 1,
//       desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam. Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam",
//       name: "John Doe",
//       userId: 1,
//       profilePicture:
//         "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
//     },
//     {
//       id: 2,
//       desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem nequeaspernatur ullam aperiam",
//       name: "Jane Doe",
//       userId: 2,
//       profilePicture:
//         "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600",
//     },
//   ];
//   return (
//     <div className="comments">
//       <div className="write">
//         <img src={currentUser.profilePic} alt="" />
//         <input type="text" placeholder="write a comment" />
//         <button>Send</button>
//       </div>
//       {comments.map((comment) => (
//         <div className="comment">
//           <img src={comment.profilePicture} alt="" />
//           <div className="info">
//             <span>{comment.name}</span>
//             <p>{comment.desc}</p>
//           </div>
//           <span className="date">1 hour ago</span>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Comments;
