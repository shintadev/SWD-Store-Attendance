const totalEmps = document.getElementById('totalEmps');
const totalUsers = document.getElementById('totalUsers');
const attendanceRate = document.getElementById('attendanceRate');
const ctx = document.getElementById('myChart');

async function preStart() {
  const response = await fetch('api/dashboard', {
    method: 'GET',
  });

  const result = await response.json();
  console.log('🚀 ~ preStart ~ result:', result);

  totalEmps.innerText = result.totalEmps ?? 0;
  totalUsers.innerText = result.totalUsers ?? 0;
  // attendanceRate.innerText = result.attendanceRate ?? 0;

  new Chart(ctx, {
    data: {
      labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      datasets: [
        {
          type: 'bar',
          label: 'Attendance rate',
          data: result.attendanceRate,
          maxBarThickness: 36,
          minBarLength: 2,
        },
        {
          type: 'line',
          label: 'Attendance rate',
          data: result.attendanceRate,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

preStart();
