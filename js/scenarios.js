// Boiler Safety Monitor - Scenario Configuration
// Edit this file to change events, messages, zones, or video paths.
// Category/tool reference: Tools table v4.xlsx, sheet "Hikrobot SC3000 Tools".

const CATEGORY_TOOLS = {
    1: [
        'Измерение диаметра окружности',
        'Анализ яркости',
        'Анализ цвета',
        'Измерение цветовой площади',
        'Измерение контраста',
        'Измерение расстояния между двумя краями',
        'Измерение площади по яркости',
        'Измерение угла между двумя прямыми',
        'Измерение угла наклона прямой',
        'Измерение расстояния от точки до линии',
        'Измерение расстояния между двумя точками',
        'Измерение ширины объекта'
    ],
    2: [
        'Интеллектуальный подсчёт',
        'Подсчёт по цвету',
        'Подсчёт по контуру',
        'Подсчёт краёв',
        'Подсчёт по шаблону',
        'Подсчёт пятен'
    ],
    3: [
        'Классификация объектов',
        'Чтение 1D и 2D кодов',
        'Сравнение цвета с шаблоном',
        'Распознавание цветов',
        'Детекция и классификация нескольких объектов',
        'Обнаружение объектов',
        'Оптическое распознавание символов',
        'Распознавание типов'
    ]
};

const SCENARIOS = {
    ocr: {
        name: 'ocr',
        video: 'video/ocr.webm',
        category: 3,
        categoryName: 'Распознавание',
        currentTool: 'Оптическое распознавание символов',
        categoryTools: CATEGORY_TOOLS[3],
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
        category: 1,
        categoryName: 'Измерение',
        currentTool: 'Измерение диаметра окружности',
        categoryTools: CATEGORY_TOOLS[1],
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
        category: 2,
        categoryName: 'Подсчёт',
        currentTool: 'Интеллектуальный подсчёт',
        categoryTools: CATEGORY_TOOLS[2],
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
