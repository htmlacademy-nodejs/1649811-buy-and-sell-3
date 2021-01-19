--
-- Список всех категорий (идентификатор, наименование категории)
--
SELECT * FROM categories;

--
-- Список категорий для которых создано минимум одно объявление (идентификатор, наименование категории);
--
SELECT c.* FROM categories c
    INNER JOIN offers_categories oc
               ON c.id = oc.category_id
GROUP BY c.id;

--
-- Список категорий с количеством объявлений
-- (идентификатор, наименование категории, количество объявлений в категории);
--
SELECT c.*, count(oc.offer_Id) as count_offers
FROM categories c
         LEFT JOIN offers_categories oc
                   ON c.id = oc.category_id
GROUP BY c.id;


-- Получить список объявлений
-- (идентификатор объявления, заголовок объявления, стоимость, тип объявления,
--  текст объявления, дата публикации, имя и фамилия автора, контактный email,
--  количество комментариев, наименование категорий).
--  Сначала свежие объявления;
SELECT o.id, o.title, o.sum, t.title as type,
       o.description, o.created_at, u.firstname, u.lastname, u.email,
       (SELECT count(*) FROM comments c WHERE c.offer_id = o.id) as count_comments,
       (SELECT string_agg(c.title, ', ') FROM categories c
            JOIN offers_categories oc ON oc.category_id = c.id AND oc.offer_id = o.id) as categories
FROM offers o
         LEFT JOIN types t ON t.id = o.type_id
         LEFT JOIN users u ON u.id = o.user_id
ORDER BY o.created_at DESC;


-- Полная информация определённого объявления
-- (идентификатор объявления, заголовок объявления, стоимость, тип объявления,
-- текст объявления, дата публикации, имя и фамилия автора, контактный email,
-- количество комментариев,
-- наименование категорий)
SELECT o.id, o.title, o.sum, t.title as type,
       o.description, o.created_at, u.firstname, u.lastname, u.email,
       (SELECT count(*) FROM comments c WHERE c.offer_id = o.id) as count_comments,
       (SELECT string_agg(c.title, ', ') FROM categories c
            JOIN offers_categories oc ON oc.category_id = c.id AND oc.offer_id = o.id) as categories
FROM offers o
         LEFT JOIN types t ON t.id = o.type_id
         LEFT JOIN users u ON u.id = o.user_id
WHERE o.id = 3;


--
-- Список из 5 свежих комментариев
-- (идентификатор комментария, идентификатор объявления, имя и фамилия автора, текст комментария);
--
SELECT c.id, c.offer_id, u.firstname, u.lastname, c.text
FROM comments c
        LEFT JOIN users u ON c.user_id = u.id
ORDER BY c.created_at DESC
LIMIT 5;


--
-- Список комментариев для определённого объявления
-- (идентификатор комментария, идентификатор объявления, имя и фамилия автора, текст комментария).
-- Сначала новые комментарии
--
SELECT c.id, c.offer_id, u.firstname, u.lastname, c.text
FROM comments c
         LEFT JOIN users u ON c.user_id = u.id
WHERE c.offer_id = 1
ORDER BY c.created_at DESC;


--
-- Выбрать 2 объявления, соответствующих типу «куплю»
--
SELECT o.* FROM offers o
    INNER JOIN types t ON o.type_id = t.id AND t.title = 'buy'
LIMIT 2;


--
-- Обновить заголовок определённого объявления на «Уникальное предложение!»;
--
UPDATE offers SET title = 'Уникальное предложение!' WHERE id = 1
