// Boiler Safety Monitor - Standalone HTML/JS Version
// Scenario data is in js/scenarios.js

const STATE = {
    monitoringActive: false,
    currentScenario: 'behavior',
    scenarioEvents: [],
    nextEventIndex: 0,
    lastTime: 0,
    events: [],
    alerts: [],
    scenarioTimerId: null
};

const $ = (sel) => document.getElementById(sel);

const video = $('video-player');
const videoPlaceholder = $('video-placeholder');
const els = {
    videoSeek: $('video-seek'),
    videoTime: $('video-time'),
    videoStatus: $('video-status-badge'),
    categoryTitle: $('category-title'),
    categoryTools: $('category-tools'),
    autoLoadVideo: $('auto-load-video'),
    eventsEmpty: $('events-empty'),
    alertsEmpty: $('alerts-empty'),
    eventsBody: document.querySelector('#events-table tbody'),
    alertsBody: document.querySelector('#alerts-table tbody'),
};

function formatTime(s) {
    if (!s || isNaN(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
}

function parseTime(t) {
    const p = t.split(':').map(Number);
    return p[0] * 60 + (p[1] || 0);
}

function escapeAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Bootstrap tooltips are opt-in: every element rendered later has to be picked up manually.
// container: 'body' keeps hints from being clipped by the scrollable right panel.
function initTooltips(scope) {
    (scope || document).querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        bootstrap.Tooltip.getOrCreateInstance(el, { container: 'body', html: true });
    });
}

// innerHTML-based re-render drops the trigger nodes, so their popper must be released first.
function disposeTooltips(scope) {
    (scope || document).querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        const tip = bootstrap.Tooltip.getInstance(el);
        if (tip) tip.dispose();
    });
}

// SCENARIOS keys are lowercase, while badge/select values may come in any case.
function findScenario(name) {
    if (!name) return null;
    if (SCENARIOS[name]) return SCENARIOS[name];
    const key = Object.keys(SCENARIOS).find(k => k.toLowerCase() === String(name).toLowerCase());
    return key ? SCENARIOS[key] : null;
}

// Messages are keyed to clip time (not wall-clock) so they repeat together with the
// `loop`ed video. Some clips are shorter than their schedule (diameter: 14s clip, 17s
// of events), so timings are compressed to keep the whole cycle inside one round.
function buildSchedule(events, duration) {
    const schedule = events.map(e => ({ ...e, timeSeconds: parseTime(e.time) }));
    const last = schedule.length ? schedule[schedule.length - 1].timeSeconds : 0;
    if (duration && last > duration - 0.3) {
        const k = Math.max(0.1, (duration - 0.3) / last);
        schedule.forEach(e => e.timeSeconds *= k);
    }
    return schedule;
}

// Linear cursor over the schedule; used after a manual seek.
function syncEventIndex() {
    const t = video.currentTime;
    const idx = STATE.scenarioEvents.findIndex(e => e.timeSeconds > t + 0.25);
    STATE.nextEventIndex = idx === -1 ? STATE.scenarioEvents.length : idx;
}

// Loop wrap: the clip starts from zero, so the whole message cycle restarts as well.
function restartCycle() {
    STATE.nextEventIndex = 0;
    STATE.lastTime = 0;
}

function loadScenario(name) {
    const sc = findScenario(name);
    if (!sc) return false;

    STATE.currentScenario = sc.name;
    STATE.scenarioEvents = buildSchedule(sc.events, 0);
    STATE.nextEventIndex = 0;

    $('scenario-badge').textContent = sc.name.toUpperCase();
    $('scenario-title').textContent = sc.name.toUpperCase();
    $('modal-scenario-select').value = sc.name;
    renderCategoryTools(sc);
    return true;
}

