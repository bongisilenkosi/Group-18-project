import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/about.css';
import logo from '../assets/bc-logo.jpeg'; 

function About() {
  const navigate = useNavigate(); // Handles the back navigation

  return (
    <div className="about-page">
      <div className="about-header">
        <img src={logo} alt="Belgium Campus iTversity" className="about-logo" />
        <h1 className="about-title">It's the way we're wired.</h1>
        <p className="about-subtitle">Pioneering IT Education in South Africa since 1999</p>
      </div>

      <div className="info-grid">
        <div className="info-card">
          <h3>Participatory Learning Model</h3>
          <p>We bridge the gap between academia and industry. Our curriculum is co-created with top tech companies to ensure our students learn exactly what the global IT sector demands. You aren't just reading textbooks; you are building real-world solutions.</p>
        </div>

        <div className="info-card">
          <h3>1-Year Industry Internship</h3>
          <p>Experience is the best teacher. As part of our degree programs, students complete a rigorous 1-year internship. This guarantees that you enter the workforce not just as a graduate, but as an experienced professional ready to add value immediately.</p>
        </div>

        <div className="info-card">
          <h3>Three Innovation Hubs</h3>
          <p>With cutting-edge campuses in Pretoria, Ekurhuleni, and Nelson Mandela Bay, we provide high-tech environments designed to foster creativity, collaboration, and technological breakthroughs across South Africa.</p>
        </div>
      </div>

      <div className="table-section">
        <h2 className="table-heading">Qualifications & Fees</h2>
        <div className="table-container">
          <table className="bc-table">
            <thead>
              <tr>
                <th>Qualification</th>
                <th>NQF Level</th>
                <th>Estimated Fee</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Bachelor of Computing (Software Engineering)</td>
                <td>8</td>
                <td>R 72,000.00</td>
              </tr>
              <tr>
                <td>Bachelor of Information Technology</td>
                <td>7</td>
                <td>R 59,400.00</td>
              </tr>
              <tr>
                <td>Diploma in Information Technology</td>
                <td>6</td>
                <td>R 65,500.00</td>
              </tr>
              <tr>
                <td>Certificate in Information Technology</td>
                <td>5</td>
                <td>R 45,000.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      
      <div className="back-btn-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>

    </div>
  );
}

export default About;