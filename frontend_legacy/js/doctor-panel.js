document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Unauthorized! Please login.');
      window.location.href = 'login.html';
      return;
    }
  
    try {
      // Fetch reported side effects
      const response = await fetch('http://localhost:5000/api/doctor/side-effects', {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.message || 'Failed to load side effects');
        return;
      }
  
      const sideEffectsList = document.getElementById('sideEffectsList');
      sideEffectsList.innerHTML = '';
  
      data.reports.forEach(report => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${report.patient_name}</td>
          <td>${report.symptom}</td>
          <td>${new Date(report.date_reported).toLocaleDateString()}</td>
          <td>${report.pharmacist_reply || 'N/A'}</td>
          <td>
            <textarea id="reply-${report.id}" placeholder="Write your reply here">${report.doctor_reply || ''}</textarea>
          </td>
          <td>
            <button onclick="submitReply(${report.id})">Submit Reply</button>
          </td>
        `;
        sideEffectsList.appendChild(row);
      });
  
    } catch (error) {
      console.error('Error fetching side effects:', error);
      alert('Failed to fetch side effects');
    }
  });
  
  // Submit the doctor's reply to a side effect report
  async function submitReply(id) {
    const token = localStorage.getItem('token');
    const reply = document.getElementById(`reply-${id}`).value;
  
    if (!reply) {
      alert('Please provide a reply before submitting');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/doctor/side-effects/${id}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ doctor_reply: reply })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        alert(data.message || 'Failed to submit reply');
        return;
      }
  
      alert('Reply submitted successfully');
      window.location.reload(); // Refresh the page to see the changes
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Failed to submit reply');
    }
  }
  
  // Logout function
  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
  