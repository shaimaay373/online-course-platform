import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Register.css"; 

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", formData);

      // بعد التسجيل → نوديه للوجن
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page d-flex flex-column align-items-center">

      {/* Navbar */}
      <nav className="navbar w-100 px-4 navbar-custom">
        <span className="navbar-brand text-white fw-bold">LearnHub</span>
        <div className="ms-auto">
          <span className="text-white-50 me-2">Already have account?</span>
          <Link to="/login" className="link-custom">Login</Link>
        </div>
      </nav>

      {/* Card */}
      <div className="card card-custom text-white p-4 mt-4" style={{maxWidth:"400px", width:"100%"}}>
        
        <h3 className="text-center mb-2">Create Account</h3>
        <p className="text-center text-white-50 mb-3">
          Join LearnHub platform 🚀
        </p>

        {/* Role Toggle */}
        <div className="d-flex mb-3 p-1 bg-dark rounded">
          <button
            type="button"
            className={`role-btn flex-fill ${formData.role === "student" ? "active" : ""}`}
            onClick={() => setFormData({...formData, role:"student"})}
          >
            🎓 Student
          </button>

          <button
            type="button"
            className={`role-btn flex-fill ${formData.role === "instructor" ? "active" : ""}`}
            onClick={() => setFormData({...formData, role:"instructor"})}
          >
            🏫 Instructor
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Name */}
          <div className="mb-3">
            <label className="form-label text-white-50">Name</label>
            <input
              type="text"
              name="name"
              className="form-control input-custom"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label text-white-50">Email</label>
            <input
              type="email"
              name="email"
              className="form-control input-custom"
              placeholder="name@email.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label text-white-50">Password</label>
            <input
              type="password"
              name="password"
              className="form-control input-custom"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="error-text text-center">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center mt-3 text-white-50">
          Already have account?{" "}
          <Link to="/login" className="link-custom">Login</Link>
        </p>
      </div>
    </div>
  );
}