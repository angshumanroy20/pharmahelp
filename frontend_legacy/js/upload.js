document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Unauthorized. Please login.');
      return;
    }
  
    const formData = new FormData();
    formData.append('doctor', document.getElementById('doctor').value);
    formData.append('file', document.getElementById('prescription').files[0]);
  
    const response = await fetch('http://localhost:5000/api/prescriptions/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
  
    const result = await response.json();
    if (response.ok) {
      alert('Prescription uploaded successfully!');
      window.location.href = 'patient-dashboard.html';
    } else {
      alert(result.message || 'Upload failed');
    }
  });
  