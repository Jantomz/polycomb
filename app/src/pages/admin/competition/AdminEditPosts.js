import { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi.js";
import { useNavigate, useParams } from "react-router-dom";

const AdminEditPosts = ({ user, userData }) => {
  const { getPosts } = useApi();
  const competitionCode = useParams().code;
  const [posts, setPosts] = useState([]);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const performInitialRender = async () => {
      const posts = await getPosts({
        competitionCode,
      });
      setPosts(posts);
    };
    performInitialRender();
  }, [userData]);

  return (
    <div>
      <h1>Edit Posts</h1>
      <button
        onClick={() => {
          navigate(`/competition/${competitionCode}/edit-posts/new`);
        }}
      >
        Create New Post
      </button>
      {posts.map((post) => (
        <div key={post._id}>
          <h3>{post.title}</h3>
          <p>{post.description}</p>
          {post.content.map((content, index) => (
            <div key={index}>
              <p>{content}</p>
              {post.images[index] && (
                <img src={post.images[index]} alt="post"></img>
              )}
            </div>
          ))}
          <button
            onClick={() => {
              setShowDeletePopup(true);
              setPostToDelete(post);
            }}
          >
            Delete
          </button>
        </div>
      ))}
      {/* {showDeletePopup && (
        <DeletePopup
          deleteFunction={deletePost}
          itemToDelete={postToDelete}
          setItemToDelete={setPostToDelete}
          setShowDeletePopup={setShowDeletePopup}
        />
      )} */}
    </div>
  );
};

export default AdminEditPosts;
