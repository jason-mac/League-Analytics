-- ========================================
-- DROP TABLES
-- ========================================
DROP TABLE IF EXISTS PlayedIn CASCADE;
DROP TABLE IF EXISTS PlayerBuildsItems CASCADE;
DROP TABLE IF EXISTS BannedChampion CASCADE;
DROP TABLE IF EXISTS AffectedPatch CASCADE;
DROP TABLE IF EXISTS PlayerPlaysChampion CASCADE;
DROP TABLE IF EXISTS ChampionHasSkin CASCADE;
DROP TABLE IF EXISTS Rune CASCADE;
DROP TABLE IF EXISTS Player CASCADE;
DROP TABLE IF EXISTS Match CASCADE;
DROP TABLE IF EXISTS SummonerSpell CASCADE;
DROP TABLE IF EXISTS GamePerformance CASCADE;
DROP TABLE IF EXISTS SkinCollection CASCADE;
DROP TABLE IF EXISTS RuneFamily CASCADE;
DROP TABLE IF EXISTS Champion CASCADE;
DROP TABLE IF EXISTS Location CASCADE;
DROP TABLE IF EXISTS ItemInfo CASCADE;
DROP TABLE IF EXISTS Item CASCADE;

-- ========================================
-- CREATE TABLES
-- ========================================
CREATE TABLE Location (
  country VARCHAR(50) NOT NULL PRIMARY KEY,
  region VARCHAR(3)
);

CREATE TABLE Champion (
  championID VARCHAR(50) NOT NULL PRIMARY KEY,
  class VARCHAR(50),
  race VARCHAR(50)
);

CREATE TABLE SkinCollection (
  collectionName VARCHAR(50) NOT NULL PRIMARY KEY,
  colour VARCHAR(50),
  cost NUMERIC(8,2)
);

CREATE TABLE RuneFamily (
  principal VARCHAR(50) NOT NULL PRIMARY KEY,
  statBonus VARCHAR(50)
);

CREATE TABLE Item (
  itemID VARCHAR(50) PRIMARY KEY,
  bonus VARCHAR(50) UNIQUE
);

CREATE TABLE Match (
  matchID INTEGER PRIMARY KEY,
  winningTeam CHAR(10),
  gameMode CHAR(10)
);

CREATE TABLE SummonerSpell (
  ssID VARCHAR(50) PRIMARY KEY,
  cooldown INTEGER
);

CREATE TABLE GamePerformance (
  kills INTEGER,
  deaths INTEGER,
  assists INTEGER,
  performance VARCHAR(50),
  PRIMARY KEY (kills, deaths, assists)
);

CREATE TABLE Player (
  playerID VARCHAR(50) NOT NULL PRIMARY KEY,
  country VARCHAR(50) NOT NULL REFERENCES Location(country),
  dateCreated DATE,
  email VARCHAR(50) UNIQUE
);

CREATE TABLE ChampionHasSkin (
  cName VARCHAR(50) NOT NULL,
  skinID VARCHAR(50) NOT NULL,
  collectionName VARCHAR(50) NOT NULL,
  PRIMARY KEY (skinID, cName),
  FOREIGN KEY (cName) REFERENCES Champion(championID) ON DELETE CASCADE,
  FOREIGN KEY (collectionName) REFERENCES SkinCollection(collectionName) ON DELETE CASCADE
);

CREATE TABLE Rune (
  principal VARCHAR(50) NOT NULL,
  secondary VARCHAR(50) NOT NULL,
  PRIMARY KEY (principal, secondary),
  FOREIGN KEY (principal) REFERENCES RuneFamily(principal)
);

CREATE TABLE ItemInfo (
  bonus VARCHAR(50) PRIMARY KEY,
  cost INTEGER,
  numberOfUses INTEGER,
  buildsInto VARCHAR(50) REFERENCES Item(itemID) ON DELETE CASCADE
);

