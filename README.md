Запуск призмы студии: npx prisma studio
 npx prisma db seed  - Для создания админа

Перегенерируй sitemap и положи файлы в public/
Если используешь next-sitemap:
# в проекте
npx next-sitemap
# затем проверь files в public/: sitemap.xml, sitemap-0.xml и т.д.

<!-- Обновления на сервере -->
git pull
npm run build
pm2 restart all