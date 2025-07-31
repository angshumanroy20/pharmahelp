document.getElementById('sideEffectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const symptom = document.getElementById('symptom').value;
  
    const res = await fetch('http://localhost:5000/api/side-effects/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ symptom })
    });
  
    const data = await res.json();
    if (res.ok) {
      alert('Reported successfully');
      window.location.href = 'patient-dashboard.html';
    } else {
      alert(data.message || 'Error');
    }
  });
  