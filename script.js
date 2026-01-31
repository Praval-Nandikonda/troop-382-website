/* ===========================
      PASSWORD GATE (OPTION A)
=========================== */
function checkPassword() {
  const correctPassword = "troop382"; // <-- CHANGE THIS
  const input = document.getElementById("access-password").value;

  if (input === correctPassword) {
    document.getElementById("lock-screen").style.display = "none";
    document.getElementById("protected-content").style.display = "block";
  } else {
    document.getElementById("error").style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", () => {

  /* ===========================
      FOOTER YEAR
  =========================== */
  const year = new Date().getFullYear();
  const footer = document.querySelector("footer p");
  if (footer) {
    footer.textContent = `© ${year} Troop 382 | Hicksville, NY`;
  }

  /* ===========================
      SMOOTH SCROLL
  =========================== */
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  /* ===========================
      HIGHLIGHT CURRENT PAGE
  =========================== */
  const currentPage = window.location.pathname.split("/").pop();
  document.querySelectorAll("nav a").forEach(link => {
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active");
    }
  });

  /* ===========================
      GLOBAL ACCESSIBILITY
  =========================== */
  const contrastBtn = document.getElementById("contrast-toggle");
  if (contrastBtn) {
    contrastBtn.onclick = () => {
      document.body.classList.toggle("high-contrast");
    };
  }

  const dyslexiaBtn = document.getElementById("dyslexia-toggle");
  if (dyslexiaBtn) {
    dyslexiaBtn.onclick = () => {
      document.body.classList.toggle("dyslexia");
    };
  }

  /* ===========================
      PERSONAL CHECKLIST
  =========================== */
  const personalItems = [
    "Patrol Box",
    "First Aid Kit",
    "Stove + Fuel",
    "Tents",
    "Water Jug",
    "Lantern",
    "Fire Gloves",
    "Dutch Oven",
    "Cooler",
    "Trash Bags"
  ];

  function renderPersonalChecklist() {
    const box = document.getElementById("personal-checklist");
    if (!box) return;

    box.innerHTML = personalItems.slice(0, 10).map(item => `
      <label><input type="checkbox"> ${item}</label>
    `).join("");
  }

  renderPersonalChecklist();

  /* ===========================
      DUTY ROSTER
  =========================== */
  function buildRoster(patrol, tasks) {
    const table = document.getElementById("duty-roster");
    if (!table) return;

    table.innerHTML = `
      <tr><th>Scout</th><th>Task</th></tr>
      ${patrol.map((name, i) => `
        <tr><td>${name}</td><td>${tasks[i % tasks.length]}</td></tr>
      `).join("")}
    `;
  }

  buildRoster(
    ["Aiden", "Praval", "Lucas"],
    ["Cooking", "Kitchen Patrol", "Firewood"]
  );

  /* ===========================
      5-DAY FORECAST
  =========================== */
  async function loadForecast(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max,weathercode&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();

    const box = document.getElementById("forecast");
    if (!box) return;

    const days = data.daily.time;
    const max = data.daily.temperature_2m_max;
    const min = data.daily.temperature_2m_min;
    const wind = data.daily.windspeed_10m_max;
    const codes = data.daily.weathercode;

    const icons = {
      0: "☀️",
      1: "🌤️",
      2: "⛅",
      3: "☁️",
      45: "🌫️",
      48: "🌫️",
      51: "🌦️",
      61: "🌧️",
      71: "❄️",
      80: "🌧️",
      95: "⛈️"
    };

    box.innerHTML = days.slice(0, 7).map((day, i) => `
      <div class="forecast-day">
        <h4>${new Date(day).toLocaleDateString("en-US", { weekday: "short" })}</h4>
        <div style="font-size: 32px">${icons[codes[i]] || "❓"}</div>
        <p>High: ${max[i]}°F</p>
        <p>Low: ${min[i]}°F</p>
        <p>Wind: ${wind[i]} mph</p>
      </div>
    `).join("");
  }

  loadForecast(40.9363, -72.8415);

  /* ===========================
      COMMUNITY IMPACT TRACKER
  =========================== */
  const impactData = {
    hours: 326,
    co2: 1482,
    food: 870,
    people: 214
  };

  function renderImpactStats() {
    for (const key in impactData) {
      const el = document.querySelector(`#${key} span`);
      if (el) el.textContent = impactData[key].toLocaleString();
    }
  }

  function renderImpactMap() {
    const mapDiv = document.getElementById("impact-map");
    if (!mapDiv) return;

    const map = L.map('impact-map').setView([40.9363, -72.8415], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const locations = [
      { name: "Schiff Scout Reservation", lat: 40.9363, lon: -72.8415 },
      { name: "Bethpage Park Cleanup", lat: 40.742, lon: -73.474 },
      { name: "Food Drive HQ", lat: 40.768, lon: -73.525 }
    ];

    locations.forEach(loc => {
      L.marker([loc.lat, loc.lon]).addTo(map).bindPopup(loc.name);
    });
  }

  renderImpactStats();
  renderImpactMap();

  /* ===========================
      FAQ CHATBOT
  =========================== */
  const faqInput = document.getElementById("faq-input");
  const faqResponse = document.getElementById("faq-response");
  if (faqInput && faqResponse) {
    faqInput.addEventListener("keypress", e => {
      if (e.key === "Enter") {
        const q = faqInput.value.toLowerCase();
        let answer = "Sorry, I don't know that yet.";
        if (q.includes("uniform")) answer = "You’ll need a shirt, neckerchief, belt, and handbook.";
        else if (q.includes("first meeting")) answer = "We meet every Thursday at 7pm at the community center.";
        else if (q.includes("camping")) answer = "Our first campout is usually in September or October. Gear list is on the trip planner.";
        faqResponse.textContent = answer;
      }
    });
  }

});