# Gemini / Planner PWA (Verobniche)

Цей репозиторій містить **PWA-планувальник** (Personal Planner Dashboard), який включає:

- **Живі годинник** (JS оновлюється щосекунди)
- **Поточну погоду + прогноз** (Open-Meteo API)
- **Інтеграцію з Google Calendar** (OAuth2 + Calendar API)
- **PWA-налаштування** через `vite-plugin-pwa`
- **Cloudflare Worker** для проксирування погоди та статичних ресурсів (опційно)

---

## 🧩 Структура проекту

- `index.html` — коріння UI (рисуй дерево DOM для додатку)
- `src/main.js` — точка входу, ініціалізує годинник + погоду + кнопки авторизації
- `src/style.css` — простий CSS для проєкту
- `src/modules/clock.js` — модуль живого годинника
- `src/modules/weather_client.js` — отримання даних погоди з Open-Meteo
- `src/modules/calendar.js` — робота з Google Calendar (OAuth + API)
- `pwa-assets.config.js` — конфіг для генератора PWA-іконок
- `worker/cloudflare-worker.js` — проксі для погоди + додаткові заголовки безпеки
- `worker/wrangler.toml` — конфіг Cloudflare Worker

---

## 🚀 Як запустити (локально)

1. Встановіть залежності:

```bash
npm install
```

2. Запустіть у режимі розробки:

```bash
npm run dev
```

3. Відкрийте у браузері (за замовчуванням):

- http://localhost:5173

> ⚠️ Якщо ви використовуєте проксі / Cloudflare Worker, використовуйте правильний URL у `PWA_ORIGIN` (див. `worker/cloudflare-worker.js`).

---

## 🔑 Налаштування Google Calendar (OAuth)

Файл: `src/modules/calendar.js`

- `CLIENT_ID` — ваш клієнт Google OAuth 2.0
- `API_KEY` — ваш API ключ для Google Calendar API

> ✅ Щоб працювала авторизація, потрібно створити **OAuth 2.0 Client ID** у [Google Cloud Console](https://console.cloud.google.com/) та дозволити **Google Calendar API**.

> ✅ Також переконайтеся, що у налаштуваннях OAuth додатка вказані правильні **Authorized JavaScript origins** (наприклад, `http://localhost:5173`).

---

## 🌤️ Погода (Open-Meteo)

Модуль `src/modules/weather_client.js` робить запит до `https://api.open-meteo.com/v1/forecast`. За замовчуванням координати прив’язані до Києва:

- `lat = 50.45`
- `lon = 30.52`

Для зміни міста змініть ці значення у `src/main.js`.

---

## ☁️ Розгортання (Cloudflare Worker)

Є простий Cloudflare Worker (`worker/cloudflare-worker.js`), який:

- проксірує запити на Open-Meteo та кешує відповідь
- додає заголовки безпеки (CSP, CORP, CORS, тощо)
- може проксувати статичні ресурси з `PWA_ORIGIN`

> 🧠 Щоб розгортати: використовуйте `wrangler publish` з налаштованим `wrangler.toml`.

---

## 🧪 Побудова та прев’ю

- Побудова для продакшн:

```bash
npm run build
```

- Перегляд збудованого варіанту локально:

```bash
npm run preview
```

---

## 📝 Поради та ідеї для розширення

- Додати можливість вибору місцезнаходження (GPS / введення міста)
- Показувати більше погодних даних (вологість, вітер, іконки)
- Додати розклад/події користувача (CRUD) поверх Google Calendar
- Додати offline-підтримку (Service Worker + кешування API)

---

## 🧭 Корисні файли

- `vite.config.js` — конфіг Vite + плагін PWA
- `public/` — статичні ресурси, що копіюються у збірку
- `worker/` — код Cloudflare Workers

---

> Документ `gemini.md` служить для швидкого ознайомлення з проєктом та залежностями.
