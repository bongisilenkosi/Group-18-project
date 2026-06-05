import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ApsCalculator.css';

function ApsCalculator() {
  const navigate = useNavigate();
  const [score, setScore] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  
  const [subjects, setSubjects] = useState([
    { id: 'hl', name: 'Home Language', type: 'text', percent: '' },
    { id: 'fal', name: 'First Additional Language', type: 'text', percent: '' },
    { id: 'math', name: 'Mathematics', type: 'select', percent: '', mathType: 'Mathematics' },
    { id: 'lo', name: 'Life Orientation', type: 'text', percent: '' },
    { id: 'elec1', name: 'Elective Subject 1', type: 'text', percent: '' },
    { id: 'elec2', name: 'Elective Subject 2', type: 'text', percent: '' },
    { id: 'elec3', name: 'Elective Subject 3', type: 'text', percent: '' }
  ]);

  const handleInputChange = (id, field, value) => {
    setSubjects(subjects.map(sub => 
      sub.id === id ? { ...sub, [field]: value } : sub
    ));
  };

  const getPoints = (percent, isLO) => {
    const p = Number(percent);
    if (isNaN(p) || p < 0) return 0;
    
    if (isLO) {
      if (p >= 80) return 3;
      if (p >= 70) return 2;
      if (p >= 60) return 1;
      return 0;
    }

    if (p >= 80) return 7;
    if (p >= 70) return 6;
    if (p >= 60) return 5;
    if (p >= 50) return 4;
    if (p >= 40) return 3;
    if (p >= 30) return 2;
    if (p > 0) return 1;
    return 0;
  };

  const calculateAPS = (e) => {
    e.preventDefault();
    let totalScore = 0;
    let mathScore = 0;
    let mathType = 'Mathematical Literacy';

    subjects.forEach(sub => {
      const points = getPoints(sub.percent, sub.id === 'lo');
      totalScore += points;
      
      if (sub.id === 'math') {
        mathScore = Number(sub.percent);
        mathType = sub.mathType;
      }
    });

    setScore(totalScore);
    determineQualifications(totalScore, mathScore, mathType);
  };

  const determineQualifications = (aps, mathPercent, mathType) => {
    const recs = [];

    if (aps >= 25 && mathType === 'Mathematics' && mathPercent >= 50) {
      recs.push({
        title: "Bachelor of Computing",
        desc: "You meet the requirements for our premier 4-year degree specializing in Software Engineering.",
        color: "#E5243B"
      });
      recs.push({
        title: "Bachelor of Information Technology",
        desc: "You meet the requirements for our 3-year degree.",
        color: "#E5243B"
      });
    }

    if (
      (aps >= 23 && mathType === 'Mathematical Literacy' && mathPercent >= 50) || 
      (aps >= 23 && mathType === 'Mathematics' && mathPercent >= 40)
    ) {
      recs.push({
        title: "Diploma in Information Technology",
        desc: "You meet the requirements for our 3-year specialized IT diploma.",
        color: "#FFC400"
      });
    }

    if (aps >= 15 && aps < 23) {
      recs.push({
        title: "Certificate in Information Technology",
        desc: "You meet the requirements for our 1-year foundational IT certificate.",
        color: "#FFFFFF"
      });
    }

    if (recs.length === 0) {
      recs.push({
        title: "Contact Admissions",
        desc: "Please reach out to our admissions team to discuss alternative entry routes.",
        color: "#9CA3AF"
      });
    }

    setRecommendations(recs);
  };

  return (
    <div className="aps-page">
      <div className="aps-container">
        <div className="aps-header">
          <h1 className="aps-title">APS Calculator</h1>
          <p className="aps-subtitle">Enter your subjects and percentages to find your eligible qualifications.</p>
        </div>
        
        <form onSubmit={calculateAPS}>
          {subjects.map((sub) => (
            <div key={sub.id} className="subject-row">
              {sub.type === 'select' ? (
                <select 
                  className="subject-input dark-select" 
                  value={sub.mathType}
                  onChange={(e) => handleInputChange(sub.id, 'mathType', e.target.value)}
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Mathematical Literacy">Mathematical Literacy</option>
                </select>
              ) : (
                <input 
                  type="text" 
                  className="subject-input" 
                  value={sub.name}
                  onChange={(e) => handleInputChange(sub.id, 'name', e.target.value)}
                  placeholder="Enter Subject Name"
                  readOnly={sub.id === 'lo'}
                />
              )}
              
              <input 
                type="number" 
                className="grade-select"
                placeholder="%"
                min="0"
                max="100"
                value={sub.percent}
                onChange={(e) => handleInputChange(sub.id, 'percent', e.target.value)}
                required
              />
            </div>
          ))}
          
          <button type="submit" className="calc-btn">Calculate Score & See Courses</button>
        </form>

        {score > 0 && (
          <div className="result-box">
            <div className="result-text">Your Total APS Is</div>
            <div className="result-score">{score}</div>
            
            <div style={{ marginTop: '30px', textAlign: 'left' }}>
              <h3 style={{ color: '#FFFFFF', marginBottom: '15px' }}>Eligible Qualifications:</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {recommendations.map((rec, index) => (
                  <div key={index} style={{ 
                    padding: '15px', 
                    borderLeft: `4px solid ${rec.color}`, 
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderRadius: '0 8px 8px 0'
                  }}>
                    <h4 style={{ margin: '0 0 5px 0', color: rec.color }}>{rec.title}</h4>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#9CA3AF' }}>{rec.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      
        <div className="back-btn-container">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>

      </div>
    </div>
  );
}

export default ApsCalculator;