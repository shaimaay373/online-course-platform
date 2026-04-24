import React, { useEffect, useState, useContext } from 'react';
import api from '../../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { AuthContext } from '../../context/AuthContext';
import './CourseDetails.css';

const CourseDetails = () => {
  const { addNotification } = useNotifications();
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { user }     = useContext(AuthContext);
  const currentUserId = user?._id;

  const [course,         setCourse]         = useState(null);
  const [lessons,        setLessons]        = useState([]);
  const [comments,       setComments]       = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [enrolling,      setEnrolling]      = useState(false);
  const [enrolled,       setEnrolled]       = useState(false);
  const [newComment,     setNewComment]     = useState('');
  const [posting,        setPosting]        = useState(false);
  const [toast,          setToast]          = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [courseRes, commentsRes] = await Promise.all([
          api.get(`/courses/${id}`),
          api.get(`/comments/${id}`),
        ]);
        const courseData = courseRes.data?.course || courseRes.data;
        setCourse(courseData);
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

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

 const handleEnroll = async () => {
  if (enrolled) return;
  setEnrolling(true);
  try {
    await api.post(`/enrollments/${id}/enroll`);
    setEnrolled(true);
    showToast('🎉 You have successfully enrolled in this course!', 'success');
   
    addNotification(`✅ You enrolled in "${course.title}"`);
  } catch (err) {
    const msg = err.response?.data?.message || '';
    if (msg.toLowerCase().includes('already')) {
      setEnrolled(true);
      showToast('You are already enrolled in this course.', 'error');
      addNotification(`ℹ️ You are already enrolled in "${course.title}"`);
    } else {
      showToast('Enrollment failed. Please login first.', 'error');
    }
  } finally {
    setEnrolling(false);
  }
};

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

  const handleEditComment = async () => {
    if (!editingComment?.text?.trim()) return;
    try {
      const res = await api.put(`/comments/${editingComment.id}`, { text: editingComment.text });
      const updated = res.data?.comment || res.data;
      setComments(prev => prev.map(c => (c._id === editingComment.id ? updated : c)));
      setEditingComment(null);
      showToast('Comment updated!', 'success');
    } catch {
      showToast('Failed to update comment.', 'error');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
      showToast('Comment deleted.', 'success');
    } catch {
      showToast('Failed to delete comment.', 'error');
    }
  };

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

  if (loading) return (
    <div className="cd-center">
      <div className="cd-spinner" />
      <p>Loading course...</p>
    </div>
  );

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
              {instructorEmail && <p className="cd-inst-email">{instructorEmail}</p>}
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
                  <span className="cd-lesson-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="cd-lesson-title">{lesson.title}</p>
                    {lesson.content && <p className="cd-lesson-sub">{lesson.content}</p>}
                  </div>
                </div>
                <span className="cd-lesson-dur">
                  {lesson.duration ? `${lesson.duration} min` : ''}
                </span>
              </div>
            )) : (
              <div className="cd-no-lessons">No lessons available yet.</div>
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
                  {(c.user?.name || '?').charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div>
                    <span className="cd-comment-name">{c.user?.name || 'Anonymous'}</span>
                    <span className="cd-comment-time">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>

                  {editingComment?.id === c._id ? (
                    <div style={{ marginTop: '8px' }}>
                      <textarea
                        className="cd-textarea"
                        style={{ width: '100%', minHeight: '60px' }}
                        value={editingComment.text}
                        onChange={e => setEditingComment({ ...editingComment, text: e.target.value })}
                      />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <button className="cd-btn-post" onClick={handleEditComment}>Save</button>
                        <button
                          onClick={() => setEditingComment(null)}
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: 'rgba(255,255,255,0.6)',
                            padding: '6px 16px',
                            borderRadius: '99px',
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="cd-comment-text">{c.text}</p>
                  )}

                  {c.user?._id === currentUserId && (
                   <div className="cd-comment-actions" style={{ marginTop: '6px', display: 'flex', gap: '10px' }}>
  <button
    onClick={() => setEditingComment({ id: c._id, text: c.text })}
    style={{
      background: 'rgba(108,111,255,0.12)',
      border: '1px solid rgba(108,111,255,0.35)',
      color: '#a5a8ff',
      padding: '5px 14px',
      borderRadius: '8px',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'all .2s'
    }}
  >
    Edit
  </button>
  <button
    onClick={() => handleDeleteComment(c._id)}
    style={{
      background: 'rgba(255,100,100,0.1)',
      border: '1px solid rgba(255,100,100,0.3)',
      color: '#ff6464',
      padding: '5px 14px',
      borderRadius: '8px',
      fontSize: '12px',
      cursor: 'pointer',
      transition: 'all .2s'
    }}
  >
     Delete
  </button>
</div>
                  )}
                </div>
              </div>
            )) : (
              <div className="cd-no-comments">No comments yet. Be the first!</div>
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
          <button
            className={`cd-btn-enroll${enrolled ? ' enrolled' : ''}`}
            onClick={handleEnroll}
            disabled={enrolling || enrolled}
          >
            {enrolling
              ? <><span className="mini-spin" /> Enrolling...</>
              : enrolled ? '✓ Enrolled' : 'Enroll Now →'
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
          <p className="cd-guarantee">30-Day Money-Back Guarantee. No questions asked.</p>
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