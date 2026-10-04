const API_BASE = import.meta.env.VITE_API_BASE_URL 
  ? `${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '')}/api` 
  : '/api';

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data.message || data.error || 'An unexpected error occurred';
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Auth
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  demoLogin: async (role) => {
    const res = await fetch(`${API_BASE}/auth/demo-login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ role }),
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getAllUsers: async () => {
    const res = await fetch(`${API_BASE}/auth/users`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateUserRole: async (userId, role) => {
    const res = await fetch(`${API_BASE}/auth/users/${userId}/role`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ role }),
    });
    return handleResponse(res);
  },

  // Medicines
  getMedicines: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const url = query ? `${API_BASE}/medicines?${query}` : `${API_BASE}/medicines`;
    const res = await fetch(url, { headers: getHeaders() });
    return handleResponse(res);
  },

  searchMedicines: async (q) => {
    const res = await fetch(`${API_BASE}/medicines/search?q=${encodeURIComponent(q)}`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  saveMedicine: async (medData) => {
    const res = await fetch(`${API_BASE}/medicines/save`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(medData),
    });
    return handleResponse(res);
  },

  deleteMedicine: async (id) => {
    const res = await fetch(`${API_BASE}/medicines/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Prescriptions
  uploadPrescription: async (formData) => {
    const res = await fetch(`${API_BASE}/prescriptions/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData,
    });
    return handleResponse(res);
  },

  getMyPrescriptions: async () => {
    const res = await fetch(`${API_BASE}/prescriptions/my`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getAllPrescriptions: async () => {
    const res = await fetch(`${API_BASE}/prescriptions/all`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  verifyPrescription: async (id) => {
    const res = await fetch(`${API_BASE}/prescriptions/verify/${id}`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Orders
  createOrder: async (orderData) => {
    const res = await fetch(`${API_BASE}/orders/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });
    return handleResponse(res);
  },

  getMyOrders: async () => {
    const res = await fetch(`${API_BASE}/orders/my`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getAllOrders: async () => {
    const res = await fetch(`${API_BASE}/orders/all`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateOrderStatus: async (id, status) => {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  // Appointments
  getDoctors: async () => {
    const res = await fetch(`${API_BASE}/appointments/doctors`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  bookAppointment: async (bookingData) => {
    const res = await fetch(`${API_BASE}/appointments/book`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(bookingData),
    });
    return handleResponse(res);
  },

  getPatientAppointments: async () => {
    const res = await fetch(`${API_BASE}/appointments/patient`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  getDoctorAppointments: async () => {
    const res = await fetch(`${API_BASE}/appointments/doctor`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  updateAppointment: async (id, data) => {
    const res = await fetch(`${API_BASE}/appointments/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Medication Reminders
  getReminders: async () => {
    const res = await fetch(`${API_BASE}/reminders`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  addReminder: async (reminderData) => {
    const res = await fetch(`${API_BASE}/reminders/add`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reminderData),
    });
    return handleResponse(res);
  },

  toggleReminderTaken: async (id) => {
    const res = await fetch(`${API_BASE}/reminders/${id}/toggle`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  deleteReminder: async (id) => {
    const res = await fetch(`${API_BASE}/reminders/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Side Effects
  reportSideEffect: async (symptom) => {
    const res = await fetch(`${API_BASE}/side-effects/report`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ symptom }),
    });
    return handleResponse(res);
  },

  getAllSideEffects: async () => {
    const res = await fetch(`${API_BASE}/side-effects/all`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  replyToSideEffect: async (id, reply) => {
    const res = await fetch(`${API_BASE}/side-effects/reply/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ reply }),
    });
    return handleResponse(res);
  },

  verifyAndReplyDoctor: async (id, reply) => {
    const res = await fetch(`${API_BASE}/doctor/side-effects/${id}/verify`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ doctor_reply: reply }),
    });
    return handleResponse(res);
  },

  // Clinical AI
  checkDrugInteractions: async (medicines) => {
    const res = await fetch(`${API_BASE}/clinical-ai/check-interactions`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ medicines }),
    });
    return handleResponse(res);
  },

  scanPrescriptionAI: async (data = {}) => {
    const res = await fetch(`${API_BASE}/clinical-ai/scan-prescription`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE}/dashboard/stats`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Notifications
  getNotifications: async () => {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  markNotificationRead: async (id = 'all') => {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },
};
