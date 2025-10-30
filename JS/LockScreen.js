        const rotateBtn = document.getElementById('rotateBtn');
        const wrapper = document.querySelector('.phone-rotate-wrapper');
        const box = wrapper.querySelector('.box');

        rotateBtn.addEventListener('click', () => {
            wrapper.classList.toggle('rotated');
            if (wrapper.classList.contains('rotated')) {
                rotateBtn.textContent = '↺ Rotate Back';
            } else {
                rotateBtn.textContent = '↻ Rotate Phone';
            }
        });

        // Time and weather functionality
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

        setInterval(updateTime, 60000);
        updateTime();

        // Weather
        const weatherURL = "https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.0060&current_weather=true&temperature_unit=fahrenheit";
        fetch(weatherURL)
            .then(res => res.json())
            .then(data => {
                const temp = data.current_weather.temperature;
                document.getElementById("weather-temp").textContent = `${temp}°F`;
            })
            .catch(err => {
                console.error("Weather fetch failed:", err);
                document.getElementById("weather-temp").textContent = "Error";
            });

        // Unlock logic
        const unlockBtn = document.getElementById('unlockBtn');
        const passcodeScreen = document.getElementById('passcodeScreen');
        const dots = document.querySelectorAll('.dots span');
        const keypad = document.querySelector('.keypad');
        const clearBtn = document.getElementById('clear');
        const cancelBtn = document.getElementById('cancel');
        const fingerprintBtn = document.getElementById('fingerprint');
        let enteredCode = '';
        const correctCode = '6767';

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
            } else if (!btn.classList.contains('fingerprint')) {
                enteredCode += btn.textContent;
            }

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

        fingerprintBtn.addEventListener('click', () => {
            fingerprintBtn.classList.add('checked');
            setTimeout(() => {
                window.location.href = '/Iphone-Mock/HTML/home.html';
            }, 500);
            setTimeout(() => {
                fingerprintBtn.classList.remove('checked');
            }, 2000);
        });
