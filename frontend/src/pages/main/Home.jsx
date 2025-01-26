import React, { useState, useEffect } from "react";
import MainLayout from "../../layouts/main/MainLayout";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/main/home.css";

const Home = () => {
  const [capsules, setCapsules] = useState([]);
  const [paginatedCapsules, setPaginatedCapsules] = useState([]);
  const [totalCapsules, setTotalCapsules] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const capsulesPerPage = 6;
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllCapsules();
  }, []);

  const fetchAllCapsules = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/capsules/fetchAllCapsules`
      );
      if (response.data.success) {
        setCapsules(response.data.capsules);
        setPaginatedCapsules(response.data.capsules.slice(0, capsulesPerPage));
        setTotalCapsules(response.data.capsules.length);
      }
    } catch (error) {
      console.error("Error fetching capsules:", error);
    }
  };
  

  const handlePageChange = (page) => {
    const startIndex = (page - 1) * capsulesPerPage;
    const endIndex = startIndex + capsulesPerPage;
    setPaginatedCapsules(capsules.slice(startIndex, endIndex));
    setCurrentPage(page);
  };

  const isReleased = (releaseDate) => {
    const currentTime = new Date().getTime();
    const releaseTime = new Date(releaseDate).getTime();
    return currentTime >= releaseTime;
  };

  const handleCapsuleClick = (capsuleId) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      navigate(`/capsule/${capsuleId}`);
    } else {
      navigate(`/user-login`);
    }
  };

  return (
    <MainLayout>
      <div className="home-content">
        <h1>Welcome to Time Capsule</h1>
        <p>Your memories, preserved forever.</p>

        <div className="capsule-container">
          {paginatedCapsules.length > 0 ? (
            paginatedCapsules.map((capsule) => (
              <div
                key={capsule.id}
                className="capsule-item"
                onClick={() => handleCapsuleClick(capsule.id)}
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
              </div>
            ))
          ) : (
            <div className="no-capsules">
              <p>No capsules found.</p>
            </div>
          )}
        </div>

        {totalCapsules > 0 && (
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {Math.ceil(totalCapsules / capsulesPerPage)}
            </span>
            <button
              className="pagination-button"
              onClick={() =>
                handlePageChange(
                  Math.min(
                    currentPage + 1,
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
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
