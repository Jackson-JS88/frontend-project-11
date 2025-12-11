### Hexlet tests and linter status:
[![Actions Status](https://github.com/Jackson-JS88/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Jackson-JS88/frontend-project-11/actions)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Jackson-JS88_frontend-project-11&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Jackson-JS88_frontend-project-11)

## Deployed Application
Live demo: https://frontend-project-11-nine-phi.vercel.app

## Описание

RSS агрегатор для чтения и управления RSS-потоками. Позволяет добавлять RSS-ссылки, просматривать посты и автоматически обновлять фиды.

## Функциональность

- Валидация RSS-ссылок с проверкой на дубликаты
- Загрузка и парсинг RSS-потоков  
- Отображение фидов и постов
- Автоматическое обновление каждые 5 секунд
- Предпросмотр постов в модальном окне
- Отметка прочитанных постов
- Интернационализация (i18next)

## Технологии

- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5 для стилей
- Vite для сборки
- Axios для HTTP-запросов
- yup для валидации
- i18next для интернационализации
- on-change для реактивного состояния

## Установка

```bash
git clone https://github.com/Jackson-JS88/frontend-project-11.git
cd frontend-project-11
npm install