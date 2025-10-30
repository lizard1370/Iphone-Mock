import os

# Folder where HTML files will be created
base_dir = r"C:\Users\kevin\Documents\GitHub\Iphone-Mock\HTML\weather"  # <-- change this if needed

# Cities with their coordinates (latitude, longitude)
cities = [
    ("New York, NY", "weather-ny.html", "New York", 40.7128, -74.0060),
    ("Los Angeles, CA", "weather-la.html", "Los Angeles", 34.0522, -118.2437),
    ("Chicago, IL", "weather-co.html", "Chicago", 41.8781, -87.6298),
    ("Houston, TX", "weather-houston.html", "Houston", 29.7604, -95.3698),
    ("Phoenix, AZ", "weather-phoenix.html", "Phoenix", 33.4484, -112.0740),
    ("Philadelphia, PA", "weather-philly.html", "Philadelphia", 39.9526, -75.1652),
    ("San Antonio, TX", "weather-sana.html", "San Antonio", 29.4241, -98.4936),
    ("San Diego, CA", "weather-sand.html", "San Diego", 32.7157, -117.1611),
    ("Dallas, TX", "weather-dallas.html", "Dallas", 32.7767, -96.7970),
    ("San Jose, CA", "weather-sandj.html", "San Jose", 37.3382, -121.8863),
    ("Austin, TX", "weather-austin.html", "Austin", 30.2672, -97.7431),
    ("Jacksonville, FL", "weather-jackson.html", "Jacksonville", 30.3322, -81.6557)
]

# Template HTML
template = """<!DOCTYPE html>
<html lang='en'>
<head>
  <meta charset='UTF-8'>
  <title>weather | {city_short}</title>
  <link rel='stylesheet' href='/Iphone-Mock/CSS/weathers.css'>
</head>
<body>
<button id="rotateBtn">↻ Rotate Phone</button>
    <div class="phone-rotate-wrapper">
  <div class='box'>
    <div class='inner-home'>
      <div class='island_popup'>
        <div class='content'>
          <div class='detais'>
            <p>Kevin is calling</p>
          </div>
          <div class='action'>
            <ion-icon name='call' class='red'></ion-icon>
            <ion-icon name='call' class='green'></ion-icon>
          </div>
        </div>
      </div>

      <h1>{city_full}</h1>
      <h1 id='temperature'>Loading temperature...</h1>

      <div class='island_bottom' onclick='openApp("/Iphone-Mock/HTML/home.html")'>
        <a href='/Iphone-Mock/HTML/home.html' id='editBtn' class='content2'></a>
      </div>
    </div>
  </div>
</div>
  <script>
    // Fetch live weather using Open-Meteo (no API key)
    async function getWeather() {{
      const lat = {lat};
      const lon = {lon};
      try {{
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${{lat}}&longitude=${{lon}}&current=temperature_2m`);
        const data = await res.json();
        const tempC = data.current.temperature_2m;
        const tempF = Math.round(tempC * 9/5 + 32);
        document.getElementById('temperature').textContent = `${{tempF}}°F`;
      }} catch (e) {{
        document.getElementById('temperature').textContent = 'Error loading';
      }}
    }}
    getWeather();
  </script>

  <script type='module' src='https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js'></script>
  <script nomodule src='https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js'></script>
  <script src='/Iphone-Mock/JS/weathers.js'></script>
</body>
</html>
"""

# Make sure the directory exists
os.makedirs(base_dir, exist_ok=True)

# Create each file
for full_city, filename, city_short, lat, lon in cities:
    file_path = os.path.join(base_dir, filename)
    with open(file_path, "w", encoding="utf-8") as f:
        html = template.format(city_short=city_short, city_full=full_city, lat=lat, lon=lon)
        f.write(html)
    print(f"✅ Created {filename}")

print("\n🌦️ All weather HTML files created with live temperature fetching!")
