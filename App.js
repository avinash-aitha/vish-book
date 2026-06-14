import React, { useState } from 'react';
import './App.css';

const INITIAL_USERS = [
  { id: 1, name: 'Vish Mandala', avatar: 'VM', color: '#1877f2', bio: 'Finance @ Kelley | Value Investor | Toastmasters' },
  { id: 2, name: 'Sarah Kim', avatar: 'SK', color: '#e4405f', bio: 'Marketing enthusiast & coffee addict ☕' },
  { id: 3, name: 'Alex Chen', avatar: 'AC', color: '#0077b5', bio: 'Software Engineer | Open source contributor' },
  { id: 4, name: 'Priya Patel', avatar: 'PP', color: '#7c3aed', bio: 'MBA student | Aspiring entrepreneur' },
];

const INITIAL_POSTS = [
  {
    id: 1, userId: 2, text: "Just finished reading The Intelligent Investor for the third time 📚 Each read reveals something new. Highly recommend for anyone interested in value investing!",
    time: '2h ago', likes: [], comments: [
      { id: 1, userId: 3, text: 'Great book! Benjamin Graham was a genius.', time: '1h ago' },
      { id: 2, userId: 1, text: 'One of my all-time favorites too!', time: '45m ago' },
    ]
  },
  {
    id: 2, userId: 3, text: "Excited to announce I just passed the SIE exam! 🎉 One step closer to my finance career goals. Thanks to everyone who supported me!",
    time: '5h ago', likes: [], comments: [
      { id: 1, userId: 4, text: 'Congratulations!! 🎊', time: '4h ago' },
    ]
  },
  {
    id: 3, userId: 4, text: "Morning thought: The best investment you can ever make is in yourself. No market volatility can take that away. 💡",
    time: '1d ago', likes: [], comments: []
  },
];

const INITIAL_FRIENDS = [
  { id: 2, mutuals: 5 },
  { id: 3, mutuals: 3 },
  { id: 4, mutuals: 8 },
];

function Avatar({ user, size = 40 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: user.color, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.35, flexShrink: 0,
      letterSpacing: '0.5px'
    }}>
      {user.avatar}
    </div>
  );
}

