USE testProject;

CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `userName` varchar(255),
  `password` varchar(255),
  `created_at` timestamp,
  `address` varchar(255),
  `privateKey` varchar(255)
);
