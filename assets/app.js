// Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;

// Применяем тему Telegram (dark/light)
function applyTelegramTheme() {
  const body = document.body;
  if (!tg) {
    body.classList.add('light'); // fallback: светлая тема
    return;
  }
  tg.expand(); // растянуть WebApp по высоте
  const colorScheme = tg.colorScheme; // 'light' | 'dark'
  body.classList.toggle('light', colorScheme === 'light');

  // Настроим акцент по теме (необязательно)
  const themeParams = tg.themeParams || {};
  // Можно тонко подстроить цвета через themeParams, если нужно
}

// Открыть чат по username
function openChat(username = 'SeregaHD') {
  const link = `https://t.me/${username}`;
  if (tg?.openTelegramLink) {
    tg.openTelegramLink(link);
  } else {
    window.open(link, '_blank');
  }
}

// Поделиться ссылкой на Mini App (простая версия)
function shareLink(text = 'Моё портфолио', url = window.location.href) {
  const shareText = `${text}\n${url}`;
  if (navigator.share) {
    navigator.share({ title: text, text: shareText, url }).catch(() => {});
  } else {
    // Fallback: копирование в буфер
    navigator.clipboard.writeText(url).then(() => {
      alert('Ссылка скопирована');
    });
  }
}

// Загрузка данных (проекты/отзывы)
// Можно хранить в отдельном JSON для удобной замены контента
async function loadData() {
  try {
    const res = await fetch('assets/data.json');
    if (!res.ok) throw new Error('Failed to load data.json');
    return await res.json();
  } catch (e) {
    // Fallback: встроенные данные
    return {
      projects: [
        {
          title: 'Брендинг кофе‑бренда',
          category: 'branding',
          cover: 'assets/images/project1.jpg',
          meta: 'Логотип, гайд, шрифты',
          link: '#'
        },
        {
          title: 'Премиальная упаковка',
          category: 'packaging',
          cover: 'assets/images/project2.jpg',
          meta: 'Фактура, тиснение, препресс',
          link: '#'
        },
        {
          title: 'Монокромный editorial',
          category: 'editorial',
          cover: 'assets/images/project3.jpg',
          meta: 'Серия портретов, печать',
          link: '#'
        }
      ],
      quotes: [
        {
          text: 'Упаковка стала премиальной и узнаваемой на полке.',
          who: 'Анна',
          role: 'Бренд‑менеджер'
        },
        {
          text: 'Чёткий процесс, аккуратная типографика, высокий реализм.',
          who: 'Илья',
          role: 'Директор по продукту'
        }
      ]
    };
  }
}

// Рендер карточек проектов
function renderProjects(projects) {
  const grid = document.getElementById('portfolioGrid');
  grid.innerHTML = '';
  projects.forEach(p => {
    const el = document.createElement('div');
    el.className = 'card';
    el.dataset.category = p.category;

    el.innerHTML = `
      <div class="card-media">
        <img src="${p.cover}" alt="${p.title}" />
      </div>
      <div class="card-body">
        <div class="card-title">${p.title}</div>
        <div class="card-meta">${p.meta}</div>
        <div class="card-actions">
          <a class="cta outline" href="${p.link}" target="_blank">Подробнее</a>
          <button class="cta ghost" data-share="${p.title}">Поделиться</button>
        </div>
      </div>
    `;
    grid.appendChild(el);
  });

  // Обработчики "Поделиться"
  grid.querySelectorAll('[data-share]').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-share');
      shareLink(`Проект: ${title}`);
    });
  });
}

// Рендер отзывов
function renderQuotes(quotes) {
  const container = document.getElementById('quotes');
  container.innerHTML = '';
  quotes.forEach(q => {
    const el = document.createElement('div');
    el.className = 'quote';
    el.innerHTML = `
      <div class="text">“${q.text}”</div>
      <div class="who">${q.who}</div>
      <div class="role">${q.role}</div>
    `;
    container.appendChild(el);
  });
}

// Фильтрация проектов
function setupFilters(projects) {
  const chips = document.querySelectorAll('.chip');
  chips.forEach(ch => {
    ch.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      ch.classList.add('active');

      const filter = ch.getAttribute('data-filter');
      const filtered = filter === 'all' ? projects : projects.filter(p => p.category === filter);
      renderProjects(filtered);
    });
  });
}

// Основной init
window.addEventListener('DOMContentLoaded', async () => {
  applyTelegramTheme();

  // Кнопки чата
  document.getElementById('openChat')?.addEventListener('click', () => openChat('SeregaHD'));
  document.getElementById('openChat2')?.addEventListener('click', () => openChat('SeregaHD'));

  // Кнопки хиро
  document.getElementById('bookBtn')?.addEventListener('click', () => openChat('SeregaHD'));
  document.getElementById('viewCV')?.addEventListener('click', () => {
    // Поменяй на реальную ссылку твоего PDF
    window.open('assets/portfolio.pdf', '_blank');
  });

  // Кнопка поделиться
  document.getElementById('shareBtn')?.addEventListener('click', () => shareLink('Портфолио Серёги'));

  // Данные
  const data = await loadData();
  renderProjects(data.projects);
  renderQuotes(data.quotes);
  setupFilters(data.projects);
});

