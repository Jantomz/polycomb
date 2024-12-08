import { useEffect, useState } from "react"; // Importing necessary hooks from React
import useApi from "../../../hooks/useApi.js"; // Custom hook for API calls
import { useNavigate, useParams } from "react-router-dom"; // Hooks for navigation and URL parameters

const AdminEditPosts = ({ userData }) => {
  const { getPosts, deletePost, updatePost } = useApi(); // Destructuring API methods from custom hook
  const competitionCode = useParams().code; // Extracting competition code from URL parameters
  const [posts, setPosts] = useState([]); // State to store posts
  const [error, setError] = useState(null); // State to store error messages
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const performInitialRender = async () => {
      try {
        const posts = await getPosts({ competitionCode }); // Fetching posts based on competition code
        setPosts(posts); // Setting fetched posts to state
      } catch (err) {
        setError("Failed to fetch posts. Please try again later."); // Setting error message if fetch fails
        console.error(err); // Logging error to console
      }
    };
    performInitialRender(); // Calling the async function to fetch posts on component mount
  }, [userData]); // Dependency array includes userData to refetch posts if userData changes

  const handleDeletePost = async (postId) => {
    try {
      await deletePost({ postId }); // Deleting post by postId
      setPosts(posts.filter((p) => p._id !== postId)); // Removing deleted post from state
    } catch (err) {
      setError("Failed to delete post. Please try again later."); // Setting error message if delete fails
      console.error(err); // Logging error to console
    }
  };

  const handleUpdatePost = async (post) => {
    try {
      await updatePost({ postId: post._id, post }); // Updating post by postId
      navigate(`/competition/${competitionCode}`); // Navigating back to competition page after update
    } catch (err) {
      setError("Failed to update post. Please try again later."); // Setting error message if update fails
      console.error(err); // Logging error to console
    }
  };

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      {" "}
      {/* Container with padding and background color */}
      <h1 className="text-3xl font-bold text-yellow-700 mb-6">
        Edit Posts
      </h1>{" "}
      {/* Page title */}
      {error && <div className="text-red-500 mb-4">{error}</div>}{" "}
      {/* Displaying error message if any */}
      <button
        onClick={() => {
          navigate(`/competition/${competitionCode}/edit-posts/new`); // Navigating to create new post page
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
            value={post.title} // Binding post title to input value
            onChange={(e) => {
              const updatedPosts = [...posts];
              updatedPosts[postIndex].title = e.target.value; // Updating post title in state
              setPosts(updatedPosts); // Setting updated posts to state
            }}
            className="w-full p-2 border border-yellow-300 rounded"
            placeholder="Post Title"
          />
          <textarea
            value={post.description} // Binding post description to textarea value
            onChange={(e) => {
              const updatedPosts = [...posts];
              updatedPosts[postIndex].description = e.target.value; // Updating post description in state
              setPosts(updatedPosts); // Setting updated posts to state
            }}
            className="w-full p-2 border border-yellow-300 rounded"
            placeholder="Post Description"
          />
          <div>
            {post.content.map((content, contentIndex) => (
              <div key={contentIndex} className="mb-2">
                <textarea
                  value={content} // Binding post content to textarea value
                  onChange={(e) => {
                    const updatedPosts = [...posts];
                    updatedPosts[postIndex].content[contentIndex] =
                      e.target.value; // Updating post content in state
                    setPosts(updatedPosts); // Setting updated posts to state
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
                  value={image || ""} // Binding image URL to input value
                  onChange={(e) => {
                    const updatedPosts = [...posts];
                    updatedPosts[postIndex].images[imageIndex] = e.target.value; // Updating image URL in state
                    setPosts(updatedPosts); // Setting updated posts to state
                  }}
                  className="w-full p-2 border border-yellow-300 rounded"
                  placeholder="Image URL"
                />
                {image && (
                  <img
                    src={image} // Displaying image if URL is present
                    alt="post"
                    className="mt-2 max-w-full h-auto rounded"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => handleDeletePost(post._id)} // Handling post deletion
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => handleUpdatePost(post)} // Handling post update
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

export default AdminEditPosts; // Exporting the component as default
