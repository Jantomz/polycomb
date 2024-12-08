const Post = ({ post }) => {
  if (!post || typeof post !== "object") {
    return <div className="text-red-500">Invalid post data</div>;
  }

  const {
    _id,
    title,
    description,
    createdAt,
    updatedAt,
    tags = [],
    content = [],
    images = [],
  } = post;

  if (!_id || !title || !description || !createdAt || !updatedAt) {
    return <div className="text-red-500">Missing essential post data</div>;
  }

  return (
    <div key={_id} className="mb-4 p-4 bg-yellow-100 rounded shadow-md">
      <h4 className="text-2xl font-semibold mb-2">{title}</h4>
      <p className="mb-4">{description}</p>
      <div className="text-sm text-gray-600">
        <p>Created at: {new Date(createdAt).toLocaleString()}</p>
        <p>Updated at: {new Date(updatedAt).toLocaleString()}</p>
      </div>
      <div className="mt-2">
        {Array.isArray(tags) &&
          tags.map((tag, index) => (
            <span
              key={index}
              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2"
            >
              #{tag}
            </span>
          ))}
      </div>

      <div className="text-left p-12">
        {Array.isArray(content) &&
          content.map((contentItem, index) => (
            <div
              key={index}
              className="mb-4 flex flex-col justify-center items-center"
            >
              <p>{contentItem}</p>
              {images[index] && (
                <img
                  src={images[index]}
                  alt="post"
                  className="mt-2 w-full h-auto rounded max-w-xs"
                />
              )}
            </div>
          ))}
        <div className="flex flex-wrap justify-center gap-12">
          {Array.isArray(images) &&
            images.slice(content.length).map((image, index) => (
              <div key={index} className="mb-4 ">
                <img
                  src={image}
                  alt="post"
                  className="mt-2 w-full h-auto rounded max-w-xs"
                />
              </div>
            ))}
        </div>
        {Array.isArray(content) &&
          content.slice(images.length).map((contentItem, index) => (
            <div
              key={index}
              className="mb-4 flex flex-col justify-center items-center"
            >
              <p>{contentItem}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Post;
