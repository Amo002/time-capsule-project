import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/main/MainLayout";
import axios from "axios";
import { Link } from "react-router-dom";
import "../../styles/main/profile.css";

const Profile = () => {
  const [capsules, setCapsules] = useState([]);
  const [paginatedCapsules, setPaginatedCapsules] = useState([]);
  const [totalCapsules, setTotalCapsules] = useState(0);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    release_date: "",
    release_time: "",
    image: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const capsulesPerPage = 6;

  const defaultProfilePicture =
    "http://localhost:5000/default/default-profile.jpg";

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    setUser(userData);

    fetchCapsules(currentPage);
  }, [currentPage]);

  const fetchCapsules = async (page = 1) => {
    try {
      const token = localStorage.getItem("userToken");
      const userData = JSON.parse(localStorage.getItem("userData")) || {};
      const response = await axios.get(
        `http://localhost:5000/api/users/profile/${userData.id}/fetch-capsules?page=${page}&limit=${capsulesPerPage}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.success) {
        setCapsules(response.data.capsules);
        setPaginatedCapsules(response.data.capsules);
        setTotalCapsules(response.data.total);
      }
    } catch (error) {
      setMessage({ text: "Error fetching capsules.", type: "error" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("userToken");
      const userData = JSON.parse(localStorage.getItem("userData")) || {};
      const formDataToSend = new FormData();

      const releaseDateTime = `${formData.release_date}T${formData.release_time}`;
      formDataToSend.append("release_date", releaseDateTime);

      Object.keys(formData).forEach((key) => {
        if (key !== "release_date" && key !== "release_time") {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post(
        `http://localhost:5000/api/users/profile/${userData.id}/add-capsule`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setMessage({ text: "Capsule created successfully!", type: "success" });
        setFormData({
          title: "",
          content: "",
          release_date: "",
          release_time: "",
          image: null,
        });

        // Fetch the updated capsules dynamically
        fetchCapsules(currentPage);

        setTimeout(() => {
          setMessage({ text: "", type: "" });
        }, 2000);
      } else {
        setMessage({ text: "Failed to create capsule.", type: "error" });
        setTimeout(() => setMessage({ text: "", type: "" }), 2000);
      }
    } catch (error) {
      setMessage({ text: "Error creating capsule.", type: "error" });
      setTimeout(() => setMessage({ text: "", type: "" }), 2000);
    }
  };

  const isReleased = (releaseDate) => {
    const currentTime = new Date().getTime();
    const releaseTime = new Date(releaseDate).getTime();
    return currentTime >= releaseTime;
  };

  return (
    <MainLayout>
      <div className="profile-content">
        <div className="container">
          <div className="profile">
            <div className="profile-picture">
              <img
                src={
                  user.profile_picture
                    ? `http://localhost:5000/uploads/${user.profile_picture}`
                    : defaultProfilePicture
                }
                alt="Profile"
                className="profile-picture"
              />
            </div>
            <div className="details">
              <h2>{user.username}</h2>
            </div>
          </div>
        </div>
        <div className="container">
          {message.text && (
            <div className={`message-box ${message.type}`}>{message.text}</div>
          )}
          <form className="create-form" onSubmit={handleSubmit}>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <label>Content:</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
            <label>Release Date:</label>
            <input
              type="date"
              name="release_date"
              value={formData.release_date}
              onChange={handleInputChange}
              required
            />
            <label>Release Time:</label>
            <input
              type="time"
              name="release_time"
              value={formData.release_time}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Create Capsule</button>
          </form>
        </div>
        <div className="container">
          {paginatedCapsules.length > 0 ? (
            <>
              <div className="capsule-container">
                {paginatedCapsules.map((capsule) => (
                  <Link
                    to={`/capsule/${capsule.id}`}
                    key={capsule.id}
                    className="capsule-item"
                  >
                    <h3>{capsule.title}</h3>
                    <p>
                      {isReleased(capsule.release_date)
                        ? "Released"
                        : "Not Released"}
                    </p>
                    <p>
                      Release Date:{" "}
                      {new Date(capsule.release_date).toLocaleString("en-GB")}
                    </p>
                  </Link>
                ))}
              </div>
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of{" "}
                  {Math.ceil(totalCapsules / capsulesPerPage)}
                </span>
                <button
                  className="pagination-button"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        prev + 1,
                        Math.ceil(totalCapsules / capsulesPerPage)
                      )
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(totalCapsules / capsulesPerPage)
                  }
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="no-capsules">
              <p>No capsules found.</p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
