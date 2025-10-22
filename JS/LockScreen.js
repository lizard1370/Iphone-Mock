function updateTime() {
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  hours = hours % 12 || 12;

  const timeEl = document.getElementById("time");
  if (timeEl) {
    timeEl.textContent = `${hours}:${minutes}`;
  }

  const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"
  ];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];

  const dateEl = document.getElementById("date");
  if (dateEl) {
    dateEl.textContent = `${day}, ${date} ${month}`;
    dateEl.style.fontSize = "1.1em";
  }
}

function openApp(url) {
  window.location.href = "/HTML/home.html";
}

setInterval(updateTime, 60000);
updateTime();
