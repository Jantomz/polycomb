const Post = ({ post }) => {
  return (
    <div key={post._id} className="mb-4 p-4 bg-yellow-100 rounded shadow-md">
      <h4 className="text-2xl font-semibold mb-2">{post.title}</h4>
      <p className="mb-4">{post.description}</p>
      <div className="text-sm text-gray-600">
        <p>Created at: {new Date(post.createdAt).toLocaleString()}</p>
        <p>Updated at: {new Date(post.updatedAt).toLocaleString()}</p>
      </div>
      <div className="mt-2">
        {post.tags.map((tag, index) => (
          <span
            key={index}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="text-left p-12">
        {post.content.map((content, index) => (
          <div
            key={index}
            className="mb-4 flex flex-col justify-center items-center"
          >
            <p>{content}</p>
            {post.images[index] && (
              <img
                src={post.images[index]}
                alt="post"
                className="mt-2 w-full h-auto rounded max-w-xs"
              />
            )}
          </div>
        ))}
        <div className="flex flex-wrap justify-center gap-12">
          {post.images.slice(post.content.length).map((image, index) => (
            <div key={index} className="mb-4 ">
              <img
                src={image}
                alt="post"
                className="mt-2 w-full h-auto rounded max-w-xs"
              />
            </div>
          ))}
        </div>
        {post.content.slice(post.images.length).map((content, index) => (
          <div
            key={index}
            className="mb-4 flex flex-col justify-center items-center"
          >
            <p>{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
