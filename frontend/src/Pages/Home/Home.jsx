import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllCourses } from "../../api/courses";
import Navbar from '../../Components/Navbar/Navbar';
import './Home.css';

const THUMB_CLASS = {
  design: 'thumb-design',
  engineering: 'thumb-engineering',
  ai: 'thumb-ai',
  intelligence: 'thumb-ai',
};

const BADGE_CLASS = {
  design: 'badge-design',
  engineering: 'badge-engineering',
  ai: 'badge-ai',
  intelligence: 'badge-intelligence',
};

function getThumbClass(category = '') {
  return THUMB_CLASS[category.toLowerCase()] || 'thumb-default';
}

function getBadgeClass(category = '') {
  return BADGE_CLASS[category.toLowerCase()] || 'badge-default';
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skel-thumb" />
      <div className="skel-body">
        <div className="skel-line" style={{ width: '75%' }} />
        <div className="skel-line" style={{ width: '50%' }} />
        <div className="skel-line" style={{ width: '30%', marginTop: '18px' }} />
      </div>
    </div>
  );
}

function CourseCard({ course }) {
  const cat = course.category || '';
  const price =
    typeof course.price === 'number'
      ? `$${course.price.toFixed(2)}`
      : course.price || '$0.00';

  return (
    <div className="course-card">
      <div className="card-thumb">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} />
        ) : (
          <div className={`card-thumb-placeholder ${getThumbClass(cat)}`} />
        )}
        {cat && (
          <span className={`card-category-badge ${getBadgeClass(cat)}`}>
            {cat}
          </span>
        )}
      </div>
      <div className="card-body">
        <div className="card-title">{course.title}</div>
        {(course.instructor || course.author) && (
         <div className="card-instructor">
  <span className="instructor-icon">▲</span>
  {course.instructor?.name || course.author}
</div>
        )}
        <div className="card-footer">
          <span className="card-price">{price}</span>
          <button className="cart-btn" title="Add to cart">🛒</button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllCourses()
      .then((data) => {
        const list = Array.isArray(data) ? data : data.courses || data.data || [];
        setCourses(list.slice(0, 3));
      })
      .catch(() => setError('Could not load courses.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">

      {/* Navbar */}
     <Navbar/>

      {/* Hero */}
      <div className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          New Semester Admissions Open
        </div>
        <h1 className="hero-title">
          Master Your Future <br />
          <span className="hero-title-accent">with LearnHub</span>
        </h1>
        <p className="hero-subtitle">
          Elevate your skills with an immersive learning experience designed for focus.
        </p>
        <div className="hero-actions">
          <Link to="/courses" className="btn-hero-primary">Start Learning</Link>
          <button className="btn-hero-ghost">View Curriculum</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-item">
          <div className="stat-value">50k+</div>
          <div className="stat-label">Active Students</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">1.2k</div>
          <div className="stat-label">Premium Courses</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">500+</div>
          <div className="stat-label">Expert Mentors</div>
        </div>
      </div>

      {/* Featured Courses */}
      <section className="featured-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Courses</h2>
            <p className="section-desc">
              Carefully curated paths chosen by our academic board for the modern intellectual.
            </p>
          </div>
          <Link to="/courses" className="explore-link">
            Explore all paths →
          </Link>
        </div>

        <div className="courses-grid">
          {loading && [1, 2, 3].map((i) => <SkeletonCard key={i} />)}

          {!loading && error && (
            <p className="error-msg">{error}</p>
          )}

          {!loading && !error && courses.map((course) => (
            <CourseCard key={course._id || course.id} course={course} />
          ))}

          {!loading && !error && courses.length === 0 && (
            <p className="error-msg">No courses available yet.</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <span className="footer-brand">LearnHub</span>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Affiliate Program</a>
          <a href="#">Contact Us</a>
        </div>
        <div className="footer-icons">
          <button className="footer-icon-btn">🌐</button>
          <button className="footer-icon-btn">↗</button>
        </div>
      </footer>
    </div>
  );
}