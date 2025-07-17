INSERT INTO employees
(employee_id, first_name, last_name, national_id, email, cellphone, town_id, address_detail, created_at, updated_at)
VALUES
(1, '大明', '王', 'A123456789', 'a123456789@gmail.com', '0912345678', 1,'大學路1號', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, '紙屑', '潭', 'B287654321', 'b987654321@gmail.com', '0987654321', 2,'大學路2號', CURRENT_TIMESTAMP + INTERVAL '1 second', CURRENT_TIMESTAMP + INTERVAL '1 second'),
(3, '別林', '卓', 'C123456789', 'c123@gmail.com', '0912345679', 3,'大學路3號', CURRENT_TIMESTAMP + INTERVAL '2 second', CURRENT_TIMESTAMP + INTERVAL '2 second'),
(4, '葛蘭傑', '苗栗', 'D187654321', 'd123@gmail.com', '0987654322', 4,'大學路4號', CURRENT_TIMESTAMP + INTERVAL '3 second', CURRENT_TIMESTAMP + INTERVAL '3 second'),
(5, '小五郎', '苗栗', 'E123456789', 'e123@gmail.com', '0912345680', 5,'大學路5號', CURRENT_TIMESTAMP + INTERVAL '4 second', CURRENT_TIMESTAMP + INTERVAL '4 second')
;