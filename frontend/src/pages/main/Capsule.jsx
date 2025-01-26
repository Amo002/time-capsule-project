import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import MainLayout from "../../layouts/main/MainLayout";
import "../../styles/main/capsule.css";

const CapsulePage = () => {
  const { capsuleId } = useParams();
  const [capsule, setCapsule] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [isAccessible, setIsAccessible] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [modalMessage, setModalMessage] = useState({ text: "", type: "" });
  const [editData, setEditData] = useState({
    title: "",
    content: "",
    release_date_date: "",
    release_date_time: "",
    image: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCapsule();
  }, [capsuleId]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => Math.max(prev - 1000, 0));
      }, 1000);

      return () => clearInterval(timer);
    } else if (countdown === 0) {
      fetchCapsuleDetails();
    }
  }, [countdown]);

  const fetchCapsule = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const userData = JSON.parse(localStorage.getItem("userData")) || {};
      setLoggedInUser(userData);

      const response = await axios.get(
        `http://localhost:5000/api/capsules/${capsuleId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        const capsuleData = response.data.capsule;
        setCapsule(capsuleData);

        const releaseDate = new Date(capsuleData.release_date).getTime();
        const currentTime = Date.now();

        if (userData.id === capsuleData.user_id || currentTime >= releaseDate) {
          setIsAccessible(true);
        } else {
          setCountdown(releaseDate - currentTime);
        }
      }
    } catch (error) {
      console.error("Error fetching capsule:", error);
    }
  };

  const fetchCapsuleDetails = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await axios.get(
        `http://localhost:5000/api/capsules/${capsuleId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setCapsule(response.data.capsule);
        setIsAccessible(true);
      }
    } catch (error) {
      console.error("Error fetching updated capsule details:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("userToken");

      await axios.delete(`http://localhost:5000/api/capsules/${capsuleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setModalMessage({
        text: "Capsule deleted successfully!",
        type: "success",
      });
      setTimeout(() => {
        navigate(`/profile/${loggedInUser.id}`);
        setModalMessage({ text: "", type: "" });
      }, 1000);
    } catch (error) {
      setModalMessage({ text: "Error deleting capsule.", type: "error" });
      console.error("Error deleting capsule:", error);
    }
  };

  const handleEdit = () => {
    const [datePart, timePart] = new Date(capsule.release_date)
      .toISOString()
      .split("T");
    setEditData({
      title: capsule.title || "",
      content: capsule.content || "",
      release_date_date: datePart,
      release_date_time: timePart.slice(0, 5),
      image: null,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("userToken");
      const formData = new FormData();
      formData.append("title", editData.title);
      formData.append("content", editData.content);

      const releaseDateTime = `${editData.release_date_date}T${editData.release_date_time}:00`;
      formData.append("release_date", releaseDateTime);

      if (editData.image) {
        formData.append("image", editData.image);
      }

      const response = await axios.put(
        `http://localhost:5000/api/capsules/${capsuleId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setCapsule({
          ...capsule,
          title: editData.title,
          content: editData.content,
          release_date: releaseDateTime,
          image_url: editData.image
            ? URL.createObjectURL(editData.image)
            : capsule.image_url,
        });
        setModalMessage({
          text: "Capsule updated successfully!",
          type: "success",
        });
        setTimeout(() => {
          setShowEditModal(false);
          setModalMessage({ text: "", type: "" });
        }, 1000);
      }
    } catch (error) {
      setModalMessage({ text: "Error editing capsule.", type: "error" });
      console.error("Error editing capsule:", error.response?.data || error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/capsules/${capsuleId}`;
    navigator.clipboard.writeText(link);
    setModalMessage({ text: "Link copied to clipboard!", type: "success" });
    setTimeout(() => {
      setModalMessage({ text: "", type: "" });
    }, 1000);
  };

  const formatCountdown = (ms) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const seconds = Math.floor((ms / 1000) % 60);
    return { days, hours, minutes, seconds };
  };

  return (
    <MainLayout>
      <div className="capsule-page">
        {capsule && (
          <div className="capsule-details">
            {!isAccessible ? (
              <div className="countdown-section">
                <h2>{capsule.title}</h2>
                <div className="countdown-timer">
                  <h1>
                    {formatCountdown(countdown).days}d{" "}
                    {formatCountdown(countdown).hours}h{" "}
                    {formatCountdown(countdown).minutes}m{" "}
                    {formatCountdown(countdown).seconds}s
                  </h1>
                </div>
                <p>
                  Release Date:{" "}
                  {new Date(capsule.release_date).toLocaleString()}
                </p>
              </div>
            ) : (
              <>
                <div className="capsule-creator">
                  <img
                    src={
                      capsule.creator_profile_picture
                        ? `http://localhost:5000/uploads/${capsule.creator_profile_picture}`
                        : "http://localhost:5000/default/default-profile.jpg"
                    }
                    alt={capsule.creator_name}
                    className="creator-profile-picture"
                  />
                  <span className="creator-name">{capsule.creator_name}</span>
                  {loggedInUser && loggedInUser.id === capsule.user_id && (
                    <div className="edit-menu-container">
                      <button className="edit-button" onClick={handleEdit}>
                        Edit
                      </button>
                      <button
                        className="edit-button"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <h1>{capsule.title}</h1>
                <div className="capsule-content">
                  <p>{capsule.content}</p>
                  {capsule.image_url && (
                    <div className="capsule-image">
                      <img
                        src={`http://localhost:5000/uploads/${capsule.image_url}`}
                        alt={capsule.title}
                      />
                    </div>
                  )}
                </div>
                <p>
                  <strong>Release Date:</strong>{" "}
                  {new Date(capsule.release_date).toLocaleString()}
                </p>
              </>
            )}
          </div>
        )}

        {showDeleteModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Are you sure you want to delete this capsule?</h2>
              {modalMessage.text && (
                <p className={`message ${modalMessage.type}`}>
                  {modalMessage.text}
                </p>
              )}
              <button className="yes-button" onClick={handleDelete}>
                Yes
              </button>
              <button
                className="no-button"
                onClick={() => setShowDeleteModal(false)}
              >
                No
              </button>
            </div>
          </div>
        )}

        {showEditModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Edit Capsule</h2>
              {modalMessage.text && (
                <p className={`message ${modalMessage.type}`}>
                  {modalMessage.text}
                </p>
              )}
              <label>Title</label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, title: e.target.value }))
                }
              />
              <label>Content</label>
              <textarea
                value={editData.content}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, content: e.target.value }))
                }
              />
              <label>Release Date (Date)</label>
              <input
                type="date"
                value={editData.release_date_date}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    release_date_date: e.target.value,
                  }))
                }
              />
              <label>Release Date (Time)</label>
              <input
                type="time"
                value={editData.release_date_time}
                onChange={(e) =>
                  setEditData((prev) => ({
                    ...prev,
                    release_date_time: e.target.value,
                  }))
                }
              />
              <label>Image</label>
              <input type="file" onChange={handleImageChange} />
              <button className="yes-button" onClick={handleEditSubmit}>
                Save
              </button>
              <button
                className="no-button"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <button
          className="share-button"
          onClick={() => setShowShareModal(true)}
        >
          Share
        </button>

        {showShareModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Share Capsule</h2>
              {modalMessage.text && (
                <p className={`message ${modalMessage.type}`}>
                  {modalMessage.text}
                </p>
              )}
              <div className="share-content">
                <input
                  type="text"
                  value={`${window.location.origin}/capsules/${capsuleId}`}
                  readOnly
                />
                <button className="copy-button" onClick={handleCopyLink}>
                  Copy
                </button>
              </div>
              <button
                className="close-button"
                onClick={() => setShowShareModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CapsulePage;
