1. Установите все зависимости:

```bash
npm install
```

3. Установите PostgreSQL

4. Создайте базу данных

4. Создайте `.env.local` файл:

```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=

PG_USER=
PG_HOST=localhost
PG_DATABASE=
PG_PASSWORD=
PG_PORT=5432
```

Добавьте необходимые данные. Мы используем `.env.local` потому что в основе сайта лежит Next.js. Поэтому если где-то вам необходимо использовать dotenv, чтобы не дублировать API ключи и пароли, прописывайте нужный path, вот так:

```
require('dotenv').config({ path: '.env.local' });
```
Иначе модуль будет пытаться найти стандартный `.env` файл. Модулей фреймворка это не касается, т.к. он по умолчанию работает с `.env.local`.

5. Примените миграции

```
npx knex migrate:latest
```

Это создаст необходимые таблицы в базе данных. Для отката всех миграций используйте команду:

```
npx knex migrate:rollback --all
```