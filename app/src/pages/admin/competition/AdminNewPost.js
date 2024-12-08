import React, { useState } from "react";
import useApi from "../../../hooks/useApi.js";
import { useNavigate, useParams } from "react-router-dom";

const AdminNewPost = ({ user }) => {
  const { createPost } = useApi();
  const { code: competitionCode } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    competitionCode: competitionCode,
    description: "",
    tags: "",
    creatorId: user.uid,
    content: [""],
    images: [""],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleContentChange = (index, value) => {
    const newContent = [...formData.content];
    newContent[index] = value;
    setFormData({
      ...formData,
      content: newContent,
    });
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  const addContentBlock = () => {
    setFormData({
      ...formData,
      content: [...formData.content, ""],
    });
  };

  const addImageBlock = () => {
    setFormData({
      ...formData,
      images: [...formData.images, ""],
    });
  };

  const deleteContentBlock = (index) => {
    const newContent = formData.content.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      content: newContent,
    });
  };

  const deleteImageBlock = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      images: newImages,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tags = formData.tags.split(",");
    const res = await createPost({
      ...formData,
      tags,
    });

    console.log(res);

    if (res) {
      alert("Post created successfully");
      setFormData({
        title: "",
        competitionCode: competitionCode,
        description: "",
        tags: "",
        creatorId: user.uid,
        content: [""],
        images: [""],
      });
      navigate(`/competition/${competitionCode}`);
    } else {
      alert("Error creating post");
    }
  };

  return (
    <div className="p-6 bg-yellow-50 min-h-screen">
      <h1 className="text-3xl font-bold text-yellow-700 mb-6">New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          autoComplete="off"
          name="title"
          placeholder="Title"
          required
          onChange={handleChange}
          value={formData.title}
          className="w-full p-2 border border-yellow-300 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          required
          onChange={handleChange}
          value={formData.description}
          className="w-full p-2 border border-yellow-300 rounded"
        ></textarea>
        <input
          autoComplete="off"
          name="tags"
          placeholder="Tags (comma separated)"
          onChange={handleChange}
          value={formData.tags}
          className="w-full p-2 border border-yellow-300 rounded"
        />
        {formData.content.map((content, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md space-y-4"
          >
            <textarea
              placeholder="Content"
              required
              onChange={(e) => handleContentChange(index, e.target.value)}
              value={content}
              className="w-full p-2 border border-yellow-300 rounded"
            ></textarea>
            <button
              type="button"
              onClick={() => deleteContentBlock(index)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Content Block
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addContentBlock}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Add Content Block
        </button>
        {formData.images.map((image, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md space-y-4"
          >
            <input
              autoComplete="off"
              placeholder="Image URL"
              required
              onChange={(e) => handleImageChange(index, e.target.value)}
              value={image}
              className="w-full p-2 border border-yellow-300 rounded"
            />
            <button
              type="button"
              onClick={() => deleteImageBlock(index)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Delete Image Block
            </button>
          </div>
        ))}
        <div className="flex justify-center m-auto gap-4">
          <button
            type="button"
            onClick={addImageBlock}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Add Image Block
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminNewPost;
