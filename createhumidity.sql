CREATE TABLE humidity (
id int NOT NULL UNIQUE AUTO_INCREMENT,
device_uid int DEFAULT NULL,
humidity float NOT NULL,
logtime timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
PRIMARY KEY (id)
)ENGINE=InnoDB;