CREATE TABLE BannedChampion (
  matchID INTEGER,
  cName VARCHAR(50),
  PRIMARY KEY (matchID, cName),
  FOREIGN KEY (matchID) REFERENCES Match(matchID) ON DELETE CASCADE,
  FOREIGN KEY (cName) REFERENCES Champion(championID) ON DELETE SET NULL
);

CREATE TABLE AffectedPatch (
  cName VARCHAR(50),
  patchID INTEGER,
  description VARCHAR(50),
  patchType VARCHAR(50),
  PRIMARY KEY (cName, patchID),
  FOREIGN KEY (cName) REFERENCES Champion(championID) ON DELETE CASCADE
);

CREATE TABLE PlayerPlaysChampion (
  pName VARCHAR(50),
  cName VARCHAR(50),
  role CHAR(10),
  PRIMARY KEY (pName, cName),
  FOREIGN KEY (cName) REFERENCES Champion(championID) ON DELETE CASCADE,
  FOREIGN KEY (pName) REFERENCES Player(playerID) ON DELETE CASCADE
);

CREATE TABLE PlayerBuildsItems (
  matchID INTEGER,
  pName VARCHAR(50),
  item VARCHAR(50),
  PRIMARY KEY (matchID, pName, item),
  FOREIGN KEY (matchID) REFERENCES Match(matchID),
  FOREIGN KEY (pName) REFERENCES Player(playerID),
  FOREIGN KEY (item) REFERENCES Item(itemID)
);

CREATE TABLE PlayedIn (
  matchID INTEGER NOT NULL,
  uName VARCHAR(50) NOT NULL,
  cName VARCHAR(50) NOT NULL,
  sName_F VARCHAR(50),
  sName_D VARCHAR(50),
  rPrincipal VARCHAR(50) NOT NULL,
  rSecondary VARCHAR(50) NOT NULL,
  role CHAR(10) NOT NULL,
  team CHAR(10) NOT NULL,
  kills INTEGER,
  assists INTEGER,
  deaths INTEGER,
  PRIMARY KEY (matchID, uName, cName),
  UNIQUE (matchID, role, team),
  FOREIGN KEY (matchID) REFERENCES Match(matchID) ON DELETE CASCADE,
  FOREIGN KEY (uName, cName) REFERENCES PlayerPlaysChampion(pName, cName),
  FOREIGN KEY (rPrincipal, rSecondary) REFERENCES Rune(principal, secondary),
  FOREIGN KEY (kills, deaths, assists) REFERENCES GamePerformance(kills, deaths, assists),
  FOREIGN KEY (sName_F) REFERENCES SummonerSpell(ssID) ON DELETE SET NULL,
  FOREIGN KEY (sName_D) REFERENCES SummonerSpell(ssID) ON DELETE SET NULL
);

-- ========================================
-- INSERT DATA
-- ========================================
-- Location
INSERT INTO Location (country, region) VALUES 
('USA','NA'),('Canada','NA'),('Germany','EU'),('France','EU'),
('South Korea','KR'),('England','EU'),('China','CN'),('Nigeria','AF'),('Pakistan','AP');

-- Player
INSERT INTO Player (playerID, dateCreated, email, country) VALUES 
('topLaneLegend','2014-12-01'::DATE,'ses_ela@gmail.com','Canada'),
('DoubleLift','2015-06-25'::DATE,'pengyilang@hotmail.com','Pakistan'),
('hideonbush','2013-01-21'::DATE,'midgap@gmail.com','South Korea'),
('midOrFeed','2016-04-20'::DATE,'johnsmith@hotmail.com','China'),
('G2Caps','2014-02-15'::DATE,'rasmuswinther@yahoo.com','France'),
('Buasffs','2015-03-19'::DATE,'simonhof@gmail.com','Germany'),
('theshy','2017-02-20'::DATE,'seunglok@hotmail.com','Germany'),
('rekkless','2018-09-18'::DATE,'carlmartin@gmail.com','Nigeria'),
('GenChovy','2020-05-16'::DATE,'jihoon@hotmail.com','South Korea'),
('doinb','2023-02-18'::DATE,'supercarry@hotmail.com','England');

