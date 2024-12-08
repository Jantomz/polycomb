const Post = ({ post }) => {
  // Check if post is valid and is an object
  if (!post || typeof post !== "object") {
    return <div className="text-red-500">Invalid post data</div>;
  }

  // Destructure post object to extract necessary fields
  const {
    _id,
    title,
    description,
    createdAt,
    updatedAt,
    tags = [], // Default to empty array if tags are not provided
    content = [], // Default to empty array if content is not provided
    images = [], // Default to empty array if images are not provided
  } = post;

  // Check if essential post data is present
  if (!_id || !title || !description || !createdAt || !updatedAt) {
    return <div className="text-red-500">Missing essential post data</div>;
  }

  return (
    <div key={_id} className="mb-4 p-4 bg-yellow-100 rounded shadow-md">
      <h4 className="text-2xl font-semibold mb-2">{title}</h4>
      <p className="mb-4">{description}</p>
      <div className="text-sm text-gray-600">
        {/* Display creation and update timestamps */}
        <p>Created at: {new Date(createdAt).toLocaleString()}</p>
        <p>Updated at: {new Date(updatedAt).toLocaleString()}</p>
      </div>
      <div className="mt-2">
        {/* Render tags if they exist */}
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

      <div className="text-left p-4 md:p-8 lg:p-12">
        {/* Render content items and corresponding images */}
        {Array.isArray(content) &&
          content.map((contentItem, index) => (
            <div
              key={index}
              className="mb-4 flex flex-col justify-center items-center"
            >
              <p className="text-center">{contentItem}</p>
              {images[index] && (
                <img
                  src={images[index]}
                  alt="post"
                  className="mt-2 w-full h-auto rounded max-w-xs"
                />
              )}
            </div>
          ))}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 lg:gap-12">
          {/* Render remaining images if there are more images than content items */}
          {Array.isArray(images) &&
            images.slice(content.length).map((image, index) => (
              <div key={index} className="mb-4">
                <img
                  src={image}
                  alt="post"
                  className="mt-2 w-full h-auto rounded max-w-xs"
                />
              </div>
            ))}
        </div>
        {/* Render remaining content items if there are more content items than images */}
        {Array.isArray(content) &&
          content.slice(images.length).map((contentItem, index) => (
            <div
              key={index}
              className="mb-4 flex flex-col justify-center items-center"
            >
              <p className="text-center">{contentItem}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Post;
