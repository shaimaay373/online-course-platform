import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      const { accessToken, user } = res.data;
      login(user, accessToken);

      navigate(user.role === "instructor" ? "/dashboard" : "/courses");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page d-flex flex-column align-items-center">

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg w-100 px-4 navbar-custom">
        <span className="navbar-brand text-white fw-bold">LearnHub</span>
        <div className="ms-auto">
          <span className="text-white-50 me-2">New here?</span>
          <Link to="/register" className="link-custom">Register</Link>
        </div>
      </nav>

      {/* Card */}
      <div className="card card-custom text-white p-4 mt-4" style={{maxWidth:"400px", width:"100%"}}>
        
        <h3 className="text-center mb-2">Welcome Back</h3>
        <p className="text-center text-white-50 mb-3">
          Enter your credentials
        </p>

        {/* Role Toggle */}
        <div className="d-flex mb-3 p-1 bg-dark rounded">
          <button
            className={`role-btn flex-fill ${formData.role === "student" ? "active" : ""}`}
            onClick={() => setFormData({...formData, role:"student"})}
          >
            🎓 Student
          </button>

          <button
            className={`role-btn flex-fill ${formData.role === "instructor" ? "active" : ""}`}
            onClick={() => setFormData({...formData, role:"instructor"})}
          >
            🏫 Instructor
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
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
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control input-custom"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && <p className="error-text text-center">{error}</p>}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center mt-3 text-white-50">
          Don't have an account?{" "}
          <Link to="/register" className="link-custom">Create</Link>
        </p>
      </div>
    </div>
  );
}