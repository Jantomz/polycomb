import { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi.js";
import { useNavigate, useParams } from "react-router-dom";

const AdminEditPosts = ({ userData }) => {
  const { getPosts, deletePost, updatePost } = useApi();
  const competitionCode = useParams().code;
  const [posts, setPosts] = useState([]);
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
    <div className="p-6 bg-yellow-50 min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-700 mb-6">Edit Posts</h1>
      <button
        onClick={() => {
          navigate(`/competition/${competitionCode}/edit-posts/new`);
        }}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 mb-4"
      >
        Create New Post
      </button>
      {posts.map((post, postIndex) => (
        <div
          key={post._id}
          className="bg-white p-4 rounded-lg shadow-md space-y-4 mb-4"
        >
          <input
            autoComplete="off"
            type="text"
            value={post.title}
            onChange={(e) => {
              const updatedPosts = [...posts];
              updatedPosts[postIndex].title = e.target.value;
              setPosts(updatedPosts);
            }}
            className="w-full p-2 border border-yellow-300 rounded"
            placeholder="Post Title"
          />
          <textarea
            value={post.description}
            onChange={(e) => {
              const updatedPosts = [...posts];
              updatedPosts[postIndex].description = e.target.value;
              setPosts(updatedPosts);
            }}
            className="w-full p-2 border border-yellow-300 rounded"
            placeholder="Post Description"
          />
          <div>
            {post.content.map((content, contentIndex) => (
              <div key={contentIndex} className="mb-2">
                <textarea
                  value={content}
                  onChange={(e) => {
                    const updatedPosts = [...posts];
                    updatedPosts[postIndex].content[contentIndex] =
                      e.target.value;
                    setPosts(updatedPosts);
                  }}
                  className="w-full p-2 border border-yellow-300 rounded"
                  placeholder="Post Content"
                />
              </div>
            ))}
          </div>
          <div>
            {post.images.map((image, imageIndex) => (
              <div key={imageIndex} className="mb-2">
                <input
                  autoComplete="off"
                  type="text"
                  value={image || ""}
                  onChange={(e) => {
                    const updatedPosts = [...posts];
                    updatedPosts[postIndex].images[imageIndex] = e.target.value;
                    setPosts(updatedPosts);
                  }}
                  className="w-full p-2 border border-yellow-300 rounded"
                  placeholder="Image URL"
                />
                {image && (
                  <img
                    src={image}
                    alt="post"
                    className="mt-2 max-w-full h-auto rounded"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => {
                deletePost({ postId: post._id });
                setPosts(posts.filter((p) => p._id !== post._id));
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={async () => {
                await updatePost({ postId: post._id, post });
                navigate(`/competition/${competitionCode}`);
              }}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminEditPosts;
