import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach auth token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('afriflow-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle 401 responses globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Token expired or invalid — clear auth state
      localStorage.removeItem('afriflow-token')
      localStorage.removeItem('afriflow-user')
      // Optionally redirect to login
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api

// ============ AUTH ============
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (data: { name: string; email: string; password: string; country?: string }) =>
    api.post('/auth/register', data),

  getProfile: () =>
    api.get('/user/profile'),

  updateProfile: (data: { name?: string; country?: string; bio?: string }) =>
    api.patch('/user/profile', data),
}

// ============ COURSES ============
export const coursesApi = {
  list: (params?: { school?: string; level?: string; free?: string; search?: string; page?: number }) =>
    api.get('/courses', { params }),

  getBySlug: (slug: string) =>
    api.get('/courses', { params: { slug } }),
}

// ============ ENROLLMENTS ============
export const enrollmentsApi = {
  list: (completed?: boolean) =>
    api.get('/enrollments', { params: completed !== undefined ? { completed } : {} }),

  enroll: (courseSlug: string) =>
    api.post('/enrollments', { courseSlug }),

  unenroll: (courseSlug: string) =>
    api.delete('/enrollments', { data: { courseSlug } }),
}

// ============ PROGRESS ============
export const progressApi = {
  getCourseProgress: (courseSlug: string) =>
    api.get(`/progress/${courseSlug}`),

  completeLesson: (courseSlug: string, lessonId: string) =>
    api.post('/progress/complete-lesson', { courseSlug, lessonId }),

  updateStreak: () =>
    api.post('/progress/streak'),
}

// ============ CERTIFICATES ============
export const certificatesApi = {
  list: () =>
    api.get('/certificates'),

  generate: (courseSlug: string) =>
    api.post('/certificates', { courseSlug }),

  verify: (certificateId: string) =>
    api.get(`/certificates/verify/${certificateId}`),
}

// ============ REVIEWS ============
export const reviewsApi = {
  list: (courseSlug: string, page?: number) =>
    api.get('/reviews', { params: { courseSlug, page } }),

  create: (data: { courseSlug: string; rating: number; title: string; content: string }) =>
    api.post('/reviews', data),
}

// ============ BOOKMARKS ============
export const bookmarksApi = {
  list: () =>
    api.get('/bookmarks'),

  toggle: (courseSlug: string) =>
    api.post('/bookmarks', { courseSlug }),
}

// ============ NEWSLETTER ============
export const newsletterApi = {
  subscribe: (email: string, name?: string, source?: string) =>
    api.post('/newsletter', { email, name, source }),
}

// ============ DASHBOARD ============
export const dashboardApi = {
  getData: () =>
    api.get('/dashboard'),
}

// ============ COACH ============
export const coachApi = {
  chat: (messages: { role: string; content: string }[]) =>
    api.post('/coach', { messages }),
}

// ============ SEED ============
export const seedApi = {
  seed: () =>
    api.post('/seed'),
}

// ============ ACHIEVEMENTS ============
export const achievementsApi = {
  list: () =>
    api.get('/achievements'),

  check: () =>
    api.post('/achievements'),
}

// ============ NOTIFICATIONS ============
export const notificationsApi = {
  list: (limit?: number, unreadOnly?: boolean) =>
    api.get('/notifications', { params: { limit, unread: unreadOnly } }),

  markRead: (notificationIds?: string[]) =>
    api.patch('/notifications', notificationIds ? { notificationIds } : { markAll: true }),
}

// ============ LEADERBOARD ============
export const leaderboardApi = {
  get: (country?: string, limit?: number) =>
    api.get('/leaderboard', { params: { country, limit } }),
}

// ============ CHALLENGE ============
export const challengeApi = {
  getStatus: () => api.get('/challenge'),
  join: () => api.post('/challenge'),
  completeDay: (day: number, note?: string) =>
    api.post('/challenge/complete-day', { day, note }),
  leaderboard: (limit?: number) =>
    api.get('/challenge/leaderboard', { params: { limit } }),
}

// ============ EMPLOYERS ============
export const employersApi = {
  listJobs: (params?: { skill?: string; country?: string; type?: string; page?: number }) =>
    api.get('/employers/jobs', { params }),
  postJob: (data: Record<string, unknown>) =>
    api.post('/employers/jobs', data),
  bulkVerify: (ids: string[]) =>
    api.post('/employers/bulk-verify', { ids }),
}

// ============ SCHOOLS ============
export const schoolsApi = {
  list: (params?: { country?: string; type?: string; page?: number }) =>
    api.get('/schools', { params }),
  create: (data: Record<string, unknown>) =>
    api.post('/schools', data),
  get: (slug: string) =>
    api.get(`/schools/${slug}`),
  update: (slug: string, data: Record<string, unknown>, token: string) =>
    api.patch(`/schools/${slug}`, data, { headers: { Authorization: `Bearer ${token}` } }),
  join: (slug: string, inviteCode: string, token: string) =>
    api.post(`/schools/${slug}/invite`, { inviteCode }, { headers: { Authorization: `Bearer ${token}` } }),
  getInvite: (slug: string) =>
    api.get(`/schools/${slug}/invite`),
  progress: (slug: string, token: string) =>
    api.get(`/schools/${slug}/progress`, { headers: { Authorization: `Bearer ${token}` } }),
  assignCourse: (slug: string, data: Record<string, unknown>, token: string) =>
    api.post(`/schools/${slug}/assign`, data, { headers: { Authorization: `Bearer ${token}` } }),
  removeCourse: (slug: string, courseSlug: string, token: string) =>
    api.delete(`/schools/${slug}/assign`, { data: { courseSlug }, headers: { Authorization: `Bearer ${token}` } }),
}

