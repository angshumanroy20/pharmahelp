document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Unauthorized! Please login.');
      window.location.href = 'login.html';
      return;
    }
  
    const response = await fetch('http://localhost:5000/api/prescriptions/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      alert(data.message || 'Failed to load prescriptions');
      return;
    }
  
    const tableBody = document.getElementById('prescriptionList');
    data.prescriptions.forEach(p => {
       console.log("Raw date value:", p.date);
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${p.id}</td>
        <td>${p.patient_name}</td>
        <td>${p.doctor}</td>
        <td>${new Date(p.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
        }</td>
        <td><a href="http://localhost:5000${p.file_url}" target="_blank">View</a></td>

      `;
      tableBody.appendChild(row);
    });
  });
  