// Category block shows the rest of the tools of the selected scenario's category.
// Hints for the category and each tool come from TOOL/CATEGORY_DESCRIPTIONS (see scenarios.js).
function renderCategoryTools(sc) {
    const tools = (sc.categoryTools || []).filter(t => t !== sc.currentTool);
    const categoryHint = (typeof CATEGORY_DESCRIPTIONS !== 'undefined' && CATEGORY_DESCRIPTIONS[sc.category]) || '';

    disposeTooltips(els.categoryTools);
    disposeTooltips(els.categoryTitle.parentElement);

    els.categoryTitle.innerHTML = (sc.categoryName
        ? `Возможности категории «${sc.categoryName}»`
        : 'Другие задачи этой категории')
        + (categoryHint
            ? ` <i class="bi bi-info-circle text-muted" data-bs-toggle="tooltip" title="${escapeAttr(categoryHint)}"></i>`
            : '');

    els.categoryTools.innerHTML = tools.length
        ? tools.map(t => {
            const hint = (typeof TOOL_DESCRIPTIONS !== 'undefined' && TOOL_DESCRIPTIONS[t]) || '';
            return `<li${hint ? ` data-bs-toggle="tooltip" title="${escapeAttr(hint)}"` : ''}><i class="bi bi-check-circle-fill"></i><span>${t}</span></li>`;
        }).join('')
        : '<li class="category-tools-empty">Другие задачи категории не заданы</li>';

    initTooltips(els.categoryTools);
    initTooltips(els.categoryTitle.parentElement);
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

function renderEventsTable() {
    els.eventsBody.innerHTML = STATE.events.map((e, i) =>
        `<tr${i === 0 ? ' class="new-row"' : ''}><td>${e.timestamp}</td><td>${e.message || e.type}</td><td>${e.zone || '-'}</td><td><span class="badge severity-${e.severity} severity-badge">${e.severity}</span></td></tr>`
    ).join('');
    els.eventsEmpty.classList.toggle('empty-hidden', STATE.events.length > 0);
}

function renderAlertsTable() {
    els.alertsBody.innerHTML = STATE.alerts.map((a, i) =>
        `<tr${i === 0 ? ' class="new-row"' : ''}><td>${a.timestamp}</td><td>${a.type || a.message}</td><td>${a.details || a.zone || '-'}</td><td><span class="badge severity-${a.status || a.severity} severity-badge">${a.status || a.severity}</span></td></tr>`
    ).join('');
    els.alertsEmpty.classList.toggle('empty-hidden', STATE.alerts.length > 0);
}

function updateVideoTime() {
    if (!video.duration) return;
    els.videoTime.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    els.videoSeek.max = video.duration;
    els.videoSeek.value = video.currentTime;
}

function checkScenarioEvents() {
    if (!STATE.monitoringActive) return;

    const t = video.currentTime;
    const events = STATE.scenarioEvents;

    while (STATE.nextEventIndex < events.length) {
        const evt = events[STATE.nextEventIndex];
        if (evt.timeSeconds > t + 0.25) break;

        const data = { message: evt.message, zone: evt.zone, severity: evt.severity };
        if (evt.type === 'event') addEvent(data);
        else addAlert({ type: evt.message, details: `Обнаружено в ${evt.zone}`, status: evt.severity });

        STATE.nextEventIndex++;
    }
}

function startTimers() {
    if (STATE.scenarioTimerId) clearInterval(STATE.scenarioTimerId);
    STATE.scenarioTimerId = setInterval(checkScenarioEvents, 250);
}

function clearTimers() {
    clearInterval(STATE.scenarioTimerId);
    STATE.scenarioTimerId = null;
}

function setPlaceholderVisible(visible) {
    videoPlaceholder.style.setProperty('display', visible ? 'flex' : 'none', 'important');
}

function setVideoStatus(text, cls = 'bg-primary') {
    els.videoStatus.className = `badge px-3 py-2 ${cls}`;
    els.videoStatus.innerHTML = `<span class="animate-pulse me-1">●</span> ${text}`;
}

function startMonitoring() {
    if (STATE.monitoringActive) return;

    const scenario = findScenario(STATE.currentScenario);
    if (!scenario) return;

    STATE.monitoringActive = true;
    STATE.lastTime = 0;

    setPlaceholderVisible(false);
    els.videoSeek.style.display = 'block';
    setVideoStatus('Загрузка', 'bg-primary');

    // muted keeps play() allowed by browser autoplay policies.
    video.muted = true;
    video.src = scenario.video;
    video.load();

    video.addEventListener('loadedmetadata', function onMetadata() {
        video.removeEventListener('loadedmetadata', onMetadata);
        // Duration is known only here — rebuild the schedule to fit exactly one round.
        STATE.scenarioEvents = buildSchedule(scenario.events, video.duration);
        STATE.nextEventIndex = 0;
        STATE.lastTime = 0;

        video.play().then(() => startTimers()).catch(err => {
            console.error('Play error:', err);
            setVideoStatus('Ожидание', 'bg-primary');
        });
    });
}

function stopMonitoring() {
    STATE.monitoringActive = false;

    video.pause();
    video.currentTime = 0;
    setPlaceholderVisible(true);
    els.videoSeek.style.display = 'none';

    clearTimers();
    setVideoStatus('Ожидание', 'bg-primary');
    updateVideoTime();
}

function applyScenario(name) {
    const modal = bootstrap.Modal.getInstance($('scenarioModal'));
    if (modal) modal.hide();

    stopMonitoring();
    loadScenario(name);
    if (els.autoLoadVideo.checked) setTimeout(startMonitoring, 300);
}

function initEventListeners() {
    $('btn-clear-events').addEventListener('click', () => { STATE.events = []; renderEventsTable(); });
    $('btn-clear-alerts').addEventListener('click', () => { STATE.alerts = []; renderAlertsTable(); });

    $('btn-apply-scenario').addEventListener('click', () => applyScenario($('modal-scenario-select').value));
    $('scenario-badge').addEventListener('click', () => new bootstrap.Modal($('scenarioModal')).show());

    video.addEventListener('timeupdate', () => {
        // `loop` rewinds currentTime to 0 — the message cycle restarts along with it.
        if (STATE.monitoringActive && video.currentTime + 1 < STATE.lastTime) restartCycle();
        STATE.lastTime = video.currentTime;
        updateVideoTime();
    });

    video.addEventListener('play', () => setVideoStatus('Воспроизведение', 'bg-success'));
    video.addEventListener('pause', () => {
        if (STATE.monitoringActive) setVideoStatus('Пауза', 'bg-warning text-dark');
    });
    // Fallback for browsers that ignore `loop`: replay the clip and the schedule.
    video.addEventListener('ended', () => {
        if (!STATE.monitoringActive) return;
        video.currentTime = 0;
        restartCycle();
        video.play().catch(err => console.error('Replay error:', err));
    });
    video.addEventListener('error', () => console.error('Video error:', video.error));
    els.videoSeek.addEventListener('input', e => {
        video.currentTime = e.target.value;
        syncEventIndex();
    });
}

function init() {
    loadScenario('OCR');
    initEventListeners();
    renderEventsTable();
    renderAlertsTable();
    initTooltips();

    // No manual controls anymore: the demo clip starts on its own.
    if (els.autoLoadVideo.checked) startMonitoring();
}

document.addEventListener('DOMContentLoaded', init);
