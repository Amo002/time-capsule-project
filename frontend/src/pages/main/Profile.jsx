import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/main/MainLayout";
import axios from "axios";
import "../../styles/main/profile.css";

const Profile = () => {
  const [capsules, setCapsules] = useState([]);
  const [paginatedCapsules, setPaginatedCapsules] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [user, setUser] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    release_date: "",
    release_time: "",
    is_public: true,
    image: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const capsulesPerPage = 6;

  const defaultProfilePicture =
    "http://localhost:5000/default/default-profile.jpg";

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData")) || {};
    setUser(userData);

    const fetchCapsules = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await axios.get(
          `http://localhost:5000/api/users/profile/${userData.id}/fetch-capsules`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) {
          setCapsules(response.data.capsules);
          paginateCapsules(response.data.capsules, 1);
        } else {
          setMessage({ text: "No capsules found.", type: "error" });
        }
      } catch (error) {
        setMessage({ text: "Error fetching capsules.", type: "error" });
      }
    };

    fetchCapsules();
  }, []);

  const paginateCapsules = (allCapsules, page) => {
    const startIndex = (page - 1) * capsulesPerPage;
    const paginatedData = allCapsules.slice(
      startIndex,
      startIndex + capsulesPerPage
    );
    setPaginatedCapsules(paginatedData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validate the release time when the release date is today
    if (
      name === "release_time" &&
      formData.release_date === new Date().toISOString().split("T")[0]
    ) {
      const selectedTime = value.split(":");
      const currentTime = new Date();
      if (
        parseInt(selectedTime[0]) < currentTime.getHours() ||
        (parseInt(selectedTime[0]) === currentTime.getHours() &&
          parseInt(selectedTime[1]) < currentTime.getMinutes())
      ) {
        setMessage({
          text: "Release time cannot be in the past.",
          type: "error",
        });
        return;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file && file.size > 2 * 1024 * 1024) {
      setMessage({ text: "Image size should not exceed 2MB.", type: "error" });
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (file && !allowedTypes.includes(file.type)) {
      setMessage({
        text: "Only JPG, JPEG, and PNG formats are allowed.",
        type: "error",
      });
      return;
    }

    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const currentTime = new Date();
      const selectedDateTime = new Date(
        `${formData.release_date}T${formData.release_time}`
      );

      // Prevent past date and time from being submitted
      if (
        formData.release_date === currentDate &&
        selectedDateTime < currentTime
      ) {
        setMessage({
          text: "Release date and time cannot be in the past.",
          type: "error",
        });
        return;
      }

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
          is_public: true,
          image: null,
        });

        const updatedCapsules = [...capsules, response.data.capsule];
        setCapsules(updatedCapsules);
        paginateCapsules(updatedCapsules, 1);
      } else {
        setMessage({ text: "Failed to create capsule.", type: "error" });
      }
    } catch (error) {
      setMessage({ text: "Error creating capsule.", type: "error" });
    }
  };

  const handlePageChange = (newPage) => {
    if (
      newPage >= 1 &&
      newPage <= Math.ceil(capsules.length / capsulesPerPage)
    ) {
      setCurrentPage(newPage);
      paginateCapsules(capsules, newPage);
    }
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
          <div className="form">
            {message.text && (
              <div className={`message-box ${message.type}`}>
                {message.text}
              </div>
            )}
            <form
              className="create-form"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
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
              <label>Image (Optional):</label>
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
                onChange={(e) => {
                  handleInputChange(e);
                  if (
                    e.target.value === new Date().toISOString().split("T")[0]
                  ) {
                    setFormData((prev) => ({
                      ...prev,
                      release_time: "",
                    }));
                  }
                }}
                min={new Date().toISOString().split("T")[0]}
                required
                className="custom-date-input"
              />

              <label>Release Time:</label>
              <input
                type="time"
                name="release_time"
                value={formData.release_time}
                onChange={handleInputChange}
                min={
                  formData.release_date ===
                  new Date().toISOString().split("T")[0]
                    ? new Date().toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "00:00"
                }
                required
                className="custom-time-input"
              />
              <label>Public:</label>
              <select
                name="is_public"
                value={formData.is_public}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_public: e.target.value === "true",
                  }))
                }
              >
                <option value={true}>Public</option>
                <option value={false}>Private</option>
              </select>
              <button type="submit" className="create-button">
                Create Capsule
              </button>
            </form>
          </div>
        </div>
        <div className="container">
          <div className="capsule-container">
            {paginatedCapsules.map((capsule) => (
              <div key={capsule.id} className="capsule-item">
                <h3>{capsule.title}</h3>
                <div className="capsule-image">
                  <img
                    src={
                      capsule.image_url
                        ? `http://localhost:5000/uploads/${capsule.image_url}`
                        : defaultProfilePicture
                    }
                    alt="Capsule"
                    className="capsule-image"
                  />
                </div>
                <p>
                  Release Date:{" "}
                  {new Date(capsule.release_date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {Math.ceil(capsules.length / capsulesPerPage)}
          </span>
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={
              currentPage === Math.ceil(capsules.length / capsulesPerPage)
            }
          >
            Next
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
