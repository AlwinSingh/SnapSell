create schema snapsell;

USE snapsell;

CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `profile_pic_url` longtext,
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY(`id`),
  UNIQUE (`username`)
  );
  
  
  CREATE TABLE `listings` (
  `listingid` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL,
  `description` TEXT NOT NULL,
  `price` double NOT NULL,
  `fk_poster_id` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY(`listingid`),
  UNIQUE (`title`),
  FOREIGN KEY (`fk_poster_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
  );
  
    CREATE TABLE `offers` (
  `offerid` INT NOT NULL AUTO_INCREMENT,
  `offer` double NOT NULL,
  `fk_listing_id` INT NOT NULL,
  `fk_offeror_id` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT NOW(),
  PRIMARY KEY(`offerid`),
  FOREIGN KEY (`fk_listing_id`) REFERENCES `listings`(`listingid`) ON DELETE CASCADE,
  FOREIGN KEY (`fk_offeror_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
  );
  
  
  
INSERT INTO users 
(username, password, profile_pic_url)
values
("Alwin_Singh", "password123", "https://i.imgur.com/uzBHxi1.jpg"),
("Steve_Jobs", "password123", "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Steve_Jobs_Headshot_2010-CROP2.jpg/800px-Steve_Jobs_Headshot_2010-CROP2.jpg"),
("John_Myers", "password123", "https://i.imgur.com/FwIjYCh.jpg"),
("Jenny_Chan", "password123", "https://i.imgur.com/t5Gt7ii.jpg"),
("Michael_Bolt", "password123", "https://i.imgur.com/414sMJ.jpg"),
("Johnny_Williams", "password123", "https://i.imgur.com/832sMJ.jpg"),
("Mike_Tyrell", "password123", "https://i.imgur.com/223sMJ.jpg"),
("Lim_Choy", "password123", "https://i.imgur.com/86MSL.jpg"),
("Sharon_Che", "password123", "https://i.imgur.com/574LOD.jpg"),
("Arvin_Gadi", "password123", "https://i.imgur.com/857DLL.jpg"),
("Yunnie_Will", "password123", "https://i.imgur.com/455BAC.jpg"),
("Taylor_Martinez", "password123", "https://i.imgur.com/909MAD.jpg"),
("John_Mich", "password123", "https://i.imgur.com/857BJF.jpg"),
("Michael_Bodeht", "password123", "https://i.imgur.com/576CKX.jpg"),
("Brian_Wiliams", "password123", "https://i.imgur.com/095LOE.jpg"),
("Jeff_Nippard", "password123", "https://i.imgur.com/095LOE.jpg"),
("Alex_Choo", "password123", "https://i.imgur.com/204EAE.jpg"),
("De_Yang", "password123", "https://i.imgur.com/002ADA.jpg"),  
("Alex_Lim", "password123", "https://i.imgur.com/582ACM.jpg"),  
("Jeff_Loo", "password123", "https://i.imgur.com/461MCS.jpg");  


ALTER TABLE listings AUTO_INCREMENT = 1;

INSERT INTO listings
(title, description, price, fk_poster_id)
values
("iPhone 6s USED", "In good condition. Camera and screen not working.", 250, 1),
("Car wash service", "$100 fast service!", 100, 2),
("Intel Core i5-6500", "Brand new in box", 320, 3),
("Hyundai Sonata", "In good condition. Minimal body scratches. Can look at it in person!", 115000, 4),
("Gaming Desktop", "Operating System is corrupt. Selling fast!", 515, 5),
("Nike Zoomfly Running Shoes", "Soles' cushioning are depressed hence selling cheap!", 50, 5),
("BMW E30 Toy", "Only used for a week, bored of it", 250, 7),
("H4 Headlight Bulbs", "Bought them but they were not a good fit", 37, 15),
("4L WaterBottle", "Got it for free from a luckydraw, not of any use to me.", 20, 20),
("Singapore Flag", "Small singapore flag, 5cm by 8cm, never used before", 5, 13),
("Antique Chair", "Old chair, great condition, selling off", 150, 11),
("Subaru Widebody Kit", "Selling a Rocket Bunny widebody kit, not LTA approved", 2500, 10),
("Car Detailing Service", "We specialise in car detailing, all cars 350. Interior and Exterior deep clean and polish.", 350, 8),
("Michellin Tyres (1 Set)", "18 inch tyres, universal tyres, free installation at Sin Ming Auto City #0584-33", 950, 9),
("2500mAh powerbank", "Selling off my used powerbank, only used for 1 month. Not my liking.", 10, 16),
("Used 2.5kg dumbbell plates", "Changing to new ones, selling fast!", 16, 18);

INSERT INTO offers
(offer, fk_listing_id, fk_offeror_id)
values 
(100, 1, 3),
(10, 9, 16),
(16, 15, 18),
(30, 8, 5),
(510, 5, 9),
(105000, 4, 11),
(40, 6, 13),
(220, 7, 15),
(500, 5, 2);


/*ADVANCE FEATURES*/

CREATE TABLE likes (
    likeid INT NOT NULL AUTO_INCREMENT,
    fk_user_id INT NOT NULL,
    fk_listinglike_id INT NOT NULL,
    liked_at TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (likeid),
    UNIQUE KEY (fk_user_id, fk_listinglike_id),
    FOREIGN KEY (fk_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (fk_listinglike_id) REFERENCES listings(listingid) ON DELETE CASCADE
);

ALTER TABLE likes AUTO_INCREMENT = 1;

-- INSERT INTO likes
-- (fk_user_id, fk_listinglike_id)
-- values
-- (3, 1),
-- (15, 5),
-- (15, 2),
-- (10, 8),
-- (10, 1),
-- (12, 3),
-- (6, 4),
-- (9, 7),
-- (9, 3),
-- (2, 12),
-- (2, 14),
-- (4, 14),
-- (18, 13);

ALTER TABLE listings ADD COLUMN totallikes int NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN usertype VARCHAR(20) DEFAULT 'user';
-- ALTER TABLE users ADD COLUMN bio LONGTEXT DEFAULT '';
ALTER TABLE listings ADD COLUMN listings_pic longtext not null;

-- SELECT * FROM users;
-- SELECT * FROM listings;
-- SELECT * FROM offers;
-- SELECT * FROM likes;

-- UPDATE listings 
-- SET totallikes = totallikes + 1 
-- WHERE listingid = 1 AND totallikes > 0;

-- SELECT listings.title, offer, users.username
-- FROM snapsell.users, snapsell.offers, snapsell.listings
-- WHERE fk_poster_id = 21
-- && users.id = fk_offeror_id 
-- && listings.listingid = fk_listing_id
-- && fk_offeror_id != fk_poster_id;


-- SELECT fk_listinglike_id, fk_user_id FROM likes 
-- INNER JOIN users ON
-- likes.fk_user_id = users.id
-- INNER JOIN listings ON
-- listings.listingid = likes.fk_listinglike_id
-- WHERE listings.listingid = 14;

-- SELECT listings.listingid, likes.fk_user_id FROM listings, likes
-- WHERE
-- fk_listinglike_id = listingid && fk_user_id = 21;

-- SELECT fk_listinglike_id, fk_user_id FROM likes 
-- INNER JOIN users ON
-- likes.fk_user_id = users.id
-- INNER JOIN listings ON
-- listings.listingid = likes.fk_listinglike_id;
                    

-- DROP TABLE likes;
-- DROP TABLE offers;
-- DROP TABLE users, listings;