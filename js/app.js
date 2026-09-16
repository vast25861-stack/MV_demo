// Boiler Safety Monitor - Standalone HTML/JS Version
// Scenario data is in js/scenarios.js

const STATE = {
    monitoringActive: false,
    monitoringPaused: false,
    startTime: null,
    scenarioStartTime: null,
    currentScenario: 'behavior',
    scenarioEvents: [],
    nextEventIndex: 0,
    events: [],
    alerts: [],
    stats: { fps: 0, gpu: 0, peopleCount: 0, incidentCount: 0, clipsCount: 0, zoneViolations: 0 },
    scenarioTimerId: null,
    statsTimerId: null
};

const $ = (sel) => document.getElementById(sel);

const video = $('video-player');
const videoPlaceholder = $('video-placeholder');
const els = {
    btnStart: $('btn-start'),
    btnPauseMon: $('btn-pause-monitoring'),
    btnStopMon: $('btn-stop-monitoring'),
    videoSeek: $('video-seek'),
    videoTime: $('video-time'),
    status: $('monitoring-status'),
    eventsEmpty: $('events-empty'),
    alertsEmpty: $('alerts-empty'),
    eventsBody: document.querySelector('#events-table tbody'),
    alertsBody: document.querySelector('#alerts-table tbody'),
    statFps: $('stat-fps'),
    statGpu: $('stat-gpu'),
    statPeople: $('stat-people'),
    statIncidents: $('stat-incidents'),
    statClips: $('stat-clips'),
    statZones: $('stat-zones'),
};

function formatTime(s) {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
}

function parseTime(t) {
    const p = t.split(':').map(Number);
    return p[0] * 60 + (p[1] || 0);
}

function loadScenario(name) {
    const sc = SCENARIOS[name];
    if (!sc) return false;

    STATE.currentScenario = name;
    STATE.scenarioEvents = sc.events.map(e => ({ ...e, timeSeconds: parseTime(e.time), fired: false }));
    STATE.nextEventIndex = 0;

    $('scenario-badge').textContent = name;
    $('modal-scenario-select').value = name;
    return true;
}

function addEvent(data) {
    STATE.events.unshift({ timestamp: new Date().toLocaleTimeString(), ...data });
    if (STATE.events.length > 10) STATE.events.pop();
    renderEventsTable();
}

function addAlert(data) {
    STATE.alerts.unshift({ timestamp: new Date().toLocaleTimeString(), ...data });
    if (STATE.alerts.length > 10) STATE.alerts.pop();
    renderAlertsTable();
}

function renderRow(e) {
    return `<tr class="new-row"><td>${e.timestamp}</td><td>${e.text}</td><td>${e.sub || '-'}</td><td><span class="badge severity-${e.sev} severity-badge">${e.sev}</span></td></tr>`;
}

function renderEventsTable() {
    els.eventsBody.innerHTML = STATE.events.map((e, i) =>
        `<tr${i === 0 ? ' class="new-row"' : ''}><td>${e.timestamp}</td><td>${e.message || e.type}</td><td>${e.zone || '-'}</td><td><span class="badge severity-${e.severity} severity-badge">${e.severity}</span></td></tr>`
    ).join('');
    els.eventsEmpty.style.display = STATE.events.length ? 'none' : 'block';
}

function renderAlertsTable() {
    els.alertsBody.innerHTML = STATE.alerts.map((a, i) =>
        `<tr${i === 0 ? ' class="new-row"' : ''}><td>${a.timestamp}</td><td>${a.type || a.message}</td><td>${a.details || a.zone || '-'}</td><td><span class="badge severity-${a.status || a.severity} severity-badge">${a.status || a.severity}</span></td></tr>`
    ).join('');
    els.alertsEmpty.style.display = STATE.alerts.length ? 'none' : 'block';
}

function updateStats() {
    const active = STATE.monitoringActive && !STATE.monitoringPaused;
    const s = STATE.stats;
    if (active) {
        s.fps = (Math.random() * 16 + 15) | 0;
        s.gpu = (Math.random() * 46 + 40) | 0;
        s.peopleCount = (Math.random() * 4 + 1) | 0;
        s.incidentCount = (Math.random() * 3) | 0;
        s.clipsCount = (Math.random() * 11) | 0;
        s.zoneViolations = (Math.random() * 3) | 0;
    } else {
        s.fps = s.gpu = s.peopleCount = s.incidentCount = s.clipsCount = s.zoneViolations = 0;
    }
    els.statFps.textContent = s.fps;
    els.statGpu.textContent = s.gpu + '%';
    els.statPeople.textContent = s.peopleCount;
    els.statIncidents.textContent = s.incidentCount;
    els.statClips.textContent = s.clipsCount;
    els.statZones.textContent = s.zoneViolations;
}

function updateVideoTime() {
    if (!video.duration) return;
    els.videoTime.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    els.videoSeek.max = video.duration;
    els.videoSeek.value = video.currentTime;
}

