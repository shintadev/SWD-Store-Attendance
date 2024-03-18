async function preStart() {
  const totalEmps = document.getElementById('totalEmps');
  const totalUsers = document.getElementById('totalUsers');
  const attendanceRate = document.getElementById('attendanceRate');

  const response = await fetch('api/admin', {
    method: 'GET',
  });

  const result = await response.json();

  totalEmps.innerText = result.totalEmps ?? 0;
  totalUsers.innerText = result.totalUsers ?? 0;
  attendanceRate.innerText = result.attendanceRate ?? 0;
}

preStart();
