import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useApi from "../hooks/useApi.js";
import Post from "../components/misc/Post.js";

const ViewCompetitionPosts = () => {
  const { code } = useParams();
  const { getPosts } = useApi();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const posts = await getPosts({ competitionCode: code });
        setPosts(posts);
        setFilteredPosts(posts);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-yellow-50 p-6">
      <h1 className="text-4xl font-bold text-yellow-700 mb-6 max-md:text-xl">
        Competition Posts
      </h1>
      {loading ? (
        <p className="text-yellow-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search by tag or title"
            className="p-2 border border-yellow-300 rounded w-full md:w-1/2 lg:w-1/3"
            onChange={(e) => {
              const query = e.target.value.toLowerCase();
              const filteredPosts = posts.filter(
                (post) =>
                  post.title.toLowerCase().includes(query) ||
                  post.tags.some((tag) => tag.toLowerCase().includes(query))
              );
              setFilteredPosts(filteredPosts);
            }}
          />
          {filteredPosts
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .map((post) => (
              <Post key={post._id} post={post} />
            ))}
        </div>
      )}
    </div>
  );
};

export default ViewCompetitionPosts;
