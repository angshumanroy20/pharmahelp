document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Unauthorized! Please login first.');
      window.location.href = 'login.html';
      return;
    }
  
    const response = await fetch('http://localhost:5000/api/prescriptions', {
      headers: { Authorization: `Bearer ${token}` }
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      alert(data.message || 'Failed to load prescriptions');
      return;
    }
  
    const { user, prescriptions } = data;
  
    document.getElementById('userInfo').innerHTML = `
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
    `;
  
    const tableBody = document.querySelector('#prescriptionTable tbody');
    prescriptions.forEach(p => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${p.id}</td>
        <td>${p.doctor}</td>
        <td>${new Date(p.date).toLocaleDateString()}</td>
        <td><a href="${p.file_url}" target="_blank">View</a></td>
      `;
      tableBody.appendChild(row);
    });
  });
  
  function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
  }
  