function checkScenarioEvents() {
    if (!STATE.monitoringActive || STATE.monitoringPaused) return;

    const elapsed = (Date.now() - STATE.scenarioStartTime) / 1000;
    const events = STATE.scenarioEvents;

    while (STATE.nextEventIndex < events.length) {
        const evt = events[STATE.nextEventIndex];
        if (evt.timeSeconds > elapsed + 0.5) break;

        const data = { message: evt.message, zone: evt.zone, severity: evt.severity };
        if (evt.type === 'event') addEvent(data);
        else addAlert({ type: evt.message, details: `Обнаружено в ${evt.zone}`, status: evt.severity });

        evt.fired = true;
        STATE.nextEventIndex++;
    }

    if (STATE.nextEventIndex >= events.length) stopMonitoring();
}

function startTimers() {
    if (STATE.statsTimerId) clearInterval(STATE.statsTimerId);
    if (STATE.scenarioTimerId) clearInterval(STATE.scenarioTimerId);
    STATE.statsTimerId = setInterval(updateStats, 1000);
    STATE.scenarioTimerId = setInterval(checkScenarioEvents, 500);
    updateStats();
}

function clearTimers() {
    clearInterval(STATE.statsTimerId);
    clearInterval(STATE.scenarioTimerId);
    STATE.statsTimerId = null;
    STATE.scenarioTimerId = null;
}

function setPlaceholderVisible(visible) {
    videoPlaceholder.style.setProperty('display', visible ? 'flex' : 'none', 'important');
}

function updateUIState() {
    const { monitoringActive: a, monitoringPaused: p } = STATE;

    els.btnStart.disabled = a;
    els.btnPauseMon.disabled = !a || p;
    els.btnStopMon.disabled = !a;

    const statusMap = [
        [false, 'bg-secondary', 'Остановлен'],
        [true, 'bg-warning text-dark', 'Приостановлен'],
        [true, 'bg-success', 'Активен']
    ];
    const [, cls, text] = statusMap[a ? (p ? 1 : 2) : 0];
    els.status.innerHTML = `Статус: <span class="badge ${cls}">${text}</span>`;
}

function startMonitoring() {
    if (STATE.monitoringActive) return;

    const scenario = SCENARIOS[STATE.currentScenario];
    const videoSrc = scenario ? scenario.video : 'video/1.webm';

    STATE.monitoringActive = true;
    STATE.monitoringPaused = false;
    STATE.nextEventIndex = 0;
    STATE.scenarioEvents.forEach(e => e.fired = false);
    STATE.startTime = Date.now();
    STATE.scenarioStartTime = Date.now();

    setPlaceholderVisible(false);
    els.videoSeek.style.display = 'block';
    updateUIState();

    video.src = videoSrc;
    video.load();

    video.oncanplay = function () {
        video.oncanplay = null;
        video.play().then(startTimers).catch(err => console.error('Play error:', err));
    };
}

function pauseMonitoring() {
    if (!STATE.monitoringActive || STATE.monitoringPaused) return;
    STATE.monitoringPaused = true;
    video.pause();
    updateUIState();
}

function resumeMonitoring() {
    if (!STATE.monitoringActive || !STATE.monitoringPaused) return;
    STATE.monitoringPaused = false;

    const nextEvt = STATE.scenarioEvents[STATE.nextEventIndex];
    if (nextEvt) {
        STATE.scenarioStartTime = Date.now() - nextEvt.timeSeconds * 1000;
    }

    video.play().catch(err => console.error('Resume failed:', err));
    updateUIState();
}

function stopMonitoring() {
    STATE.monitoringActive = false;
    STATE.monitoringPaused = false;

    video.pause();
    video.currentTime = 0;
    setPlaceholderVisible(true);
    els.videoSeek.style.display = 'none';

    clearTimers();
    updateUIState();
    updateStats();
    updateVideoTime();
}

function applyScenario(name) {
    const wasActive = STATE.monitoringActive;
    if (wasActive) stopMonitoring();

    loadScenario(name);

    const modal = bootstrap.Modal.getInstance($('scenarioModal'));
    if (modal) modal.hide();

    if (wasActive) setTimeout(startMonitoring, 300);
}

function initEventListeners() {
    els.btnStart.addEventListener('click', startMonitoring);
    els.btnPauseMon.addEventListener('click', pauseMonitoring);
    els.btnStopMon.addEventListener('click', stopMonitoring);

    $('btn-clear-events').addEventListener('click', () => { STATE.events = []; renderEventsTable(); });
    $('btn-clear-alerts').addEventListener('click', () => { STATE.alerts = []; renderAlertsTable(); });

    $('btn-apply-scenario').addEventListener('click', () => applyScenario($('modal-scenario-select').value));
    $('scenario-badge').addEventListener('click', () => new bootstrap.Modal($('scenarioModal')).show());

    video.addEventListener('timeupdate', () => {
        updateVideoTime();
        if (STATE.monitoringActive && !STATE.monitoringPaused &&
            video.duration && video.currentTime >= video.duration - 0.5) {
            stopMonitoring();
        }
    });

    video.addEventListener('ended', () => { if (STATE.monitoringActive) stopMonitoring(); });
    video.addEventListener('error', () => console.error('Video error:', video.error));
    els.videoSeek.addEventListener('input', e => { video.currentTime = e.target.value; });
}

function init() {
    loadScenario('ocr');
    initEventListeners();
    updateUIState();
    renderEventsTable();
    renderAlertsTable();
}

document.addEventListener('DOMContentLoaded', init);
