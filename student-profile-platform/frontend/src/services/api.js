let API_BASE = import.meta.env.VITE_API_URL || '/api'

// Ensure API_BASE ends with /api if it's a full URL and missing it
if (API_BASE.startsWith('http') && !API_BASE.endsWith('/api')) {
  API_BASE = API_BASE.replace(/\/$/, '') + '/api'
}

if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE)
}


// In-memory cache for Leaderboard to prevent blocking loading screens
const leaderboardCache = {
  global: null,
  friends: {},
  activity: {},
};

export const clearLeaderboardCache = () => {
  leaderboardCache.global = null;
  leaderboardCache.friends = {};
  leaderboardCache.activity = {};
};


async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  }
  
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body)
  }

  const response = await fetch(url, config)
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: `Request to ${url} failed with status ${response.status}` }))
    throw new Error(error.detail || 'Request failed')
  }

  return response.json()
}

export const api = {
  // Profile
  getProfile: (userId) => request(`/profile/${userId}`),
  getPublicProfile: (username) => request(`/profile/username/${username}`),
  updateProfile: (userId, data) => {
    clearLeaderboardCache();
    return request(`/profile/${userId}`, { method: 'PUT', body: data });
  },

  // Skills
  getSkills: (userId) => request(`/skills/${userId}`),
  addSkill: (userId, data) => {
    clearLeaderboardCache();
    return request(`/skills/${userId}`, { method: 'POST', body: data });
  },
  updateSkill: (skillId, data) => {
    clearLeaderboardCache();
    return request(`/skills/${skillId}`, { method: 'PUT', body: data });
  },
  deleteSkill: (skillId) => {
    clearLeaderboardCache();
    return request(`/skills/${skillId}`, { method: 'DELETE' });
  },

  // Projects
  getProjects: (userId) => request(`/projects/${userId}`),
  addProject: (userId, data) => {
    clearLeaderboardCache();
    return request(`/projects/${userId}`, { method: 'POST', body: data });
  },
  updateProject: (projectId, data) => {
    clearLeaderboardCache();
    return request(`/projects/${projectId}`, { method: 'PUT', body: data });
  },
  deleteProject: (projectId) => {
    clearLeaderboardCache();
    return request(`/projects/${projectId}`, { method: 'DELETE' });
  },

  // Certificates
  getCertificates: (userId) => request(`/certificates/${userId}`),
  addCertificate: (userId, data) => {
    clearLeaderboardCache();
    return request(`/certificates/${userId}`, { method: 'POST', body: data });
  },
  deleteCertificate: (certId) => {
    clearLeaderboardCache();
    return request(`/certificates/${certId}`, { method: 'DELETE' });
  },

  // Leaderboard
  getLeaderboard: async (force = false) => {
    if (force) {
      leaderboardCache.global = null;
    }
    if (leaderboardCache.global) {
      return leaderboardCache.global;
    }
    const data = await request('/leaderboard');
    leaderboardCache.global = data;
    return data;
  },
  getFriendsLeaderboard: async (userId, force = false) => {
    if (force) {
      leaderboardCache.friends[userId] = null;
    }
    if (leaderboardCache.friends[userId]) {
      return leaderboardCache.friends[userId];
    }
    const data = await request(`/leaderboard/friends/${userId}`);
    leaderboardCache.friends[userId] = data;
    return data;
  },
  getFriendsActivity: async (userId, force = false) => {
    if (force) {
      leaderboardCache.activity[userId] = null;
    }
    if (leaderboardCache.activity[userId]) {
      return leaderboardCache.activity[userId];
    }
    const data = await request(`/leaderboard/friends/${userId}/activity`);
    leaderboardCache.activity[userId] = data;
    return data;
  },
  refreshLeaderboard: async () => {
    clearLeaderboardCache();
    return request('/leaderboard/refresh', { method: 'POST' });
  },

  // Views
  incrementViews: (username) => request(`/profile/${username}/views`, { method: 'POST' }),

  // Friends
  getFriends: (userId) => request(`/friends/${userId}`),
  getPendingRequests: (userId) => request(`/friends/${userId}/pending`),
  getSentRequests: (userId) => request(`/friends/${userId}/sent`),
  sendFriendRequest: (userId, addresseeId) => request(`/friends/${userId}/send`, { method: 'POST', body: { addressee_id: addresseeId } }),
  acceptFriendRequest: (friendshipId) => {
    clearLeaderboardCache();
    return request(`/friends/${friendshipId}/accept`, { method: 'POST' });
  },
  rejectFriendRequest: (friendshipId) => request(`/friends/${friendshipId}/reject`, { method: 'POST' }),
  removeFriend: (friendshipId) => {
    clearLeaderboardCache();
    return request(`/friends/${friendshipId}`, { method: 'DELETE' });
  },
  searchUsers: (userId, query) => request(`/friends/${userId}/search?q=${encodeURIComponent(query)}`),

  // Admin
  getAllStudents: () => request('/admin/students'),
  deleteStudent: (id) => {
    clearLeaderboardCache();
    return request(`/admin/students/${id}`, { method: 'DELETE' });
  },

  // Recruiters
  getRecruiters: () => request('/recruiters/'),
  getRecruiter: (username) => request(`/recruiters/${username}`),
  searchRecruiters: (query) => request(`/recruiters/search/${query}`),

  // Posts
  getAllPosts: () => request('/posts/'),
  createPost: (data) => request('/posts/', { method: 'POST', body: data }),
  updatePost: (postId, data) => request(`/posts/${postId}`, { method: 'PUT', body: data }),
  deletePost: (postId, userId) => request(`/posts/${postId}?user_id=${userId}`, { method: 'DELETE' }),
  likePost: (postId, userId) => request(`/posts/${postId}/like`, { method: 'POST', body: { user_id: userId } }),
  getComments: (postId) => request(`/posts/${postId}/comments`),
  addComment: (postId, data) => request(`/posts/${postId}/comments`, { method: 'POST', body: data }),



  // Messages
  getMessages: (userId, otherId) => request(`/messages/${userId}/${otherId}`),
  sendMessage: (data) => request('/messages/', { method: 'POST', body: data }),
  getConversations: (userId) => request(`/messages/conversations/${userId}`),
  updatePresence: (userId) => request(`/messages/presence/${userId}`, { method: 'POST' }),
  deleteMessage: (messageId) => request(`/messages/${messageId}`, { method: 'DELETE' }),
  reactToMessage: (messageId, emoji, userId) => request(`/messages/${messageId}/react`, { method: 'PATCH', body: { emoji, user_id: userId } }),
  checkUnreadMessages: (userId, since) => {
    let url = `/messages/unread/${userId}`;
    if (since) url += `?since=${encodeURIComponent(since)}`;
    return request(url);
  },
}