// ============ AUTOMATE ============
export const automateApi = {
  submit: (data: Record<string, unknown>) =>
    api.post('/automate', data),
  list: (params?: { status?: string; category?: string; page?: number }) =>
    api.get('/automate', { params }),
  get: (ref: string, token: string) =>
    api.get(`/automate/${ref}`, { headers: { Authorization: `Bearer ${token}` } }),
  update: (ref: string, data: Record<string, unknown>, token: string) =>
    api.patch(`/automate/${ref}`, data, { headers: { Authorization: `Bearer ${token}` } }),
}

// ============ BENCHMARK ============
export const benchmarkApi = {
  getIndex: (params?: { region?: string; sort?: string }) =>
    api.get('/benchmark', { params }),
  requestReport: (data: { email: string; name?: string; company?: string }) =>
    api.post('/benchmark', data),
}

// ============ WHATSAPP ============
export const whatsappApi = {
  getStatus: (phone: string) =>
    api.get('/whatsapp/status', { params: { phone } }),
}

// ============ AFRIFLOW ID ============
export const afriflowIdApi = {
  /** GET the authenticated user's AfriFlow ID (creates one if none exists) */
  getMe: () =>
    api.get('/id/me'),

  /** PATCH update the authenticated user's AfriFlow ID */
  updateMe: (data: Record<string, unknown>) =>
    api.patch('/id/me', data),

  /** GET a public AfriFlow ID profile by publicId (e.g. AFR-1234-5678) */
  getPublic: (publicId: string) =>
    api.get(`/id/${publicId}`),

  /** POST add a project to the authenticated user's AfriFlow ID */
  addProject: (data: Record<string, unknown>) =>
    api.post('/id/projects', data),

  /** DELETE remove a project */
  deleteProject: (projectId: string) =>
    api.delete('/id/projects', { data: { projectId } }),

  /** POST request an employer endorsement (sends email to employer) */
  requestEndorsement: (data: {
    companyName: string
    contactName: string
    contactEmail: string
    skillsEndorsed: string[]
    jobTitle?: string
  }) =>
    api.post('/id/endorse', data),

  /** GET generate a shareable profile card image */
  getShareCard: () =>
    api.get('/id/share-card', { responseType: 'blob' }),
}

// ============ WORK (AfriFlow Work — AI Talent Marketplace) ============
export const workApi = {
  /** GET paginated job board with filters */
  listJobs: (params?: {
    search?: string; type?: string; remote?: boolean
    country?: string; skill?: string; cert?: string
    salaryMin?: number; page?: number
  }) => api.get('/work/jobs', { params }),

  /** GET single job detail + similar jobs */
  getJob: (id: string) =>
    api.get(`/work/jobs/${id}`),

  /** POST create a new job listing (auth required) */
  postJob: (data: Record<string, unknown>) =>
    api.post('/work/jobs', data),

  /** PATCH update a job listing (owner / admin only) */
  updateJob: (id: string, data: Record<string, unknown>) =>
    api.patch(`/work/jobs/${id}`, data),

  /** POST one-click apply with AfriFlow ID */
  apply: (id: string, coverNote?: string) =>
    api.post(`/work/jobs/${id}/apply`, { coverNote: coverNote ?? '' }),

  /** GET check if current user has applied */
  checkApplied: (id: string) =>
    api.get(`/work/jobs/${id}/apply`),

  /** GET search hireable AfriFlow ID holders */
  searchCandidates: (params?: {
    skill?: string; country?: string; cert?: string
    minScore?: number; workType?: string; page?: number
  }) => api.get('/work/employers/search', { params }),

  /** GET all applications for the current user */
  getMyApplications: () =>
    api.get('/work/applications'),
}

// ============ PAY (AfriFlow Pay — Africa-native wallet) ============
export const payApi = {
  /** GET wallet details + balances + linked accounts */
  getWallet: () =>
    api.get('/pay/wallet'),

  /** PATCH update default currency or add/remove linked account */
  updateWallet: (data: {
    defaultCurrency?: string
    addAccount?: { type: string; provider: string; identifier: string; label?: string }
    removeAccountId?: string
  }) => api.patch('/pay/wallet', data),

  /** GET paginated transaction history */
  getTransactions: (params?: { page?: number; limit?: number; type?: string; status?: string }) =>
    api.get('/pay/transactions', { params }),

  /** POST peer-to-peer transfer */
  send: (data: { toIdentifier: string; amount: number; currency?: string; note?: string }) =>
    api.post('/pay/send', data),

  /** GET generate a payment request link */
  getReceiveLink: (params?: { amount?: number; currency?: string; note?: string }) =>
    api.get('/pay/receive', { params }),

  /** GET list user's payout history */
  getPayouts: () =>
    api.get('/pay/payout'),

  /** POST request a withdrawal */
  requestPayout: (data: {
    amount: number; currency?: string
    method: string; provider: string; destination: string; destinationLabel?: string
  }) => api.post('/pay/payout', data),
}
