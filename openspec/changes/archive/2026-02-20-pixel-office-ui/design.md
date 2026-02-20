## Context

Проект создаётся с нуля. Нужен лёгкий, самодостаточный веб-проект без сборщиков и npm — просто HTML + JS, открываемый в браузере или через простой HTTP-сервер. Это важно для будущей трансляции на YouTube.

## Goals / Non-Goals

**Goals:**
- Работающая пиксельная симуляция в браузере без зависимостей
- Простая архитектура, легко расширяемая для реальных событий
- Плавная анимация через requestAnimationFrame

**Non-Goals:**
- Реальное подключение к AI-агентам (это следующий этап)
- OBS/YouTube streaming setup (отдельный change)
- Мобильная адаптация
- Звук

## Decisions

### Decision 1: Vanilla JS + Canvas API (без фреймворков)

Никакого Phaser.js, Three.js или React. Чистый Canvas 2D API.

**Почему:** Нулевые зависимости → открывай `index.html` напрямую. Проще отлаживать при стриминге. Canvas API достаточен для 2D пиксельной графики.

### Decision 2: Tile-based карта через 2D массив

Офис описывается как 2D массив тайлов (floor, desk, wall, cooler, kitchen, meeting, printer).

```
MAP = [
  [W, W, W, W, W, ...],
  [W, F, F, F, D, ...],  // D = desk, F = floor
  ...
]
```

**Почему:** Легко читается, легко изменяется. Зоны = наборы координат в этом массиве.

### Decision 3: State Machine как простой объект

```javascript
agent.state = {
  current: 'idle' | 'moving' | 'working' | 'break',
  activity: 'Кодит',
  target: { x, y },
  timer: 0,
  externalOverride: false
}
```

Нет сторонних библиотек state machine. Простой switch в update() цикле.

### Decision 4: Программные спрайты

Спрайты рисуются через Canvas API (прямоугольники, круги) без PNG файлов. Каждый персонаж — уникальный цвет + форма. Это делает проект полностью самодостаточным.

### Decision 5: Event Bus для WebSocket-ready архитектуры

```javascript
EventBus.emit('agent:activity', { agentId: 'dev', activity: 'Кодит' })
EventBus.on('external:event', handler)
```

Симуляция слушает EventBus. В будущем WebSocket просто эмитит события в тот же шину.

## File Structure

```
agents-office-web-ui/
├── index.html          ← точка входа, canvas + HUD
├── src/
│   ├── office.js       ← карта, зоны, рендеринг тайлов
│   ├── agents.js       ← класс Agent, state machine
│   ├── simulation.js   ← оркестратор, event bus
│   └── sprites.js      ← рисование персонажей и объектов
└── openspec/           ← OpenSpec артефакты
```
