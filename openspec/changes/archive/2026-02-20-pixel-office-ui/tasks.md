## 1. Project structure & index.html

- [x] 1.1 Создать `index.html` с canvas 800×600, HUD панелью и подключением JS модулей
- [x] 1.2 Добавить базовые стили: тёмный фон, пиксельный шрифт (monospace), canvas по центру

## 2. Office map (office.js)

- [x] 2.1 Определить константы: TILE_SIZE=16, MAP_WIDTH=50, MAP_HEIGHT=37
- [x] 2.2 Создать 2D массив карты с тайлами: floor, wall, desk, cooler, kitchen, meeting, printer
- [x] 2.3 Реализовать функцию renderMap(ctx) — рисует тайлы разными цветами
- [x] 2.4 Определить ZONES объект с координатами центров зон для каждого типа активности

## 3. Sprites (sprites.js)

- [x] 3.1 Реализовать drawCharacter(ctx, agent, frame) — рисует пиксельного человечка с цветом роли
- [x] 3.2 Реализовать drawStatusBubble(ctx, agent) — рисует пузырь с именем и статусом
- [x] 3.3 Реализовать drawOfficeObjects(ctx) — рисует кулер, холодильник, принтер, столы

## 4. Agent class (agents.js)

- [x] 4.1 Создать класс Agent с полями: id, name, role, color, position, state, activities
- [x] 4.2 Реализовать метод update(dt) — обновляет позицию и state machine
- [x] 4.3 Реализовать движение: плавное перемещение к target за заданное время
- [x] 4.4 Реализовать pickNextActivity() — случайный выбор из role-based списка активностей
- [x] 4.5 Определить 4 агентов: CEO Алекс, Dev Макс, Accountant Лена, Manager Катя

## 5. Simulation orchestrator (simulation.js)

- [x] 5.1 Создать EventBus (простой pub/sub)
- [x] 5.2 Реализовать главный game loop через requestAnimationFrame
- [x] 5.3 Запустить симуляцию: инициализировать агентов, начать loop
- [x] 5.4 Добавить обработчик external events через EventBus для будущего WebSocket

## 6. HUD панель

- [x] 6.1 Добавить HTML панель справа от canvas со списком агентов и их статусами
- [x] 6.2 Обновлять HUD в реальном времени при смене статуса агента

## 7. Verify

- [x] 7.1 Открыть index.html в браузере — убедиться что canvas рендерится без ошибок
- [x] 7.2 Убедиться что все 4 персонажа двигаются и статусы обновляются
- [x] 7.3 Проверить консоль браузера на отсутствие JS ошибок
