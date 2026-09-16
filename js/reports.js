// Reports page logic - mock data generation and rendering

const REPORT_DATA = {
    ocr: {
        name: 'OCR — Распознавание текста',
        sessions: 24,
        totalEvents: 156,
        alerts: 8,
        avgDuration: 42,
        lastRun: '2025-09-16 14:32',
        events: [
            { time: '2025-09-16 14:30:12', message: 'Начало движения конвейера', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 14:30:15', message: 'Обнаружен объект', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 14:30:17', message: 'Обнаружен текст', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 14:30:18', message: 'Распознавание текста: 09/2025', zone: 'Камера 1', severity: 'success' },
            { time: '2025-09-16 14:30:22', message: 'Объект покидает зону проверки', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 14:30:29', message: 'Следующий цикл', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 14:25:10', message: 'Начало движения конвейера', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 14:25:13', message: 'Обнаружен объект', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 14:25:15', message: 'Обнаружен текст', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 14:25:16', message: 'Распознавание текста: 08/2025', zone: 'Камера 1', severity: 'success' },
            { time: '2025-09-16 14:25:20', message: 'Объект покидает зону проверки', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 14:25:27', message: 'Следующий цикл', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 14:20:05', message: 'Начало движения конвейера', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 14:20:08', message: 'Обнаружен объект', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 14:20:10', message: 'Обнаружен текст', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 14:20:11', message: 'Распознавание текста: 07/2025', zone: 'Камера 1', severity: 'success' },
            { time: '2025-09-16 14:20:15', message: 'Объект покидает зону проверки', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 14:20:22', message: 'Следующий цикл', zone: 'Камера 1', severity: 'info' },
        ],
        stats: {
            recognized: 142,
            failed: 14,
            avgConfidence: 94.2,
            uniqueTexts: 28,
            cyclesPerHour: 45,
        },
        confidenceHistory: [92, 95, 94, 96, 93, 95, 94, 96, 94, 95],
        statusCounts: { success: 142, info: 10, warning: 2, danger: 2 }
    },
    diameter: {
        name: 'Diameter — Измерение диаметра',
        sessions: 18,
        totalEvents: 98,
        alerts: 3,
        avgDuration: 35,
        lastRun: '2025-09-16 13:45',
        events: [
            { time: '2025-09-16 13:43:20', message: 'Начало движения конвейера', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 13:43:23', message: 'Обнаружен объект', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 13:43:24', message: 'Измерение диаметра', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 13:43:25', message: 'Результат: 85.12 px (10 mm)', zone: 'Камера 1', severity: 'success' },
            { time: '2025-09-16 13:43:26', message: 'Результат: 186.34 px (22 mm)', zone: 'Камера 1', severity: 'success' },
            { time: '2025-09-16 13:38:15', message: 'Начало движения конвейера', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 13:38:18', message: 'Обнаружен объект', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 13:38:19', message: 'Измерение диаметра', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 13:38:20', message: 'Результат: 84.95 px (10 mm)', zone: 'Камера 1', severity: 'success' },
            { time: '2025-09-16 13:38:21', message: 'Результат: 186.51 px (22 mm)', zone: 'Камера 1', severity: 'success' },
            { time: '2025-09-16 13:33:10', message: 'Начало движения конвейера', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 13:33:13', message: 'Обнаружен объект', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 13:33:14', message: 'Измерение диаметра', zone: 'Камера 1', severity: 'info' },
            { time: '2025-09-16 13:33:15', message: 'Результат: 85.33 px (10 mm)', zone: 'Камера 1', severity: 'success' },
            { time: '2025-09-16 13:33:16', message: 'Результат: 185.89 px (22 mm)', zone: 'Камера 1', severity: 'success' },
        ],
        stats: {
            measured: 89,
            outOfTolerance: 2,
            avgDiameter1: 10.02,
            avgDiameter2: 21.98,
            precision: 0.15,
        },
        diameter1History: [10.01, 10.03, 9.99, 10.02, 10.04, 10.00, 10.02, 10.01, 10.03, 10.02],
        diameter2History: [22.01, 21.99, 21.98, 22.02, 21.97, 22.00, 21.99, 22.01, 21.98, 21.99],
        deviationHistory: [0.01, -0.01, 0.02, -0.02, 0.03, 0.00, 0.01, -0.01, 0.02, -0.01]
    }
};

function renderSummaryCards() {
    const container = document.getElementById('summary-cards');
    const scenarios = Object.entries(REPORT_DATA);
    container.innerHTML = scenarios.map(([key, data]) => `
        <div class="col-xl-3 col-md-6">
            <div class="card stat-card h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge bg-secondary badge-scenario">${key.toUpperCase()}</span>
                        <small class="text-muted">${data.sessions} сессий</small>
                    </div>
                    <div class="stat-value fs-2 fw-bold">${data.totalEvents}</div>
                    <div class="stat-label text-muted">Событий за период</div>
                    <hr class="my-2">
                    <div class="row text-center g-0">
                        <div class="col-4"><div class="fw-bold">${data.alerts}</div><small class="text-muted">Уведомлений</small></div>
                        <div class="col-4 border-start"><div class="fw-bold">${data.avgDuration} мин</div><small class="text-muted">Ср. длительность</small></div>
                        <div class="col-4 border-start"><div class="fw-bold">${formatDate(data.lastRun)}</div><small class="text-muted">Последний запуск</small></div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderEventsTable(scenarioKey) {
    const data = REPORT_DATA[scenarioKey];
    const tbody = document.querySelector(`#${scenarioKey}-events-table tbody`);
    tbody.innerHTML = data.events.map(e => `
        <tr>
            <td>${e.time}</td>
            <td>${e.message}</td>
            <td>${e.zone}</td>
            <td><span class="badge severity-${e.severity} severity-badge">${e.severity}</span></td>
        </tr>
    `).join('');
}

function renderStats(scenarioKey) {
    const data = REPORT_DATA[scenarioKey];
    const container = document.getElementById(`${scenarioKey}-stats`);
    const stats = data.stats;
    if (scenarioKey === 'ocr') {
        container.innerHTML = `
            <div class="row g-2 text-center">
                <div class="col-6"><div class="fw-bold fs-4 text-success">${stats.recognized}</div><small class="text-muted">Распознано</small></div>
                <div class="col-6"><div class="fw-bold fs-4 text-danger">${stats.failed}</div><small class="text-muted">Ошибок</small></div>
                <div class="col-6"><div class="fw-bold fs-4 text-primary">${stats.avgConfidence}%</div><small class="text-muted">Ср. уверенность</small></div>
                <div class="col-6"><div class="fw-bold fs-4 text-info">${stats.uniqueTexts}</div><small class="text-muted">Уникальных текстов</small></div>
                <div class="col-6"><div class="fw-bold fs-4 text-warning">${stats.cyclesPerHour}</div><small class="text-muted">Циклов/час</small></div>
            </div>
        `;
    } else {
        container.innerHTML = `
            <div class="row g-2 text-center">
                <div class="col-6"><div class="fw-bold fs-4 text-success">${stats.measured}</div><small class="text-muted">Измерено объектов</small></div>
                <div class="col-6"><div class="fw-bold fs-4 text-danger">${stats.outOfTolerance}</div><small class="text-muted">Брак</small></div>
                <div class="col-6"><div class="fw-bold fs-4 text-primary">${stats.avgDiameter1} mm</div><small class="text-muted">Ср. D1 (10 mm)</small></div>
                <div class="col-6"><div class="fw-bold fs-4 text-info">${stats.avgDiameter2} mm</div><small class="text-muted">Ср. D2 (22 mm)</small></div>
                <div class="col-6"><div class="fw-bold fs-4 text-warning">${stats.precision} mm</div><small class="text-muted">Точность</small></div>
            </div>
        `;
    }
}

function renderTimeline(scenarioKey) {
    const data = REPORT_DATA[scenarioKey];
    const container = document.getElementById(`${scenarioKey}-timeline`);
    const grouped = {};
    data.events.forEach(e => {
        const date = e.time.split(' ')[0];
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(e);
    });
    container.innerHTML = Object.entries(grouped).map(([date, events]) => `
        <div class="mb-3">
            <h6 class="text-muted mb-2">${formatDate(date)}</h6>
            ${events.map(e => `
                <div class="timeline-item ${e.severity}">
                    <strong>${e.time.split(' ')[1]}</strong> — ${e.message}
                    <div class="small text-muted">${e.zone} • <span class="badge severity-${e.severity}">${e.severity}</span></div>
                </div>
            `).join('')}
        </div>
    `).join('');
}

function renderGeneralStats() {
    const ocr = REPORT_DATA.ocr;
    const dia = REPORT_DATA.diameter;
    const totalEvents = ocr.totalEvents + dia.totalEvents;
    const totalSessions = ocr.sessions + dia.sessions;
    const totalAlerts = ocr.alerts + dia.alerts;
    const avgDuration = Math.round((ocr.avgDuration * ocr.sessions + dia.avgDuration * dia.sessions) / totalSessions);

    document.getElementById('total-events').textContent = totalEvents;
    document.getElementById('total-sessions').textContent = totalSessions;
    document.getElementById('total-alerts').textContent = totalAlerts;
    document.getElementById('avg-duration').textContent = avgDuration + ' мин';

    // Summary table
    const tbody = document.querySelector('#summary-table tbody');
    tbody.innerHTML = `
        <tr>
            <td><span class="badge bg-secondary">OCR</span></td>
            <td>${ocr.totalEvents}</td>
            <td>${ocr.alerts}</td>
            <td>${ocr.sessions}</td>
            <td>${ocr.avgDuration} мин</td>
            <td>${ocr.lastRun}</td>
        </tr>
        <tr>
            <td><span class="badge bg-primary">Diameter</span></td>
            <td>${dia.totalEvents}</td>
            <td>${dia.alerts}</td>
            <td>${dia.sessions}</td>
            <td>${dia.avgDuration} мин</td>
            <td>${dia.lastRun}</td>
        </tr>
        <tr class="table-active fw-bold">
            <td>Итого</td>
            <td>${totalEvents}</td>
            <td>${totalAlerts}</td>
            <td>${totalSessions}</td>
            <td>${avgDuration} мин</td>
            <td>—</td>
        </tr>
    `;

    // Severity counts
    const allEvents = [...ocr.events, ...dia.events];
    const counts = { danger: 0, warning: 0, info: 0, success: 0 };
    allEvents.forEach(e => counts[e.severity] = (counts[e.severity] || 0) + 1);
    document.getElementById('cnt-danger').textContent = counts.danger;
    document.getElementById('cnt-warning').textContent = counts.warning;
    document.getElementById('cnt-info').textContent = counts.info;
    document.getElementById('cnt-success').textContent = counts.success;
}

function formatDate(str) {
    const d = new Date(str);
    return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function exportReport(format) {
    const data = {
        generated: new Date().toISOString(),
        scenarios: REPORT_DATA
    };
    if (format === 'json') {
        downloadFile(JSON.stringify(data, null, 2), 'report.json', 'application/json');
    } else {
        let csv = 'Scenario,Time,Message,Zone,Severity\n';
        Object.entries(REPORT_DATA).forEach(([key, sc]) => {
            sc.events.forEach(e => {
                csv += `"${key}","${e.time}","${e.message}","${e.zone}","${e.severity}"\n`;
            });
        });
        downloadFile(csv, 'report.csv', 'text/csv');
    }
}

function downloadFile(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function printReport() {
    window.print();
}

// Range filter buttons
document.querySelectorAll('[data-range]').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('[data-range]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // In real app, would refetch data for selected range
        console.log('Range changed to:', btn.dataset.range);
    });
});

// Chart instances storage
const charts = {};

// Chart rendering functions
function renderCharts() {
    renderOcrCharts();
    renderDiameterCharts();
    renderGeneralCharts();
}

function renderOcrCharts() {
    const ctx1 = document.getElementById('ocr-confidence-chart');
    if (ctx1 && !charts.ocrConfidence) {
        charts.ocrConfidence = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: REPORT_DATA.ocr.confidenceHistory.map((_, i) => `Цикл ${i+1}`),
                datasets: [{
                    label: 'Уверенность (%)',
                    data: REPORT_DATA.ocr.confidenceHistory,
                    borderColor: '#0d6efd',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { min: 85, max: 100, ticks: { callback: v => v + '%' } }
                }
            }
        });
    }

    const ctx2 = document.getElementById('ocr-status-chart');
    if (ctx2 && !charts.ocrStatus) {
        const s = REPORT_DATA.ocr.statusCounts;
        charts.ocrStatus = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Успех', 'Инфо', 'Предупреждение', 'Ошибка'],
                datasets: [{
                    data: [s.success, s.info, s.warning, s.danger],
                    backgroundColor: ['#198754', '#0dcaf0', '#ffc107', '#dc3545'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }
}

function renderDiameterCharts() {
    const ctx1 = document.getElementById('diameter-measure-chart');
    if (ctx1 && !charts.diaMeasure) {
        charts.diaMeasure = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: REPORT_DATA.diameter.diameter1History.map((_, i) => `Цикл ${i+1}`),
                datasets: [
                    {
                        label: 'D1 (ном. 10 мм)',
                        data: REPORT_DATA.diameter.diameter1History,
                        borderColor: '#0d6efd',
                        backgroundColor: 'rgba(13, 110, 253, 0.1)',
                        fill: false,
                        tension: 0.3,
                        pointRadius: 4,
                        yAxisID: 'y'
                    },
                    {
                        label: 'D2 (ном. 22 мм)',
                        data: REPORT_DATA.diameter.diameter2History,
                        borderColor: '#198754',
                        backgroundColor: 'rgba(25, 135, 84, 0.1)',
                        fill: false,
                        tension: 0.3,
                        pointRadius: 4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { type: 'linear', position: 'left', min: 9.9, max: 10.1 },
                    y1: { type: 'linear', position: 'right', min: 21.9, max: 22.1, grid: { drawOnChartArea: false } }
                }
            }
        });
    }

    const ctx2 = document.getElementById('diameter-deviation-chart');
    if (ctx2 && !charts.diaDeviation) {
        charts.diaDeviation = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: REPORT_DATA.diameter.deviationHistory.map((_, i) => `Цикл ${i+1}`),
                datasets: [{
                    label: 'Отклонение от номинала (мм)',
                    data: REPORT_DATA.diameter.deviationHistory,
                    backgroundColor: REPORT_DATA.diameter.deviationHistory.map(v => v > 0 ? '#dc3545' : '#198754'),
                    borderColor: REPORT_DATA.diameter.deviationHistory.map(v => v > 0 ? '#b02a37' : '#146c43'),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { title: { display: true, text: 'мм' } } }
            }
        });
    }
}

function renderGeneralCharts() {
    // Severity pie
    const ctx1 = document.getElementById('severity-pie-chart');
    const allEvents = [...REPORT_DATA.ocr.events, ...REPORT_DATA.diameter.events];
    const counts = { danger: 0, warning: 0, info: 0, success: 0 };
    allEvents.forEach(e => counts[e.severity] = (counts[e.severity] || 0) + 1);

    if (ctx1 && !charts.severityPie) {
        charts.severityPie = new Chart(ctx1, {
            type: 'pie',
            data: {
                labels: ['Danger', 'Warning', 'Info', 'Success'],
                datasets: [{
                    data: [counts.danger, counts.warning, counts.info, counts.success],
                    backgroundColor: ['#dc3545', '#ffc107', '#0dcaf0', '#198754'],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right' } }
            }
        });
    }

    // Scenario bar
    const ctx2 = document.getElementById('scenario-bar-chart');
    if (ctx2 && !charts.scenarioBar) {
        charts.scenarioBar = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: ['OCR', 'Diameter'],
                datasets: [{
                    label: 'Событий',
                    data: [REPORT_DATA.ocr.totalEvents, REPORT_DATA.diameter.totalEvents],
                    backgroundColor: ['#6c757d', '#0d6efd'],
                    borderWidth: 1
                }, {
                    label: 'Уведомлений',
                    data: [REPORT_DATA.ocr.alerts, REPORT_DATA.diameter.alerts],
                    backgroundColor: ['#dc3545', '#dc3545'],
                    borderWidth: 1
                }, {
                    label: 'Сессий',
                    data: [REPORT_DATA.ocr.sessions, REPORT_DATA.diameter.sessions],
                    backgroundColor: ['#198754', '#198754'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }

    // Activity line (last 7 days)
    const ctx3 = document.getElementById('activity-line-chart');
    const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const ocrDaily = [18, 22, 15, 25, 20, 12, 8];
    const diaDaily = [10, 14, 8, 16, 12, 6, 4];

    if (ctx3 && !charts.activityLine) {
        charts.activityLine = new Chart(ctx3, {
            type: 'line',
            data: {
                labels: days,
                datasets: [
                    {
                        label: 'OCR',
                        data: ocrDaily,
                        borderColor: '#6c757d',
                        backgroundColor: 'rgba(108, 117, 125, 0.1)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Diameter',
                        data: diaDaily,
                        borderColor: '#0d6efd',
                        backgroundColor: 'rgba(13, 110, 253, 0.1)',
                        fill: true,
                        tension: 0.3
                    },
                    {
                        label: 'Всего',
                        data: ocrDaily.map((v, i) => v + diaDaily[i]),
                        borderColor: '#198754',
                        backgroundColor: 'rgba(25, 135, 84, 0.1)',
                        fill: true,
                        tension: 0.3,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    renderSummaryCards();
    renderEventsTable('ocr');
    renderEventsTable('diameter');
    renderStats('ocr');
    renderStats('diameter');
    renderTimeline('ocr');
    renderTimeline('diameter');
    renderGeneralStats();
    renderCharts();
});