-- Champion
INSERT INTO Champion (championID, class, race) VALUES
('Garen','Bruiser','Demacia'),
('Caitlyn','Marksman','Piltover'),
('Lulu','Enchanter','Yordle'),
('Irelia','Fighter','Ionia'),
('Ahri','Mage','Ionia'),
('KSante','Tank','Nazumah'),
('Yasuo','Skirmisher','Ionia'),
('Lucian','Marksman','Demacia'),
('Azir','Mage','Shurima'),
('Talon','Assassin','Noxus');

-- SkinCollection
INSERT INTO SkinCollection (collectionName, colour, cost) VALUES
('God-King','Blue',25.00),
('Star Guardian','Pink',90.00),
('Arcade','Purple',250.00),
('High Noon','Orange',10.00),
('Enduring Sword','Blue',15.25),
('Warring Kingdoms','Gold',500.00),
('Default','Default',0.00);

-- ChampionHasSkin
INSERT INTO ChampionHasSkin (cName, skinID, collectionName) VALUES
('Garen','Garen001','Default'),
('Caitlyn','Caitlyn001','Default'),
('Lulu','Lulu001','Default'),
('Irelia','Irelia001','Default'),
('Ahri','Ahri001','Default'),
('KSante','KSante001','Default'),
('Yasuo','Yasuo001','Default'),
('Lucian','Lucian001','Default'),
('Azir','Azir001','Default'),
('Talon','Talon001','Default'),
('Garen','Garen002','God-King'),
('Garen','Garen003','High Noon'),
('Ahri','Ahri002','Star Guardian'),
('Yasuo','Yasuo002','Enduring Sword'),
('Lulu','Lulu002','Star Guardian'),
('Irelia','Irelia002','Arcade'),
('Azir','Azir002','Warring Kingdoms');

-- Match
INSERT INTO Match (matchID, winningTeam, gameMode) VALUES
(1,'Blue','Ranked'),
(2,'Red','Unrated'),
(3,'Blue','Unrated'),
(4,'Red','Unrated'),
(5,'Blue','Ranked'),
(6,'Red','Ranked');

-- AffectedPatch
INSERT INTO AffectedPatch (cName, patchID, description, patchType) VALUES
('Garen',101,'Increased base health','buff'),
('Caitlyn',101,'Reduced attack speed','debuff'),
('Lulu',102,'Improved shield strength','buff'),
('Irelia',102,'Lowered cooldown on Q','buff'),
('Ahri',103,'Increased mana cost on E','debuff');

-- SummonerSpell
INSERT INTO SummonerSpell (ssID, cooldown) VALUES
('Flash',300),
('Barrier',300),
('Ignite',180),
('Teleport',360),
('Smite',90),
('Heal',240);

-- RuneFamily
INSERT INTO RuneFamily (principal, statBonus) VALUES
('Precision','Attack Speed'),
('Domination','Adaptive Force'),
('Sorcery','Ability Power'),
('Resolve','Bonus Health'),
('Inspiration','Cooldown Reduction');

-- Rune
INSERT INTO Rune (principal, secondary) VALUES
('Precision','Domination'),
('Domination','Sorcery'),
('Sorcery','Inspiration'),
('Resolve','Precision'),
('Inspiration','Resolve');

-- BannedChampion
INSERT INTO BannedChampion (matchID, cName) VALUES
(1,'Garen'),(1,'Irelia'),(1,'Ahri'),(1,'Lulu'),
(5,'Garen'),(5,'Azir'),(5,'Talon'),(5,'Yasuo');

-- Item
INSERT INTO Item (itemID, bonus) VALUES
('Dark Seal','Glory'),
('Eclipse','Ever Rising Moon'),
('Manamune','Manaflow'),
('Elixir of Wraith','Drain'),
('Bamis Cinder','Immolate'),
('Sunfire Aegis','Resilience'),
('Mejais Soulstealer','Focus'),
('Muramana','Wave');

