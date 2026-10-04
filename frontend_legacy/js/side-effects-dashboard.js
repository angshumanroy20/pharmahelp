document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const tableBody = document.querySelector('#reportsTable tbody');
  
    const res = await fetch('http://localhost:5000/api/side-effects/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    const data = await res.json();
    console.log("🔥 Raw response from backend:", data);

    // const { reports } = await res.json();
    const reports = data.reports;
  
    reports.forEach(report => {
      const row = document.createElement('tr');
  
      row.innerHTML = `
        <td>${report.id}</td>
        <td>${report.patient_name}</td>
        <td>${report.symptom}</td>
        <td>${new Date(report.date_reported).toLocaleDateString()}</td>
        <td>${report.pharmacist_reply || 'N/A'}</td>
        <td>${report.doctor_reply || 'N/A'}</td>
      `;
  
      tableBody.appendChild(row);
    });
  
    // Event delegation for dynamic forms
    tableBody.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const id = form.getAttribute('data-id');
      const reply = form.reply.value;
  
      const resp = await fetch(`http://localhost:5000/api/side-effects/reply/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ reply })
      });
  
      const data = await resp.json();
      alert(data.message);
      location.reload();
    });
  });


  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
  