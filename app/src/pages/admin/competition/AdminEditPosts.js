import { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi.js";
import { useNavigate, useParams } from "react-router-dom";

const AdminEditPosts = ({ userData }) => {
  const { getPosts, deletePost, updatePost } = useApi();
  const competitionCode = useParams().code;
  const [posts, setPosts] = useState([]);
  // const [showDeletePopup, setShowDeletePopup] = useState(false);
  // const [postToDelete, setPostToDelete] = useState(null);
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
      {posts.map((post, postIndex) => (
        <div key={post._id}>
          <input
            type="text"
            value={post.title}
            onChange={(e) => {
              const updatedPosts = [...posts];
              updatedPosts[postIndex].title = e.target.value;
              setPosts(updatedPosts);
            }}
          />
          <textarea
            value={post.description}
            onChange={(e) => {
              const updatedPosts = [...posts];
              updatedPosts[postIndex].description = e.target.value;
              setPosts(updatedPosts);
            }}
          />
          <div>
            {post.content.map((content, contentIndex) => (
              <div key={contentIndex}>
                <textarea
                  value={content}
                  onChange={(e) => {
                    const updatedPosts = [...posts];
                    updatedPosts[postIndex].content[contentIndex] =
                      e.target.value;
                    setPosts(updatedPosts);
                  }}
                />
              </div>
            ))}
          </div>
          <div>
            {post.images.map((image, imageIndex) => (
              <div key={imageIndex}>
                <input
                  type="text"
                  value={image || ""}
                  onChange={(e) => {
                    const updatedPosts = [...posts];
                    updatedPosts[postIndex].images[imageIndex] = e.target.value;
                    setPosts(updatedPosts);
                  }}
                  placeholder="Image URL"
                />
                {image && <img src={image} alt="post"></img>}
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              deletePost({ postId: post._id });
              setPosts(posts.filter((p) => p._id !== post._id));
            }}
          >
            Delete
          </button>
          <button
            onClick={async () => {
              await updatePost({ postId: post._id, post });
            }}
          >
            Save
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminEditPosts;
