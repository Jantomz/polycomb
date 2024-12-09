import { useEffect, useState } from "react"; // Importing hooks from React
import { useParams } from "react-router-dom"; // Importing useParams to get URL parameters
import useApi from "../hooks/useApi.js"; // Custom hook to interact with API
import Post from "../components/misc/Post.js"; // Post component to display individual posts

const ViewCompetitionPosts = () => {
  const { code } = useParams(); // Extracting competition code from URL parameters
  const { getPosts } = useApi(); // Destructuring getPosts function from useApi hook
  const [posts, setPosts] = useState([]); // State to store all posts
  const [filteredPosts, setFilteredPosts] = useState([]); // State to store filtered posts based on search
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to manage error messages

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Set loading to true before fetching data
      setError(null); // Reset error state before fetching data
      try {
        const posts = await getPosts({ competitionCode: code }); // Fetch posts using competition code
        setPosts(posts); // Set fetched posts to state
        setFilteredPosts(posts); // Initially, filtered posts are the same as all posts
      } catch (err) {
        console.error("Failed to fetch posts:", err); // Log error to console
        setError("Failed to load posts. Please try again later."); // Set error message to state
      } finally {
        setLoading(false); // Set loading to false after fetching data
      }
    };

    fetchPosts(); // Call the fetchPosts function
  }, []); // Dependency array to re-run effect when code or getPosts changes

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <h1 className="text-4xl font-bold text-yellow-700 mb-6 max-md:text-xl">
        Competition Posts
      </h1>
      {loading ? (
        <p className="text-yellow-600">Loading...</p> // Show loading message while fetching data
      ) : error ? (
        <p className="text-red-600">{error}</p> // Show error message if there's an error
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search by tag or title"
            className="p-2 border border-yellow-300 rounded w-full md:w-1/2 lg:w-1/3"
            onChange={(e) => {
              const query = e.target.value.toLowerCase(); // Convert search query to lowercase
              const filteredPosts = posts.filter(
                (post) =>
                  post.title.toLowerCase().includes(query) || // Filter posts by title
                  post.tags.some((tag) => tag.toLowerCase().includes(query)) // Filter posts by tags
              );
              setFilteredPosts(filteredPosts); // Update filtered posts state
            }}
          />
          {filteredPosts
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) // Sort posts by updated date
            .map((post) => (
              <Post key={post._id} post={post} /> // Render Post component for each filtered post
            ))}
        </div>
      )}
    </div>
  );
};

export default ViewCompetitionPosts; // Export the component as default
