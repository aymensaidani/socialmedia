import { useContext, useEffect, useState } from "react";
import "./stories.css";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stories, setStories] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await makeRequest.get("/stories");
        setStories(response.data);
        setIsLoading(false);
      } catch (error) {
        setError("Something went wrong");
        setIsLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleAddStory = async () => {
    if (!selectedImage) return;

    try {
      const imageUrl = await upload(selectedImage);
      await makeRequest.post("/stories", { img: imageUrl });
      setStories((prevStories) => [
        ...prevStories,
        { id: prevStories.length + 1, img: imageUrl, name: currentUser.name }
      ]);
      setSelectedImage(null);
    } catch (error) {
      console.error("Failed to add story:", error);
    }
  };

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await makeRequest.post('/upload', formData);
      return res.data;
    } catch (err) {
      console.log(err);
      throw err; // Re-throw error to handle it in handleAddStory
    }
  };

  return (
    <div className="stories">
      <div className="story">
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <span>{currentUser.name}</span>
        <label htmlFor="fileInput">Select Photo</label>
        <input type="file" id="fileInput" onChange={handleImageChange}  />
        <button onClick={handleAddStory}>+</button>
      </div>
      {error ? (
        <div>{error}</div>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : (
        stories.map((story) => (
          <div className="story" key={story.id}>
            <img src={story.img} alt="" />
            <span>{story.name}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Stories;
