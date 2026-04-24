import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'
import Navbar from '../../Components/Navbar/Navbar';
import './Course.css';

const CATEGORIES = ['All Courses', 'Web Development', 'Design', 'Business', 'Marketing'];

function initials(name = '') {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'IN';
}

function badgeInfo(course) {
  if (course.badge) return course.badge;
  const title = (course.title || '').toLowerCase();
  if (title.includes('react') || title.includes('advanced')) return { label: 'EXPERT',            cls: 'expert' };
  if (title.includes('ux')    || title.includes('research')) return { label: 'BESTSELLER',         cls: 'bestseller' };
  if (title.includes('business') || title.includes('strategy')) return { label: 'BUSINESS STRATEGY', cls: 'strategy' };
  return { label: 'NEW', cls: 'new' };
}

export default function CoursesPage() {
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [activeCat, setActiveCat] = useState('All Courses');
  const [page, setPage]           = useState(1);
  const [hasMore, setHasMore]     = useState(true);

  const fetchCourses = async (currentPage = 1, cat = activeCat, q = search, reset = false) => {
    setLoading(true);
    try {
      const params = { page: currentPage, limit: 6 };
      if (cat !== 'All Courses') params.category = cat;
      if (q.trim())              params.search   = q.trim();

      const { data } = await api.get('/courses', { params });
      console.log("DATA :" , data)
      const list = data.courses || [];

      setCourses(prev => reset ? list : [...prev, ...list]);
      setHasMore(data.pagination?.hasNextPage || false);
    } catch (e) {
      console.error('Failed to load courses:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(1, activeCat, search, true); }, []);

  const handleCatChange = (cat) => {
    setActiveCat(cat);
    setPage(1);
    fetchCourses(1, cat, search, true);
  };

  const handleSearch = (e) => {
    const q = e.target.value;
    setSearch(q);
    setPage(1);
    fetchCourses(1, activeCat, q, true);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCourses(nextPage, activeCat, search, false);
  };

  return (
    <div className="lh-page">
      <Navbar />

      <div className="lh-hero">
        <h1>Master your <br /><span>Atmosphere.</span></h1>
        <p>Explore our curated collection of intelligence-driven courses. Designed for the focused learner.</p>
        <input
          type="text"
          className="lh-search"
          placeholder="What do you want to learn today?"
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="lh-cats">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`lh-cat-btn${activeCat === cat ? ' active' : ''}`}
            onClick={() => handleCatChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="lh-grid">
        {loading && courses.length === 0 ? (
          <div className="lh-empty">
            <div className="lh-spinner" />
            <p>Loading excellence...</p>
          </div>
        ) : courses.length > 0 ? (
          courses.map(course => (
            <CourseCard key={course._id || course.id} course={course} />
          ))
        ) : (
          <div className="lh-empty">No courses found matching your criteria.</div>
        )}
      </div>

      {hasMore && (
        <div className="lh-load-more-wrap">
          <button className="lh-btn-load" onClick={handleLoadMore} disabled={loading}>
            {loading ? <><span className="mini-spin" /> Loading...</> : 'Load More Courses'}
          </button>
        </div>
      )}

      <footer className="lh-footer">
        <div className="lh-footer-left">
          <a href="/" className="lh-logo">LearnHub</a>
          <p>© 2024 LEARNHUB ATMOSPHERIC INTELLIGENCE · BUILT FOR FOCUS</p>
        </div>
        <div className="lh-footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Affiliate Program</a>
          <a href="#">Contact Us</a>
        </div>
      </footer>
    </div>
  );
}

function CourseCard({ course }) {
  const navigate       = useNavigate();
  const thumb          = course.thumbnail ||
    `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800`;
  const badge          = badgeInfo(course);
  const reviewCount    = course.reviewCount || '1.2k';
  const courseId       = course._id || course.id;


  const instructorName =
    typeof course.instructor === 'object'
      ? course.instructor?.name || 'Lead Instructor'
      : course.instructor || 'Lead Instructor';

  return (
    <div className="lh-card">
      <div className="lh-card-img">
        <img src={thumb} alt={course.title} />
        <span className={`lh-card-badge ${badge.cls}`}>{badge.label}</span>
      </div>
      <div className="lh-card-body">
        <h3 className="lh-card-title">{course.title}</h3>
        <div className="lh-instructor">
          <div className="lh-avatar">{initials(instructorName)}</div>
          <span className="lh-instructor-name">{instructorName}</span>
        </div>
        <div className="lh-card-footer">
          <div className="lh-rating">
            <span className="lh-stars">★★★★★</span>
            <span className="lh-rating-count">({reviewCount})</span>
          </div>
          <span className="lh-price">${course.price || '0.00'}</span>
        </div>
        <div className="lh-card-actions">
          <button
            className="lh-btn-view"
            onClick={() => navigate(`/courses/${courseId}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}