import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import './CourseDetails.css';

const CourseDetails = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();

  const [course,    setCourse]    = useState(null);
  const [lessons,   setLessons]   = useState([]);
  const [comments,  setComments]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled,  setEnrolled]  = useState(false);
  const [newComment, setNewComment] = useState('');
  const [posting,   setPosting]   = useState(false);
  const [toast,     setToast]     = useState(null); // { msg, type }

  // ── جلب البيانات ──
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      // ✅ course + lessons في request واحد
      const [courseRes, commentsRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get(`/comments/${id}`),
      ]);

      const courseData = courseRes.data?.course || courseRes.data;
      setCourse(courseData);

      // ✅ الـ lessons بتيجي مع الـ course مش في request منفصل
      setLessons(courseRes.data?.lessons || []);
      setComments(commentsRes.data?.comments || commentsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [id]);

  // ── Toast helper ──
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Enroll ──
  const handleEnroll = async () => {
    if (enrolled) return;
    setEnrolling(true);
    try {
      await api.post(`/enrollments/${id}/enroll`);
      setEnrolled(true);
      showToast('🎉 You have successfully enrolled in this course!', 'success');
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (msg.toLowerCase().includes('already')) {
        setEnrolled(true);
        showToast('You are already enrolled in this course.', 'error');
      } else {
        showToast('Enrollment failed. Please login first.', 'error');
      }
    } finally {
      setEnrolling(false);
    }
  };

  // ── Post Comment ──
  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setPosting(true);
    try {
    const res = await api.post(`/comments/${id}`, { text: newComment });
      const comment = res.data?.comment || res.data;
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      showToast('Comment posted!', 'success');
    } catch {
      showToast('Only enrolled students can comment.', 'error');
    } finally {
      setPosting(false);
    }
  };

  // ── helpers ──
  const initials = (name = '') =>
    name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

  const instructorName =
    typeof course?.instructor === 'object'
      ? course?.instructor?.name || 'Instructor'
      : course?.instructor || 'Instructor';

  const instructorEmail =
    typeof course?.instructor === 'object'
      ? course?.instructor?.email || ''
      : '';

  // ── Loading ──
  if (loading) return (
    <div className="cd-center">
      <div className="cd-spinner" />
      <p>Loading course...</p>
    </div>
  );

  // ── Not Found ──
  if (!course) return (
    <div className="cd-center">
      <p>Course not found.</p>
      <button className="cd-back" onClick={() => navigate('/courses')}>
        ← Back to Courses
      </button>
    </div>
  );

  const thumb = course.thumbnail ||
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800';

  return (
    <div className="cd-page">

      {/* Navbar */}
      <nav className="cd-nav">
        <a href="/" className="cd-logo">LearnHub</a>
        <button className="cd-back" onClick={() => navigate('/courses')}>
          ← Back to Courses
        </button>
      </nav>

      <div className="cd-body">

        {/* ── LEFT ── */}
        <div>
          <span className="cd-badge">★ PREMIUM CERTIFICATION</span>
          <h1 className="cd-title">{course.title}</h1>
          <p className="cd-desc">{course.description || 'No description available.'}</p>

          {/* Meta */}
          <div className="cd-meta">
            <div className="cd-meta-item">
              <small>Category</small>
              <strong>{course.category || '—'}</strong>
            </div>
            <div className="cd-meta-item">
              <small>Level</small>
              <strong>{course.level || 'All Levels'}</strong>
            </div>
            <div className="cd-meta-item">
              <small>Lessons</small>
              <strong>{lessons.length}</strong>
            </div>
            <div className="cd-meta-item">
              <small>Duration</small>
              <strong>{course.duration || '—'}</strong>
            </div>
          </div>

          {/* Instructor */}
          <div className="cd-instructor">
            <div className="cd-inst-avatar">{initials(instructorName)}</div>
            <div>
              <p className="cd-inst-label">Instructor</p>
              <p className="cd-inst-name">{instructorName}</p>
              {instructorEmail && (
                <p className="cd-inst-email">{instructorEmail}</p>
              )}
            </div>
          </div>

          {/* Lessons */}
          <div>
            <div className="cd-section-title">
              Curriculum
              <span>{lessons.length} lessons</span>
            </div>

            {lessons.length > 0 ? lessons.map((lesson, i) => (
              <div key={lesson._id || i} className="cd-lesson">
                <div className="cd-lesson-left">
                  <span className="cd-lesson-num">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="cd-lesson-title">{lesson.title}</p>
                    {lesson.content && (
                      <p className="cd-lesson-sub">{lesson.content}</p>
                    )}
                  </div>
                </div>
                <span className="cd-lesson-dur">
                  {lesson.duration ? `${lesson.duration} min` : ''}
                </span>
              </div>
            )) : (
              <div className="cd-no-lessons">
                No lessons available yet.
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="cd-comments">
            <div className="cd-section-title">
              Community Discussion
              <span>{comments.length} comments</span>
            </div>

            {/* Post Comment */}
            <div className="cd-comment-form">
              <div className="cd-avatar-sm">JD</div>
              <div className="cd-textarea">
                <textarea
                  rows={2}
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                />
                <button
                  className="cd-btn-post"
                  onClick={handlePostComment}
                  disabled={posting}
                >
                  {posting ? <span className="mini-spin" /> : 'Post Comment'}
                </button>
              </div>
            </div>

            {/* Comments List */}
            {comments.length > 0 ? comments.map((c, i) => (
              <div key={c._id || i} className="cd-comment-item">
                <div className="cd-comment-avatar">
                  {(c.userName || c.user?.name || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div>
                    <span className="cd-comment-name">
                      {c.userName || c.user?.name || 'Anonymous'}
                    </span>
                    <span className="cd-comment-time">
                      {c.timeAgo || c.createdAt
                        ? new Date(c.createdAt).toLocaleDateString()
                        : ''}
                    </span>
                  </div>
                  <p className="cd-comment-text">{c.text}</p>
                </div>
              </div>
            )) : (
              <div className="cd-no-comments">
                No comments yet. Be the first!
              </div>
            )}
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div className="cd-sidebar">
          <img src={thumb} alt={course.title} className="cd-thumb" />

          <div className="cd-price-row">
            <span className="cd-price">${course.price || '0.00'}</span>
            <span className="cd-price-label">Lifetime Access</span>
          </div>

          {/* Enroll Button */}
          <button
            className={`cd-btn-enroll${enrolled ? ' enrolled' : ''}`}
            onClick={handleEnroll}
            disabled={enrolling || enrolled}
          >
            {enrolling
              ? <><span className="mini-spin" /> Enrolling...</>
              : enrolled
                ? '✓ Enrolled'
                : 'Enroll Now →'
            }
          </button>

          <p className="cd-includes-title">This Course Includes:</p>
          <ul className="cd-includes-list">
            <li><span>▶️</span> {lessons.length} Video Lessons</li>
            <li><span>📄</span> Downloadable Resources</li>
            <li><span>💻</span> Hands-on Projects</li>
            <li><span>✅</span> Certificate of Completion</li>
            <li><span>♾️</span> Lifetime Access</li>
          </ul>

          <hr className="cd-divider" />
          <p className="cd-guarantee">
            30-Day Money-Back Guarantee. No questions asked.
          </p>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`cd-toast ${toast.type}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default CourseDetails;