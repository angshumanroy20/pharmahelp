document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/side-effects/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
  
    const data = await res.json();
    const table = document.getElementById('reportTable');
    data.reports.forEach(r => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${r.patient_name}</td>
        <td>${r.symptom}</td>
        <td>${new Date(r.date_reported).toLocaleDateString()}</td>
        <td>${r.pharmacist_reply || ''}</td>
        <td>
          <input type="text" id="reply-${r.id}" placeholder="Reply here">
          <button onclick="reply(${r.id})">Send</button>
        </td>
      `;
      table.appendChild(row);
    });
  });
  
  async function reply(id) {
    const replyText = document.getElementById(`reply-${id}`).value;
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:5000/api/side-effects/reply/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ reply: replyText })
    });
  
    const data = await res.json();
    if (res.ok) {
      alert('Reply sent!');
      location.reload();
    } else {
      alert(data.message || 'Error replying');
    }
  }
  