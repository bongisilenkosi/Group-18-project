import { Link } from 'react-router-dom';
import '../styles/SignUp.css';

function SignUp() {
  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="signup-title">Create Account</h1>
        <form className="signup-form">
          <div className="input-group">
            <label>Name</label>
            <input type="text" name="name" placeholder="Enter your first name" required />
          </div>
          <div className="input-group">
            <label>Surname</label>
            <input type="text" name="surname" placeholder="Enter your surname" required />
          </div>
          <div className="input-group">
            <label>ID Number</label>
            <input type="text" name="idNumber" placeholder="Enter your SA ID number" required minLength="13" maxLength="13" />
          </div>
          <div className="input-group">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="Enter your email" required />
          </div>
          <div className="input-group">
            <label>Phone Number</label>
            <input type="tel" name="phone" placeholder="Enter your phone number" required />
          </div>
          <div className="input-group">
            <label>Physical Address</label>
            <input type="text" name="address" placeholder="Enter your physical address" required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Create a strong password" required />
          </div>
          <button type="submit" className="signup-btn">Sign Up</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '24px', color: '#9CA3AF' }}>
          Already have an account? <Link to="/login" style={{ color: '#FFC400', textDecoration: 'none', fontWeight: 'bold' }}>Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;