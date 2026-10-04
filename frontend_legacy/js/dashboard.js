document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const stats = await res.json();
  
    const statsDiv = document.getElementById('stats');
    statsDiv.innerHTML = `
      <p>Total Users: ${stats.total_users}</p>
      <p>Total Medicines: ${stats.total_medicines}</p>
      <p>Verified Prescriptions: ${stats.verified_prescriptions}</p>
      <p>Unverified Prescriptions: ${stats.unverified_prescriptions}</p>
    `;
  
    const ctx = document.getElementById('prescriptionChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Verified', 'Unverified'],
        datasets: [{
          label: 'Prescriptions',
          data: [stats.verified_prescriptions, stats.unverified_prescriptions],
          backgroundColor: ['#4CAF50', '#FF5733']
        }]
      }
    });
  });
  

  const statsDiv = document.getElementById('stats');

function createStat(label, value) {
  const div = document.createElement('div');
  div.className = 'stat-card';
  div.innerHTML = `
    <div class="stat-label">${label}</div>
    <div class="stat-value">${value ?? 0}</div>
  `;
  statsDiv.appendChild(div);
}

// Example values
createStat('Total Users', totalUsers);
createStat('Total Medicines', totalMeds);
createStat('Verified Prescriptions', verified);
createStat('Unverified Prescriptions', unverified);