-- ItemInfo
INSERT INTO ItemInfo (bonus, cost, numberOfUses, buildsInto) VALUES
('Glory',350,NULL,'Mejais Soulstealer'),
('Ever Rising Moon',2900,NULL,NULL),
('Manaflow',2900,NULL,'Muramana'),
('Drain',500,1,NULL),
('Immolate',900,NULL,'Sunfire Aegis');

-- PlayerBuildsItems
INSERT INTO PlayerBuildsItems (matchID, pName, item) VALUES
(1,'theshy','Eclipse'),
(1,'hideonbush','Dark Seal'),
(1,'hideonbush','Manamune'),
(2,'G2Caps','Elixir of Wraith'),
(3,'topLaneLegend','Bamis Cinder'),
(3,'topLaneLegend','Eclipse');

-- PlayerPlaysChampion
INSERT INTO PlayerPlaysChampion (pName, cName, role) VALUES
('theshy','Irelia','Top'),
('hideonbush','Ahri','Mid'),
('DoubleLift','Caitlyn','ADC'),
('rekkless','Lulu','Support'),
('doinb','Talon','Jungle'),
('G2Caps','Azir','Mid'),
('topLaneLegend','Garen','Top'),
('theshy','Lulu','Mid'),
('theshy','KSante','Mid'),
('theshy','Talon','Mid'),
('theshy','Garen','Mid'),
('G2Caps','Garen','Top'),
('G2Caps','Talon','ADC'),
('G2Caps','KSante','ADC'),
('G2Caps','Lulu','ADC');

-- GamePerformance
INSERT INTO GamePerformance (kills, deaths, assists, performance) VALUES
(15,1,5,'Great'),
(10,2,8,'Great'),
(3,4,25,'Great'),
(8,4,3,'Good'),
(5,5,2,'Poor'),
(2,7,3,'Bad');

-- PlayedIn
INSERT INTO PlayedIn (matchID, uName, cName, sName_F, sName_D, rPrincipal, rSecondary, role, team, kills, assists, deaths) VALUES
(1,'theshy','Irelia','Flash','Teleport','Precision','Domination','Top','Blue',10,8,2),
(1,'hideonbush','Ahri','Flash','Ignite','Domination','Sorcery','Mid','Blue',15,5,1),
(1,'DoubleLift','Caitlyn','Flash','Heal','Precision','Domination','ADC','Blue',3,25,4),
(1,'rekkless','Lulu','Flash','Heal','Sorcery','Inspiration','Support','Blue',8,3,4),
(1,'doinb','Talon','Flash','Smite','Domination','Sorcery','Jungle','Blue',5,2,5),
(2,'G2Caps','Azir','Flash','Barrier','Sorcery','Inspiration','Mid','Red',2,3,7),
(3,'theshy','Lulu','Flash','Ignite','Sorcery','Inspiration','Mid','Red',2,3,7),
(4,'theshy','KSante','Flash','Barrier','Sorcery','Inspiration','Mid','Red',2,3,7),
(5,'theshy','Talon','Ignite','Heal','Sorcery','Inspiration','Mid','Red',2,3,7),
(6,'theshy','Garen','Flash','Smite','Sorcery','Inspiration','Mid','Red',2,3,7),
(3,'G2Caps','Garen','Teleport','Ignite','Sorcery','Inspiration','Top','Blue',3,25,4),
(4,'G2Caps','Talon','Flash','Barrier','Sorcery','Inspiration','ADC','Red',3,25,4),
(5,'G2Caps','KSante','Ignite','Heal','Sorcery','Inspiration','ADC','Blue',3,25,4),
(6,'G2Caps','Lulu','Flash','Smite','Sorcery','Inspiration','ADC','Red',3,25,4);