function Navbar({ currentUser, onNav, activePage }) {
  const navItems = [
    { key: 'feed', icon: '🏠', label: 'Home' },
    { key: 'friends', icon: '👥', label: 'Friends' },
    { key: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-logo">VishBook</div>
        <div className="navbar-tabs">
          {navItems.map(item => (
            <button
              key={item.key}
              className={`nav-tab ${activePage === item.key ? 'active' : ''}`}
              onClick={() => onNav(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
        <div className="navbar-user">
          <Avatar user={currentUser} size={36} />
          <span className="navbar-name">{currentUser.name.split(' ')[0]}</span>
        </div>
      </div>
    </nav>
  );
}

function PostCard({ post, users, currentUser, onLike, onComment, onDelete }) {
  const author = users.find(u => u.id === post.userId);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const liked = post.likes.includes(currentUser.id);

  const handleComment = () => {
    if (!commentText.trim()) return;
    onComment(post.id, commentText.trim());
    setCommentText('');
    setShowComments(true);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <Avatar user={author} size={42} />
        <div className="post-meta">
          <span className="post-author">{author.name}</span>
          <span className="post-time">{post.time}</span>
        </div>
        {post.userId === currentUser.id && (
          <button className="post-delete" onClick={() => onDelete(post.id)} title="Delete post">✕</button>
        )}
      </div>

      <p className="post-text">{post.text}</p>

      <div className="post-stats">
        {post.likes.length > 0 && (
          <span className="stat-likes">👍 {post.likes.length}</span>
        )}
        {post.comments.length > 0 && (
          <button className="stat-comments" onClick={() => setShowComments(!showComments)}>
            {post.comments.length} comment{post.comments.length !== 1 ? 's' : ''}
          </button>
        )}
      </div>

      <div className="post-actions">
        <button className={`action-btn ${liked ? 'liked' : ''}`} onClick={() => onLike(post.id)}>
          {liked ? '👍' : '👍'} Like{liked ? 'd' : ''}
        </button>
        <button className="action-btn" onClick={() => setShowComments(!showComments)}>
          💬 Comment
        </button>
        <button className="action-btn">↗ Share</button>
      </div>

      {showComments && (
        <div className="comments-section">
          {post.comments.map(c => {
            const commenter = users.find(u => u.id === c.userId);
            return (
              <div className="comment" key={c.id}>
                <Avatar user={commenter} size={32} />
                <div className="comment-bubble">
                  <span className="comment-author">{commenter.name}</span>
                  <p className="comment-text">{c.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="comment-input-row">
        <Avatar user={currentUser} size={32} />
        <div className="comment-input-wrap">
          <input
            className="comment-input"
            placeholder="Write a comment..."
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleComment()}
          />
          {commentText && (
            <button className="comment-send" onClick={handleComment}>↵</button>
          )}
        </div>
      </div>
    </div>
  );
}

function CreatePost({ currentUser, onPost }) {
  const [text, setText] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handlePost = () => {
    if (!text.trim()) return;
    onPost(text.trim());
    setText('');
    setExpanded(false);
  };

  return (
    <div className="create-post">
      <div className="create-row">
        <Avatar user={currentUser} size={40} />
        <button className="create-trigger" onClick={() => setExpanded(true)}>
          What's on your mind, {currentUser.name.split(' ')[0]}?
        </button>
      </div>
      {expanded && (
        <div className="create-expanded">
          <textarea
            className="create-textarea"
            placeholder={`What's on your mind, ${currentUser.name.split(' ')[0]}?`}
            value={text}
            onChange={e => setText(e.target.value)}
            autoFocus
            rows={4}
          />
          <div className="create-footer">
            <button className="btn-cancel" onClick={() => { setExpanded(false); setText(''); }}>Cancel</button>
            <button className="btn-post" onClick={handlePost} disabled={!text.trim()}>Post</button>
          </div>
        </div>
      )}
    </div>
  );
}

function FeedPage({ posts, users, currentUser, onLike, onComment, onPost, onDelete }) {
  return (
    <div className="feed-layout">
      <aside className="sidebar-left">
        <div className="sidebar-card">
          <div className="profile-sidebar-row">
            <Avatar user={currentUser} size={44} />
            <div>
              <p className="sidebar-name">{currentUser.name}</p>
              <p className="sidebar-bio">{currentUser.bio}</p>
            </div>
          </div>
        </div>
        <div className="sidebar-card">
          <p className="sidebar-section-title">Explore</p>
          {['📰 News Feed', '📅 Events', '🎮 Gaming', '🛍 Marketplace', '📺 Watch'].map(item => (
            <div className="sidebar-item" key={item}>{item}</div>
          ))}
        </div>
      </aside>

      <main className="feed-main">
        <CreatePost currentUser={currentUser} onPost={onPost} />
        {posts.map(post => (
          <PostCard
            key={post.id}
            post={post}
            users={users}
            currentUser={currentUser}
            onLike={onLike}
            onComment={onComment}
            onDelete={onDelete}
          />
        ))}
      </main>

      <aside className="sidebar-right">
        <div className="sidebar-card">
          <p className="sidebar-section-title">People you may know</p>
          {users.filter(u => u.id !== currentUser.id).slice(0, 3).map(u => (
            <div className="friend-suggest" key={u.id}>
              <Avatar user={u} size={40} />
              <div className="friend-info">
                <p className="friend-name">{u.name}</p>
                <p className="friend-mutual">{Math.floor(Math.random() * 10) + 1} mutual friends</p>
              </div>
              <button className="btn-add-friend">+ Add</button>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function FriendsPage({ users, currentUser }) {
  const [added, setAdded] = useState([]);

  return (
    <div className="page-container">
      <h2 className="page-title">People you may know</h2>
      <div className="friends-grid">
        {users.filter(u => u.id !== currentUser.id).map(u => (
          <div className="friend-card" key={u.id}>
            <Avatar user={u} size={72} />
            <p className="friend-card-name">{u.name}</p>
            <p className="friend-card-bio">{u.bio}</p>
            <p className="friend-card-mutual">5 mutual friends</p>
            {added.includes(u.id) ? (
              <button className="btn-added" disabled>✓ Request Sent</button>
            ) : (
              <button className="btn-add-friend-card" onClick={() => setAdded([...added, u.id])}>
                + Add Friend
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfilePage({ currentUser, posts, users, onLike, onComment, onDelete }) {
  const myPosts = posts.filter(p => p.userId === currentUser.id);

  return (
    <div className="profile-page">
      <div className="profile-cover">
        <div className="profile-cover-gradient" />
      </div>
      <div className="profile-info-section">
        <div className="profile-avatar-wrap">
          <Avatar user={currentUser} size={120} />
        </div>
        <div className="profile-details">
          <h1 className="profile-name">{currentUser.name}</h1>
          <p className="profile-bio-text">{currentUser.bio}</p>
          <div className="profile-stats">
            <div className="profile-stat"><strong>{myPosts.length}</strong> posts</div>
            <div className="profile-stat"><strong>248</strong> friends</div>
            <div className="profile-stat"><strong>1.2k</strong> likes</div>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-about-card">
          <p className="sidebar-section-title">About</p>
          <div className="about-item">🎓 Kelley School of Business</div>
          <div className="about-item">📍 Greenwood, Indiana</div>
          <div className="about-item">💼 Finance Major · Class of 2028</div>
          <div className="about-item">📈 Value Investing · FIR · M&A Advisors</div>
        </div>
        <div className="profile-posts">
          <p className="sidebar-section-title" style={{ marginBottom: 12 }}>Posts</p>
          {myPosts.length === 0 ? (
            <div className="empty-state">No posts yet. Share something!</div>
          ) : (
            myPosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                users={users}
                currentUser={currentUser}
                onLike={onLike}
                onComment={onComment}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentUser] = useState(INITIAL_USERS[0]);
  const [users] = useState(INITIAL_USERS);
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [activePage, setActivePage] = useState('feed');

  const handlePost = (text) => {
    const newPost = {
      id: Date.now(), userId: currentUser.id, text,
      time: 'Just now', likes: [], comments: []
    };
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId) => {
    setPosts(posts.map(p => {
      if (p.id !== postId) return p;
      const liked = p.likes.includes(currentUser.id);
      return { ...p, likes: liked ? p.likes.filter(id => id !== currentUser.id) : [...p.likes, currentUser.id] };
    }));
  };

  const handleComment = (postId, text) => {
    setPosts(posts.map(p => {
      if (p.id !== postId) return p;
      return {
        ...p, comments: [...p.comments, {
          id: Date.now(), userId: currentUser.id, text, time: 'Just now'
        }]
      };
    }));
  };

  const handleDelete = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  return (
    <div className="app">
      <Navbar currentUser={currentUser} onNav={setActivePage} activePage={activePage} />
      <div className="app-body">
        {activePage === 'feed' && (
          <FeedPage
            posts={posts} users={users} currentUser={currentUser}
            onLike={handleLike} onComment={handleComment}
            onPost={handlePost} onDelete={handleDelete}
          />
        )}
        {activePage === 'friends' && <FriendsPage users={users} currentUser={currentUser} />}
        {activePage === 'profile' && (
          <ProfilePage
            currentUser={currentUser} posts={posts} users={users}
            onLike={handleLike} onComment={handleComment} onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
