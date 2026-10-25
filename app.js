(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const STORAGE_KEY = "smart-pipa-demo-history-v1";
  const MAX_POINTS = 18;
  const state = {
    leaking: false,
    valveClosed: false,
    soundEnabled: false,
    alarmActive: false,
    leakStartedAt: null,
    leakFlow: 2.0,
    wastedLiters: 0,
    lastTick: Date.now(),
    history: [],
    labels: [],
    flowSeries: [],
    pressureSeries: []
  };

  const fmt = (n, digits = 1) => Number(n).toFixed(digits);
  const timeString = (date = new Date()) => date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateTimeString = (date = new Date()) => date.toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" });

  function safeHistoryLoad() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved.slice(0, 100) : [];
    } catch {
      return [];
    }
  }

  function saveHistory() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.history.slice(0, 100))); }
    catch { toast("Riwayat tidak dapat disimpan di browser ini.", "error"); }
  }

  function addEvent(name, detail, kind = "info") {
    state.history.unshift({ time: dateTimeString(), name, detail, kind });
    state.history = state.history.slice(0, 100);
    saveHistory();
    renderHistory();
  }

  function renderHistory() {
    const tbody = $("eventRows");
    tbody.replaceChildren();
    $("emptyEvents").hidden = state.history.length > 0;
    state.history.forEach((event) => {
      const tr = document.createElement("tr");
      const values = [event.time, event.name, event.detail];
      values.forEach((value, index) => {
        const td = document.createElement("td");
        td.textContent = value;
        if (index === 1) td.className = "event-name";
        if (index === 2) td.className = "event-detail";
        tr.appendChild(td);
      });
      const statusCell = document.createElement("td");
      const badge = document.createElement("span");
      badge.className = `event-badge ${event.kind || "info"}`;
      badge.textContent = event.kind === "alert" ? "PERINGATAN" : event.kind === "success" ? "BERHASIL" : "INFO";
      statusCell.appendChild(badge);
      tr.appendChild(statusCell);
      tbody.appendChild(tr);
    });
  }

  function toast(message, type = "") {
    const region = $("toastRegion");
    const item = document.createElement("div");
    item.className = `toast ${type}`;
    item.textContent = message;
    region.appendChild(item);
    window.setTimeout(() => item.remove(), 3400);
  }

  function beep() {
    if (!state.soundEnabled) {
      toast("Alarm visual aktif. Tekan tombol ♫ di bagian atas untuk mengaktifkan suara.", "success");
      return;
    }
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) { toast("Browser tidak mendukung suara alarm.", "error"); return; }
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, context.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.38);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.4);
      oscillator.onended = () => context.close();
    } catch { toast("Suara tidak dapat diputar. Alarm visual tetap berfungsi.", "error"); }
  }

  function currentFlow() {
    if (state.valveClosed) return 0;
    return state.leaking ? 24 + state.leakFlow : 24;
  }

  function currentPressure() {
    if (state.valveClosed) return 0;
    return state.leaking ? 1.7 : 2.8;
  }

  function renderState() {
    const flow = currentFlow();
    const pressure = currentPressure();
    $("flowValue").textContent = fmt(flow);
    $("pressureValue").textContent = fmt(pressure);
    $("wasteValue").textContent = fmt(state.wastedLiters);
    $("chartFlowNow").textContent = fmt(flow);
    $("chartPressureNow").textContent = fmt(pressure);
    $("valveValue").textContent = state.valveClosed ? "TERTUTUP" : "TERBUKA";
    $("valveIndicator").classList.toggle("closed", state.valveClosed);
    $("valveFoot").textContent = state.valveClosed ? "Aliran dihentikan (simulasi)" : "Aliran diizinkan";
    $("wasteFoot").textContent = state.wastedLiters > 0 ? "Estimasi selama simulasi" : "Belum ada kehilangan";
    $("pipeValve").textContent = state.valveClosed ? "Tertutup" : "Terbuka";
    $("pipeCondition").textContent = state.leaking ? "Kebocoran" : state.valveClosed ? "Aliran berhenti" : "Stabil";
    $("leakBtn").innerHTML = state.leaking ? "<span>✓</span> Hentikan kebocoran simulasi" : "<span>⚠</span> Simulasikan kebocoran";
    $("valveBtn").innerHTML = state.valveClosed ? "▣ <span>Buka katup manual</span>" : "▣ <span>Tutup katup manual</span>";
    $("statusBanner").classList.toggle("alert", state.leaking);
    $("statusSymbol").textContent = state.leaking ? "!" : "✓";
    $("statusTitle").textContent = state.leaking ? (state.valveClosed ? "Kebocoran terdeteksi · katup tertutup" : "Kebocoran terdeteksi pada jalur pipa") : (state.valveClosed ? "Katup tertutup secara manual" : "Semua sistem beroperasi normal");
    $("statusDescription").textContent = state.leaking ? (state.valveClosed ? "Aliran dihentikan dalam simulasi. Estimasi kehilangan air tidak bertambah." : "Alarm aktif. Sistem simulasi akan menutup katup secara otomatis.") : (state.valveClosed ? "Katup ditutup melalui kontrol manual." : "Tidak ada anomali yang terdeteksi pada simulasi.");
    $("statusLabel").textContent = state.leaking ? "KEBOCORAN" : state.valveClosed ? "KATUP TERTUTUP" : "NORMAL";
    $("lastUpdate").textContent = `Pembaruan ${timeString()}`;
    $("scenarioTitle").textContent = state.leaking ? "Skenario kebocoran" : state.valveClosed ? "Katup tertutup" : "Kondisi normal";
    $("scenarioText").textContent = state.leaking ? (state.valveClosed ? "Kebocoran masih disimulasikan, tetapi aliran telah dihentikan oleh katup." : "Anomali terdeteksi. Alarm aktif dan katup otomatis menutup.") : state.valveClosed ? "Katup tertutup. Tidak ada aliran dalam simulasi." : "Aliran stabil. Belum ada kebocoran pada sistem simulasi.";
    $("leakMarker").setAttribute("aria-label", state.leaking ? "Titik kebocoran aktif" : "Tidak ada kebocoran");
    document.querySelector(".pipe-stage").classList.toggle("leaking", state.leaking);
    $("statusBanner").setAttribute("aria-label", $("statusTitle").textContent);
    $("valveBtn").setAttribute("aria-pressed", String(state.valveClosed));
  }

  let flowChart = null;
  let pressureChart = null;
  function chartOptions(color, fill) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 250 },
      interaction: { intersect: false, mode: "index" },
      plugins: {
        legend: { display: false },
        tooltip: { backgroundColor: "#102535", padding: 10, displayColors: false, callbacks: { label: (ctx) => `${ctx.parsed.y.toFixed(1)} ${ctx.dataset.unit}` } }
      },
      scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { color: "#91a0aa", font: { size: 9 }, maxTicksLimit: 6 } },
        y: { beginAtZero: true, grid: { color: "#edf1f3", drawTicks: false }, border: { display: false }, ticks: { color: "#91a0aa", font: { size: 9 }, padding: 8 } }
      },
      elements: { point: { radius: 0, hoverRadius: 4 }, line: { tension: .36, borderWidth: 2 } }
    };
  }

  function initCharts() {
    if (typeof Chart === "undefined") {
      document.querySelectorAll(".chart-wrap").forEach((wrap) => {
        wrap.innerHTML = '<p style="color:#7b8d99;font-size:12px">Grafik tidak dapat dimuat. Periksa koneksi internet lalu muat ulang halaman.</p>';
      });
      return;
    }
    const labels = state.labels;
    flowChart = new Chart($("flowChart"), {
      type: "line",
      data: { labels, datasets: [{ label: "Debit", data: state.flowSeries, unit: "L/menit", borderColor: "#159d95", backgroundColor: "rgba(21,157,149,.12)", fill: true }] },
      options: chartOptions("#159d95", true)
    });
    pressureChart = new Chart($("pressureChart"), {
      type: "line",
      data: { labels, datasets: [{ label: "Tekanan", data: state.pressureSeries, unit: "bar", borderColor: "#5986c8", backgroundColor: "rgba(89,134,200,.10)", fill: true }] },
      options: chartOptions("#5986c8", true)
    });
  }

  function updateCharts() {
    const label = timeString().slice(0, 5);
    state.labels.push(label);
    state.flowSeries.push(currentFlow());
    state.pressureSeries.push(currentPressure());
    while (state.labels.length > MAX_POINTS) {
      state.labels.shift(); state.flowSeries.shift(); state.pressureSeries.shift();
    }
    [flowChart, pressureChart].forEach((chart) => {
      if (!chart) return;
      chart.data.labels = state.labels;
      chart.data.datasets[0].data = chart === flowChart ? state.flowSeries : state.pressureSeries;
      chart.update("none");
    });
  }

  function startLeak() {
    if (!state.leaking) {
      state.leaking = true;
      state.leakStartedAt = Date.now();
      state.alarmActive = true;
      addEvent("Kebocoran terdeteksi", "Debit bocor simulasi 2,0 L/menit.", "alert");
      addEvent("Alarm diaktifkan", "Peringatan visual pada dashboard aktif.", "alert");
      if (!state.valveClosed) {
        state.valveClosed = true;
        addEvent("Katup otomatis ditutup", "Aliran dihentikan oleh logika simulasi.", "success");
      }
      renderState();
      beep();
      toast("Kebocoran simulasi terdeteksi. Katup otomatis ditutup.", "error");
    } else {
      state.leaking = false;
      state.leakStartedAt = null;
      state.alarmActive = false;
      addEvent("Simulasi kebocoran dihentikan", "Skenario kebocoran dinonaktifkan.", "success");
      renderState();
      toast("Simulasi kebocoran dihentikan.", "success");
    }
    updateCharts();
  }

  function tick() {
    const now = Date.now();
    const elapsedMinutes = Math.max(0, now - state.lastTick) / 60000;
    if (state.leaking && !state.valveClosed) state.wastedLiters += state.leakFlow * elapsedMinutes;
    state.lastTick = now;
    renderState();
    updateCharts();
  }

  function resetSimulation() {
    state.leaking = false;
    state.valveClosed = false;
    state.alarmActive = false;
    state.leakStartedAt = null;
    state.wastedLiters = 0;
    state.lastTick = Date.now();
    state.labels.length = 0;
    state.flowSeries.length = 0;
    state.pressureSeries.length = 0;
    addEvent("Simulasi direset", "Semua metrik dikembalikan ke kondisi awal.", "info");
    renderState();
    updateCharts();
    toast("Simulasi kembali ke kondisi normal.", "success");
  }

  $("leakBtn").addEventListener("click", startLeak);
  $("valveBtn").addEventListener("click", () => {
    state.valveClosed = !state.valveClosed;
    addEvent(state.valveClosed ? "Katup ditutup manual" : "Katup dibuka manual", state.valveClosed ? "Aliran simulasi dihentikan oleh operator." : "Operator membuka kembali aliran simulasi.", state.valveClosed ? "info" : "success");
    renderState();
    updateCharts();
    toast(state.valveClosed ? "Katup simulasi ditutup." : "Katup simulasi dibuka.", "success");
  });
  $("alarmBtn").addEventListener("click", () => {
    state.alarmActive = true;
    addEvent("Uji alarm", "Alarm visual diuji oleh operator.", "info");
    beep();
    toast("Uji alarm selesai.", "success");
  });
  $("soundToggle").addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    $("soundToggle").style.background = state.soundEnabled ? "#e2f6f1" : "#fff";
    $("soundToggle").style.color = state.soundEnabled ? "#167c71" : "#5d7180";
    $("soundToggle").setAttribute("aria-pressed", String(state.soundEnabled));
    toast(state.soundEnabled ? "Suara alarm diaktifkan." : "Suara alarm dimatikan.", "success");
    if (state.soundEnabled) beep();
  });
  $("resetBtn").addEventListener("click", resetSimulation);
  $("clearHistoryBtn").addEventListener("click", () => {
    state.history = [];
    saveHistory();
    renderHistory();
    toast("Riwayat kejadian dihapus.", "success");
  });
  $("dismissNotice").addEventListener("click", () => $("dismissNotice").closest(".notice").remove());
  $("menuToggle").addEventListener("click", () => $("sidebar").classList.toggle("open"));
  document.querySelectorAll(".nav-link").forEach((link) => link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
    $("sidebar").classList.remove("open");
  }));

  function updateClock() { $("clock").textContent = timeString(); }
  state.history = safeHistoryLoad();
  renderHistory();
  updateClock();
  initCharts();
  renderState();
  updateCharts();
  addEvent("Sistem simulasi dimulai", "Dashboard dibuka dalam mode data simulasi.", "success");
  window.setInterval(updateClock, 1000);
  window.setInterval(tick, 3000);
})();