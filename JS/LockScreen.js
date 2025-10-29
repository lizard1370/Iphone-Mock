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
  window.location.href = "/Iphone-Mock/HTML/home.html";
}

setInterval(updateTime, 60000);
updateTime();
const unlockBtn = document.getElementById('unlockBtn');
const passcodeScreen = document.getElementById('passcodeScreen');
const dots = document.querySelectorAll('.dots span');
const keypad = document.querySelector('.keypad');
const clearBtn = document.getElementById('clear');
const cancelBtn = document.getElementById('cancel');

let enteredCode = '';
const correctCode = '6767'; // change this if you want

unlockBtn.addEventListener('click', () => {
  passcodeScreen.classList.add('active');
});

keypad.addEventListener('click', (e) => {
  const btn = e.target;
  if (!btn.matches('button')) return;

  if (btn.id === 'clear') {
    enteredCode = enteredCode.slice(0, -1);
  } else if (btn.id === 'cancel') {
    enteredCode = '';
    passcodeScreen.classList.remove('active');
  } else {
    enteredCode += btn.textContent;
  }

  // update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('filled', i < enteredCode.length);
  });

  if (enteredCode.length === 4) {
    if (enteredCode === correctCode) {
      window.location.href = '/Iphone-Mock/HTML/home.html';
    } else {
      dots.forEach(dot => dot.classList.remove('filled'));
      enteredCode = '';
      alert('Incorrect code');
    }
  }
});

document.getElementById("fingerprint").addEventListener("click", function () {
  const icon = this.querySelector("ion-icon");
  icon.style.color = "#cf27f5ff"; // green flash
  icon.style.transform = "scale(1.2)";
  setTimeout(() => {
    window.location.href = "../HTML/home.html"; // navigate
  }, 500); // half a second delay
});


