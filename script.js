function updateTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  document.getElementById("time").textContent = `${hours}:${minutes}`;

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saterday"];
  const months = [
    "January", "Febuary", "March", "April", "May", "June",
    "July", "Augest", "September", "October", "November", "December"
  ];
  const day = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  document.getElementById("date").textContent = `${day} ${date} · 1% · 0.0 mm`;
}

setInterval(updateTime, 1000);
updateTime();


        function myFunction() {
            }
        let popup = document.querySelector('.island_popup');
        popup.onclick = function(){
            popup.classList.toggle('active')
        }