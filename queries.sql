--
-- Список всех категорий (идентификатор, наименование категории)
--
SELECT * FROM categories;

--
-- Список категорий для которых создано минимум одно объявление (идентификатор, наименование категории);
--
SELECT c.* FROM categories c
    INNER JOIN offers_categories oc
               ON c.id = oc."categoryId"
GROUP BY c.id;

--
-- Список категорий с количеством объявлений
-- (идентификатор, наименование категории, количество объявлений в категории);
--
SELECT c.*, count(oc."offerId") as count_offers
FROM categories c
         LEFT JOIN offers_categories oc
                   ON c.id = oc."categoryId"
GROUP BY c.id;


-- Получить список объявлений
-- (идентификатор объявления, заголовок объявления, стоимость, тип объявления,
--  текст объявления, дата публикации, имя и фамилия автора, контактный email,
--  количество комментариев, наименование категорий).
--  Сначала свежие объявления;
SELECT o.id, o.title, o.sum, o.type,
       o.description, o."createdAt"t, u.firstname, u.lastname, u.email,
       (SELECT count(*) FROM comments c WHERE c."offerId" = o.id) as count_comments,
       (SELECT string_agg(c.title, ', ') FROM categories c
            JOIN offers_categories oc ON oc."categoryId" = c.id AND oc."offerId" = o.id) as categories
FROM offers o
         LEFT JOIN users u ON u.id = o."userId"
ORDER BY o."createdAt" DESC;


-- Полная информация определённого объявления
-- (идентификатор объявления, заголовок объявления, стоимость, тип объявления,
-- текст объявления, дата публикации, имя и фамилия автора, контактный email,
-- количество комментариев,
-- наименование категорий)
SELECT o.id, o.title, o.sum, o.type,
       o.description, o."createdAt", u.firstname, u.lastname, u.email,
       (SELECT count(*) FROM comments c WHERE c."offerId" = o.id) as count_comments,
       (SELECT string_agg(c.title, ', ') FROM categories c
            JOIN offers_categories oc ON oc."categoryId" = c.id AND oc."categoryId" = o.id) as categories
FROM offers o
         LEFT JOIN users u ON u.id = o."userId"
WHERE o.id = 3;


--
-- Список из 5 свежих комментариев
-- (идентификатор комментария, идентификатор объявления, имя и фамилия автора, текст комментария);
--
SELECT c.id, c."offerId", u.firstname, u.lastname, c.text
FROM comments c
        LEFT JOIN users u ON c."userId" = u.id
ORDER BY c."createdAt" DESC
LIMIT 5;


--
-- Список комментариев для определённого объявления
-- (идентификатор комментария, идентификатор объявления, имя и фамилия автора, текст комментария).
-- Сначала новые комментарии
--
SELECT c.id, c."offerId", u.firstname, u.lastname, c.text
FROM comments c
         LEFT JOIN users u ON c."userId" = u.id
WHERE c."offerId" = 1
ORDER BY c."createdAt" DESC;


--
-- Выбрать 2 объявления, соответствующих типу «куплю»
--
SELECT * FROM offers
    WHERE type = 'buy'
LIMIT 2;


--
-- Обновить заголовок определённого объявления на «Уникальное предложение!»;
--
UPDATE offers SET title = 'Уникальное предложение!' WHERE id = 1
