/* ===========================
      PASSWORD GATE (OPTION A)
=========================== */
function checkPassword() {
  const correctPassword = "troop382";
  const input = document.getElementById("access-password")?.value;

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
  if (footer) footer.textContent = `© ${year} Troop 382 | Hicksville, NY`;

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
  if (contrastBtn) contrastBtn.onclick = () => document.body.classList.toggle("high-contrast");

  const dyslexiaBtn = document.getElementById("dyslexia-toggle");
  if (dyslexiaBtn) dyslexiaBtn.onclick = () => document.body.classList.toggle("dyslexia");

  /* ===========================
      PERSONAL CHECKLIST
  =========================== */
  const personalItems = [
    "Patrol Box", "First Aid Kit", "Stove + Fuel", "Tents", "Water Jug",
    "Lantern", "Fire Gloves", "Dutch Oven", "Cooler", "Trash Bags"
  ];

  const checklistBox = document.getElementById("personal-checklist");
  if (checklistBox) {
    checklistBox.innerHTML = personalItems.map(item =>
      `<label><input type="checkbox"> ${item}</label>`
    ).join("");
  }

  /* ===========================
      DUTY ROSTER
  =========================== */
  const rosterTable = document.getElementById("duty-roster");
  if (rosterTable) {
    rosterTable.innerHTML = `
      <tr><th>Scout</th><th>Task</th></tr>
      <tr><td>Aiden</td><td>Cooking</td></tr>
      <tr><td>Praval</td><td>Kitchen Patrol</td></tr>
      <tr><td>Lucas</td><td>Firewood</td></tr>
    `;
  }

  /* ===========================
      WEATHER FORECAST
  =========================== */
  async function loadForecast(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,windspeed_10m_max,weathercode&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();

    const box = document.getElementById("forecast");
    if (!box) return;

    const icons = {0:"☀️",1:"🌤️",2:"⛅",3:"☁️",45:"🌫️",48:"🌫️",51:"🌦️",61:"🌧️",71:"❄️",80:"🌧️",95:"⛈️"};

    box.innerHTML = data.daily.time.slice(0, 7).map((day, i) => `
      <div class="forecast-day">
        <h4>${new Date(day).toLocaleDateString("en-US", { weekday: "short" })}</h4>
        <div style="font-size: 32px">${icons[data.daily.weathercode[i]] || "❓"}</div>
        <p>High: ${data.daily.temperature_2m_max[i]}°F</p>
        <p>Low: ${data.daily.temperature_2m_min[i]}°F</p>
        <p>Wind: ${data.daily.windspeed_10m_max[i]} mph</p>
      </div>
    `).join("");
  }

  loadForecast(40.9363, -72.8415);

  /* ===========================
      FAQ BOT
  =========================== */
  const faqInput = document.getElementById("faq-input");
  const faqResponse = document.getElementById("faq-response");

  if (faqInput && faqResponse) {
    faqInput.addEventListener("keypress", e => {
      if (e.key === "Enter") {
        const q = faqInput.value.toLowerCase();
        let answer = "Sorry, I don't know that yet.";
        if (q.includes("uniform")) answer = "You’ll need a shirt, neckerchief, belt, and handbook.";
        if (q.includes("meeting")) answer = "We meet every Thursday at 7pm at the community center.";
        if (q.includes("camping")) answer = "Our first campout is usually in September or October.";
        faqResponse.textContent = answer;
      }
    });
  }

  /* ===========================
      RANK ADVANCEMENT TRACKER
  =========================== */

  const rankRequirements = {
    scout: [
      "Learn and repeat the Scout Oath",
      "Learn and repeat the Scout Law",
      "Explain patrol method",
      "Show how to tie a square knot"
    ],
    tenderfoot: [
      "Camp overnight",
      "Demonstrate basic first aid",
      "Explain the buddy system",
      "Show how to whip and fuse a rope"
    ],
    secondclass: [
      "Cook a meal on a campout",
      "Use a map and compass",
      "Demonstrate fire building",
      "Show swimming skills"
    ],
    firstclass: [
      "Plan a patrol activity",
      "Navigate using a map and compass",
      "Identify 10 plants/animals",
      "Demonstrate lashings"
    ],
    star: [
      "Earn 6 merit badges",
      "Serve in a leadership position",
      "Complete service hours"
    ],
    life: [
      "Earn 5 more merit badges",
      "Serve in leadership",
      "Plan and participate in service"
    ],
    eagle: [
      "Earn 21 merit badges",
      "Serve actively in troop",
      "Plan and complete Eagle Project"
    ]
  };

  function getRankKey(name, rank, index) {
    return `${name}-${rank}-${index}`;
  }

  function loadRank(rank) {
    const name = document.getElementById("scoutName")?.value.trim();
    const container = document.getElementById("requirements");

    if (!container) return;

    if (!name) {
      container.innerHTML = "<p style='color:red;'>Enter your name to load progress.</p>";
      return;
    }

    container.innerHTML = "";

    const reqs = rankRequirements[rank];
    let completedCount = 0;

    reqs.forEach((req, index) => {
      const key = getRankKey(name, rank, index);
      const saved = localStorage.getItem(key) === "true";

      if (saved) completedCount++;

      const div = document.createElement("div");
      div.className = "req" + (saved ? " completed" : "");
      div.innerHTML = `
        <input type="checkbox" id="${key}" ${saved ? "checked" : ""}>
        <label for="${key}">${req}</label>
      `;

      div.querySelector("input").addEventListener("change", (e) => {
        localStorage.setItem(key, e.target.checked);
        loadRank(rank);
      });

      container.appendChild(div);
    });

    updateRankProgress(completedCount, reqs.length);
    applyRankFilter();
  }

  function updateRankProgress(done, total) {
    const bar = document.getElementById("progressBar");
    if (bar) bar.style.width = (done / total) * 100 + "%";
  }

  function applyRankFilter() {
    const showIncomplete = document.getElementById("showIncomplete")?.checked;
    document.querySelectorAll(".req").forEach(req => {
      req.style.display =
        showIncomplete && req.classList.contains("completed")
          ? "none"
          : "flex";
    });
  }

  const rankSelect = document.getElementById("rankSelect");
  const nameInput = document.getElementById("scoutName");
  const filterBox = document.getElementById("showIncomplete");

  if (rankSelect) rankSelect.addEventListener("change", () => loadRank(rankSelect.value));
  if (nameInput) nameInput.addEventListener("input", () => loadRank(rankSelect.value));
  if (filterBox) filterBox.addEventListener("change", applyRankFilter);

  loadRank("scout");

}); // END DOMContentLoaded
