// Boiler Safety Monitor - Scenario Configuration
// Edit this file to change events, messages, zones, or video paths.

const SCENARIOS = {
    ocr: {
        name: 'ocr',
        video: 'video/ocr.webm',
        events: [
            { time: '0:00', message: 'Начало движения конвейера', zone: 'Камера 1', severity: 'info', type: 'event' },
            { time: '0:03', message: 'Обнаружен объект', zone: 'Камера 1', severity: 'info', type: 'event' },
            { time: '0:05', message: 'Обнаружен текст', zone: 'Камера 1', severity: 'info', type: 'event' },
            { time: '0:06', message: 'Распознавание текста: 09/2025', zone: 'Камера 1', severity: 'info', type: 'event' },
            { time: '0:10', message: 'Объект покидает зону проверки', zone: 'Камера 1', severity: 'info', type: 'event' },
            { time: '0:17', message: 'Следующий цикл', zone: 'Камера 1', severity: 'info', type: 'event' }
        ]
    },
    diameter: {
        name: 'diameter',
        video: 'video/diameter.webm',
        events: [
            { time: '0:00', message: 'Начало движения конвейера', zone: 'Камера 1', severity: 'info', type: 'event' },
            { time: '0:03', message: 'Обнаружен объект', zone: 'Камера 1', severity: 'info', type: 'event' },
            { time: '0:04', message: 'Измерение диаметра', zone: 'Камера 1', severity: 'info', type: 'event' },
            { time: '0:05', message: 'Результат: 85.12 px (10 mm)', zone: 'Камера 1', severity: 'info', type: 'event' },
            { time: '0:06', message: 'Результат: 186.34 px (22 mm)', zone: 'Камера 1', severity: 'info', type: 'event' },
            { time: '0:10', message: 'Объект покидает зону проверки', zone: 'Камера 1', severity: 'info', type: 'event' },
            { time: '0:17', message: 'Следующий цикл', zone: 'Камера 1', severity: 'info', type: 'event' }
        ]
    },
    registered: {
        name: 'registered',
        video: 'video/Registered.webm',
        events: [
            { time: '0:04', message: 'Начало цикла', zone: 'Камера 1', severity: 'info', type: 'event' },
            { time: '0:05', message: 'Обнаружение объектов', zone: 'Камера 1', severity: 'info', type: 'event' },
            { time: '0:07', message: 'Обнаружено 4 объекта типа 1', zone: 'Камера 1', severity: 'success', type: 'event' },
            { time: '0:10', message: 'Конец цикла', zone: 'Камера 1', severity: 'info', type: 'event' },
            { time: '0:15', message: 'Начало цикла', zone: 'Камера 1', severity: 'info', type: 'event' },
            { time: '0:17', message: 'Обнаружение объектов', zone: 'Камера 1', severity: 'info', type: 'event' },
            { time: '0:20', message: 'Обнаружено 4 объекта типа 20', zone: 'Камера 1', severity: 'success', type: 'event' },
            { time: '0:25', message: 'Конец цикла', zone: 'Камера 1', severity: 'info', type: 'event' }
        ]
    }
};
