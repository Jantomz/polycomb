import React, { useState } from "react";
import useApi from "../../../hooks/useApi.js";
import { useParams } from "react-router-dom";

const AdminNewPost = ({ user }) => {
  const { createPost } = useApi();
  const competitionCode = useParams().code;
  const [formData, setFormData] = useState({
    title: "",
    competitionCode: competitionCode,
    description: "",
    tags: "",
    creatorId: user.uid,
    content: [""],
    images: [""],
  });

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
    } else {
      alert("Error creating post");
    }
  };

  return (
    <div>
      <h1>New Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          required
          onChange={handleChange}
          value={formData.title}
        />
        <textarea
          name="description"
          placeholder="Description"
          required
          onChange={handleChange}
          value={formData.description}
        ></textarea>
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          onChange={handleChange}
          value={formData.tags}
        />
        {formData.content.map((content, index) => (
          <div key={index}>
            <textarea
              placeholder="Content"
              required
              onChange={(e) => handleContentChange(index, e.target.value)}
              value={content}
            ></textarea>
            <button type="button" onClick={() => deleteContentBlock(index)}>
              Delete Content Block
            </button>
          </div>
        ))}
        <button type="button" onClick={addContentBlock}>
          Add Content Block
        </button>
        {formData.images.map((image, index) => (
          <div key={index}>
            <input
              placeholder="Image URL"
              required
              onChange={(e) => handleImageChange(index, e.target.value)}
              value={image}
            />
            <button type="button" onClick={() => deleteImageBlock(index)}>
              Delete Image Block
            </button>
          </div>
        ))}
        <button type="button" onClick={addImageBlock}>
          Add Image Block
        </button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AdminNewPost;
