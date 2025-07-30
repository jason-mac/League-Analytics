-- Table creation statements
CREATE TABLE Location (
  country VARCHAR2(50) NOT NULL,
  region VARCHAR2(3),

  CONSTRAINT pk_Location PRIMARY KEY (country)
);

CREATE TABLE Player (
    playerID VARCHAR2(50) NOT NULL,
    country VARCHAR2(50) NOT NULL,
    dateCreated DATE, 
    email VARCHAR2(50),

    CONSTRAINT pk_Player PRIMARY KEY (playerID),
    CONSTRAINT fk_Player FOREIGN KEY (country) REFERENCES Location(country)
);

CREATE TABLE Champion (
  championID VARCHAR2(50) NOT NULL,
  class VARCHAR2(50),
  race VARCHAR2(50),

  CONSTRAINT pk_Champion PRIMARY KEY (championID)
);


CREATE TABLE SkinCollection (
  collectionName VARCHAR(50) NOT NULL,
  colour VARCHAR2(50),
  cost NUMBER(8, 2),
  CONSTRAINT pk_SkinCollection PRIMARY KEY (collectionName)
);



CREATE TABLE ChampionHasSkin (
  cName VARCHAR2(50) NOT NULL,
  skinID VARCHAR2(50) NOT NULL,
  collectionName VARCHAR2(50) NOT NULL,

  CONSTRAINT pk_ChampionHasSkin PRIMARY KEY (skinID, cName),

  CONSTRAINT fk1_ChampionHasSkin FOREIGN KEY (cName) 
    REFERENCES Champion(championID)
    ON DELETE CASCADE,

  CONSTRAINT fk2_ChampionHasSkin FOREIGN KEY (collectionName) 
    REFERENCES SkinCollection(collectionName)
    ON DELETE CASCADE
);

CREATE TABLE RuneFamily (
  principal VARCHAR2(50) NOT NULL,
  statBonus VARCHAR2(50),
  CONSTRAINT pk_RuneFamily PRIMARY KEY (principal)
);



CREATE TABLE Rune (
  principal VARCHAR2(50) NOT NULL,
  secondary VARCHAR2(50) NOT NULL,
  constraint pk_Rune PRIMARY KEY (principal, secondary),
  constraint fk_Rune FOREIGN KEY (principal) REFERENCES RuneFamily (principal)
);


CREATE TABLE PlayedIn (
  matchID INTEGER NOT NULL,
  uName VARCHAR2(50) NOT NULL,
  cName VARCHAR2(50) NOT NULL,
  sName_F VARCHAR2(50) NOT NULL,
  sName_D VARCHAR2(50) NOT NULL,
  rPrincipal VARCHAR2(50) NOT NULL,
  rSecondary VARCHAR2(50) NOT NULL,
  role CHAR(10) NOT NULL,
  team CHAR(10) NOT NULL,
  kills INTEGER,
  assists INTEGER,
  deaths INTEGER,

  CONSTRAINT pk_PlayedIn PRIMARY KEY (matchID, uName, cName),
  
  CONSTRAINT ck_PlayedIn UNIQUE (matchID, role, team),

  CONSTRAINT fk1_PlayedIn FOREIGN KEY (matchID) REFERENCES Match (matchID)
    ON DELETE CASCADE,

  CONSTRAINT fk2_PlayedIn FOREIGN KEY (uName, cName) REFERENCES PlayerPlaysChampion (pName, cName)
    ON DELETE SET NULL,

  CONSTRAINT fk3_PlayedIn FOREIGN KEY (rPrincipal, rSecondary) REFERENCES Rune (principal, secondary)
    ON DELETE SET NULL
  
  CONSTRAINT fK4_PlayedIn FOREIGN KEY (kills, deaths, assists) REFERENCES GamePerformance(kills, deaths, assists)
  	ON DELETE NO ACTION
);

CREATE TABLE ItemInfo (
  bonus VARCHAR2(50), 
  cost INTEGER, 
  numberOfUses INTEGER, 		                 	
  buildsInto VARCHAR2(50),

  CONSTRAINT pk_ItemInfo PRIMARY KEY (bonus),

  CONSTRAINT fk_BuildsInto FOREIGN KEY (buildsInto) REFERENCES Item(itemID) 
    ON DELETE CASCADE
);

CREATE TABLE Item (
  itemID VARCHAR2(50),
  bonus VARCHAR2(50) UNIQUE,
  CONSTRAINT pk_Item PRIMARY KEY (itemID)
);


CREATE TABLE Match (
  matchID INTEGER,
  winningTeam CHAR(10),
  gameMode CHAR(10),

  CONSTRAINT pk_Match PRIMARY KEY (matchID)
);

CREATE TABLE BannedChampion (
  matchID INTEGER,
  cName VARCHAR2(50),

  CONSTRAINT pk_BannedChampion PRIMARY KEY (matchID, cName),

  CONSTRAINT fk1_BannedChampion FOREIGN KEY (matchID) REFERENCES Match(matchID)
    ON DELETE CASCADE,
  CONSTRAINT fk2_BannedChampion FOREIGN KEY (cName) REFERENCES Champion(championID)
    ON DELETE SET NULL 
);


CREATE TABLE SummonerSpell (
  ssID  VARCHAR2(50),
  cooldown INTEGER,

  CONSTRAINT pk_SummonerSpell PRIMARY KEY (ssID)
);


CREATE TABLE PlayerBuildsItems (
  matchID INTEGER,
  pName VARCHAR2(50),
  item VARCHAR2(50),
  PRIMARY KEY (matchID, pName, item),

  FOREIGN KEY (matchID) REFERENCES MATCH(matchID),

  FOREIGN KEY (pName) REFERENCES Player(playerID),
  
  FOREIGN KEY (item) REFERENCES Item(itemID)

);


CREATE TABLE AffectedPatch (
  cName VARCHAR2(50),
  patchID INTEGER,
  description VARCHAR2(50),
  patchType VARCHAR2(50),
  CONSTRAINT pk_AffectedPatch PRIMARY KEY (cName, patchID),

  CONSTRAINT fk_AffectedPatch FOREIGN KEY (cName) REFERENCES Champion(championID)
    ON DELETE CASCADE
);

CREATE TABLE PlayerPlaysChampion (
  pName VARCHAR2(50),
  cName VARCHAR2(50),
  role CHAR(10),

  CONSTRAINT pk_PlayerPlaysChampion PRIMARY KEY (pName, cName),

  CONSTRAINT fk1_PlayerPlaysChampion FOREIGN KEY (cName) REFERENCES Champion(championID)
    ON DELETE CASCADE,

  CONSTRAINT fk2_PlayerPlaysChampion FOREIGN KEY (pName) REFERENCES Player(playerID)
    ON DELETE CASCADE
);


CREATE TABLE GamePerformance (
    kills INTEGER,
    deaths INTEGER,
    assists INTEGER,
  	performance VARCHAR2(50),
    CONSTRAINT pk_gamePerformance PRIMARY KEY (kills, deaths, assists)
);


-- Data insertion statements
-- Inserting into Location Table
INSERT INTO Location (country, region) VALUES ('USA', 'NA');
INSERT INTO Location (country, region) VALUES ('Canada', 'NA');
INSERT INTO Location (country, region) VALUES ('Germany', 'EU');
INSERT INTO Location (country, region) VALUES ('France', 'EU');
INSERT INTO Location (country, region) VALUES ('South Korea', 'KR');
INSERT INTO Location (country, region) VALUES ('England', 'EU');
INSERT INTO Location (country, region) VALUES ('China', 'CN');
INSERT INTO Location (country, region) VALUES ('Nigeria', 'AF');
INSERT INTO Location (country, region) VALUES ('Pakistan', 'AP');

-- Inserting into Player Table
INSERT INTO Player (playerID, dateCreated, email, country) VALUES ('topLaneLegend', TO_DATE('2014-12-01', 'YYYY-MM-DD'), 'ses_ela@gmail.com', 'Canada');
INSERT INTO Player (playerID, dateCreated, email, country) VALUES ('DoubleLift', TO_DATE('2015-06-25', 'YYYY-MM-DD'), 'pengyilang@hotmail.com', 'Pakistan');
INSERT INTO Player (playerID, dateCreated, email, country) VALUES ('hideonbush', TO_DATE('2013-01-21', 'YYYY-MM-DD'), 'midgap@gmail.com', 'South Korea');
INSERT INTO Player (playerID, dateCreated, email, country) VALUES ('midOrFeed', TO_DATE('2016-04-20', 'YYYY-MM-DD'), 'johnsmith@hotmail.com', 'China');
INSERT INTO Player (playerID, dateCreated, email, country) VALUES ('G2Caps', TO_DATE('2014-02-15', 'YYYY-MM-DD'), 'rasmuswinther@yahoo.com', 'France');
INSERT INTO Player (playerID, dateCreated, email, country) VALUES ('Buasffs', TO_DATE('2015-03-19', 'YYYY-MM-DD'), 'simonhof@gmail.com', 'Germany');
INSERT INTO Player (playerID, dateCreated, email, country) VALUES ('theshy', TO_DATE('2017-02-20', 'YYYY-MM-DD'), 'seunglok@hotmail.com', 'Germany');
INSERT INTO Player (playerID, dateCreated, email, country) VALUES ('rekkless', TO_DATE('2018-09-18', 'YYYY-MM-DD'), 'carlmartin@gmail.com', 'Nigeria');
INSERT INTO Player (playerID, dateCreated, email, country) VALUES ('GenChovy', TO_DATE('2020-05-16', 'YYYY-MM-DD'), 'jihoon@hotmail.com', 'South Korea');
INSERT INTO Player (playerID, dateCreated, email, country) VALUES ('doinb', TO_DATE('2023-02-18', 'YYYY-MM-DD'), 'supercarry@hotmail.com', 'England');


-- Inserting into Champion Table
INSERT INTO Champion (championID, class, race) VALUES ('Garen', 'Bruiser', 'Demacia');
INSERT INTO Champion (championID, class, race) VALUES ('Caitlyn', 'Marksman', 'Piltover');
INSERT INTO Champion (championID, class, race) VALUES ('Lulu', 'Enchanter', 'Yordle');
INSERT INTO Champion (championID, class, race) VALUES ('Irelia', 'Fighter', 'Ionia');
INSERT INTO Champion (championID, class, race) VALUES ('Ahri', 'Mage', 'Ionia');
INSERT INTO Champion (championID, class, race) VALUES ('K’Sante', 'Tank', 'Nazumah');
INSERT INTO Champion (championID, class, race) VALUES ('Yasuo', 'Skirmisher', 'Ionia');
INSERT INTO Champion (championID, class, race) VALUES ('Lucian', 'Marksman', 'Demacia');
INSERT INTO Champion (championID, class, race) VALUES ('Azir', 'Mage', 'Shurima');
INSERT INTO Champion (championID, class, race) VALUES ('Talon', 'Assassin', 'Noxus');

-- Inserting into SkinCollection
INSERT INTO SkinCollection (collectionName, colour, cost) VALUES ('God-King', 'Blue', 25.00);
INSERT INTO SkinCollection (collectionName, colour, cost) VALUES ('Star Guardian', 'Pink', 90.00);
INSERT INTO SkinCollection (collectionName, colour, cost) VALUES ('Arcade', 'Purple', 250.00);
INSERT INTO SkinCollection (collectionName, colour, cost) VALUES ('High Noon', 'Orange', 10.00);
INSERT INTO SkinCollection (collectionName, colour, cost) VALUES ('Enduring Sword', 'Blue', 15.25);
INSERT INTO SkinCollection (collectionName, colour, cost) VALUES ('Warring Kingdoms', 'Gold', 500.00);
INSERT INTO SkinCollection (collectionName, colour, cost) VALUES ('Default', 'Default', 0.00);

-- Inserting into ChampionHasSkin table using default skins
INSERT INTO ChampionHasSkin (cName, skinID, collectionName) VALUES ('Garen', 'Garen001', 'Default');
INSERT INTO ChampionHasSkin (cName, skinID, collectionName) VALUES ('Caitlyn', 'Caitlyn001', 'Default');
INSERT INTO ChampionHasSkin (cName, skinID, collectionName) VALUES ('Lulu', 'Lulu001', 'Default');
INSERT INTO ChampionHasSkin (cName, skinID, collectionName) VALUES ('Irelia', 'Irelia001', 'Default');
INSERT INTO ChampionHasSkin (cName, skinID, collectionName) VALUES ('Ahri', 'Ahri001', 'Default');
INSERT INTO ChampionHasSkin (cName, skinID, collectionName) VALUES ('K''Sante', 'KSante001', 'Default');
INSERT INTO ChampionHasSkin (cName, skinID, collectionName) VALUES ('Yasuo', 'Yasuo001', 'Default');
INSERT INTO ChampionHasSkin (cName, skinID, collectionName) VALUES ('Lucian', 'Lucian001', 'Default');
INSERT INTO ChampionHasSkin (cName, skinID, collectionName) VALUES ('Azir', 'Azir001', 'Default');
INSERT INTO ChampionHasSkin (cName, skinID, collectionName) VALUES ('Talon', 'Talon001', 'Default');


-- Inserting into ChampionHasSkin table without using default skins
INSERT INTO ChampionHasSkin (cName, skinID, collectionName) VALUES ('Garen', 'Garen002', 'God-King');
INSERT INTO ChampionHasSkin (cName, skinID, collectionName) VALUES ('Garen', 'Garen003', 'High Noon');
INSERT INTO ChampionHasSkin (cName, skinID, collectionName) VALUES ('Ahri', 'Ahri002', 'Star Guardian');
INSERT INTO ChampionHasSkin (cName, skinID, collectionName) VALUES ('Yasuo', 'Yasuo002', 'Enduring Sword');
INSERT INTO ChampionHasSkin (cName, skinID, collectionName) VALUES ('Lulu', 'Lulu002', 'Star Guardian');
INSERT INTO ChampionHasSkin (cName, skinID, collectionName) VALUES ('Irelia', 'Irelia002', 'Arcade');
INSERT INTO ChampionHasSkin (cName, skinID, collectionName) VALUES ('Azir', 'Azir002', 'Warring Kingdom');


-- Inserting into Match Table
INSERT INTO Match (matchID, winningTeam, gameMode) VALUES (1, 'Blue', 'Ranked');
INSERT INTO Match (matchID, winningTeam, gameMode) VALUES (2, 'Red', 'Unrated');
INSERT INTO Match (matchID, winningTeam, gameMode) VALUES (3, 'Blue', 'Unrated');
INSERT INTO Match (matchID, winningTeam, gameMode) VALUES (4, 'Red', 'Unrated');
INSERT INTO Match (matchID, winningTeam, gameMode) VALUES (5, 'Blue', 'Ranked');


-- Inserting into AffectedPatch Table
INSERT INTO AffectedPatch (cName, patchID, description, patchType) VALUES ('Garen', 101, 'Increased base health', 'buff');
INSERT INTO AffectedPatch (cName, patchID, description, patchType) VALUES ('Caitlyn', 101, 'Reduced attack speed', 'debuff');
INSERT INTO AffectedPatch (cName, patchID, description, patchType) VALUES ('Lulu', 102, 'Improved shield strength', 'buff');
INSERT INTO AffectedPatch (cName, patchID, description, patchType) VALUES ('Irelia', 102, 'Lowered cooldown on Q', 'buff');
INSERT INTO AffectedPatch (cName, patchID, description, patchType) VALUES ('Ahri', 103, 'Increased mana cost on E', 'debuff');

-- Insert into SummonserSpell Table
INSERT INTO SummonerSpell (ssID, cooldown) VALUES ('Flash', 300);
INSERT INTO SummonerSpell (ssID, cooldown) VALUES ('Barrier', 300);
INSERT INTO SummonerSpell (ssID, cooldown) VALUES ('Ignite', 180);
INSERT INTO SummonerSpell (ssID, cooldown) VALUES ('Teleport', 360);
INSERT INTO SummonerSpell (ssID, cooldown) VALUES ('Smite', 90);
INSERT INTO SummonerSpell (ssID, cooldown) VALUES ('Heal', 240);

-- Insert into RuneFamily 
INSERT INTO RuneFamily (principal, statBonus) VALUES ('Precision', 'Attack Speed');
INSERT INTO RuneFamily (principal, statBonus) VALUES ('Domination', 'Adaptive Force');
INSERT INTO RuneFamily (principal, statBonus) VALUES ('Sorcery', 'Ability Power');
INSERT INTO RuneFamily (principal, statBonus) VALUES ('Resolve', 'Bonus Health');
INSERT INTO RuneFamily (principal, statBonus) VALUES ('Inspiration', 'Cooldown Reduction');

-- Insert into Rune Table
INSERT INTO Rune (principal, secondary) VALUES ('Precision', 'Domination');
INSERT INTO Rune (principal, secondary) VALUES ('Domination', 'Sorcery');
INSERT INTO Rune (principal, secondary) VALUES ('Sorcery', 'Inspiration');
INSERT INTO Rune (principal, secondary) VALUES ('Resolve', 'Precision');
INSERT INTO Rune (principal, secondary) VALUES ('Inspiration', 'Resolve');

-- INSERT INTO BannedChampion Table
INSERT INTO BannedChampion (matchID, cName) VALUES (1, 'Garen');
INSERT INTO BannedChampion (matchID, cName) VALUES (1, 'Irelia');
INSERT INTO BannedChampion (matchID, cName) VALUES (1, 'Ahri');
INSERT INTO BannedChampion (matchID, cName) VALUES (1, 'Lulu');
INSERT INTO BannedChampion (matchID, cName) VALUES (5, 'Garen');
INSERT INTO BannedChampion (matchID, cName) VALUES (5, 'Azir');
INSERT INTO BannedChampion (matchID, cName) VALUES (5, 'Talon');
INSERT INTO BannedChampion (matchID, cName) VALUES (5, 'Yasuo');

-- INSERT INTO ItemInfo Table
INSERT INTO ItemInfo (bonus, cost, numberOfUses, buildsInto) VALUES
			('Glory', 350, NULL, 'Mejais Soulstealer');
INSERT INTO ItemInfo (bonus, cost, numberOfUses, buildsInto) VALUES
			('Ever Rising Moon', 2900, NULL, NULL);
INSERT INTO ItemInfo (bonus, cost, numberOfUses, buildsInto) VALUES
			('Manaflow', 2900, NULL, 'Muramana');
INSERT INTO ItemInfo (bonus, cost, numberOfUses, buildsInto) VALUES
			('Drain', 500, 1, NULL);
INSERT INTO ItemInfo (bonus, cost, numberOfUses, buildsInto) VALUES
			('Immolate', 900, NULL, 'Sunfire Aegis');

-- INSERT INTO Item Table
INSERT INTO Item (itemID, bonus) VALUES ('Dark Seal', 'Glory');
INSERT INTO Item (itemID, bonus) VALUES ('Eclipse', 'Ever Rising Moon');
INSERT INTO Item (itemID, bonus) VALUES ('Manamune', 'Manaflow');
INSERT INTO Item (itemID, bonus) VALUES ('Elixir of Wraith', 'Drain');
INSERT INTO Item (itemID, bonus) VALUES ('Bami’s Cinder', 'Immolate');

-- INSERT INTO PlayerBuildsItems
INSERT INTO PlayerBuildsItems (matchID, pName, item) VALUES (1, 'theshy', 'Eclipse');
INSERT INTO PlayerBuildsItems (matchID, pName, item) VALUES (1, 'hideonbush', 'Dark Seal');
INSERT INTO PlayerBuildsItems (matchID, pName, item) VALUES (1, 'hideonbush', 'Manamune');
INSERT INTO PlayerBuildsItems (matchID, pName, item) VALUES (2, 'G2Caps', 'Elixir of Wraith');
INSERT INTO PlayerBuildsItems (matchID, pName, item) VALUES (3, 'topLaneLegend', 'Bami’s Cinder');
INSERT INTO PlayerBuildsItems (matchID, pName, item) VALUES (3, 'topLaneLegend', 'Eclipse');


-- INSERT INTO PlayerPlaysChampion
INSERT INTO PlayerPlaysChampion (pName, cName, role) VALUES ('theshy', 'Irelia', 'Top');
INSERT INTO PlayerPlaysChampion (pName, cName, role) VALUES ('hideonbush', 'Ahri', 'Mid');
INSERT INTO PlayerPlaysChampion (pName, cName, role) VALUES ('DoubleLift', 'Caitlyn', 'ADC');
INSERT INTO PlayerPlaysChampion (pName, cName, role) VALUES ('rekkless', 'Lulu', 'Support');
INSERT INTO PlayerPlaysChampion (pName, cName, role) VALUES ('doinb', 'Talon', 'Jungle');
INSERT INTO PlayerPlaysChampion (pName, cName, role) VALUES ('G2Caps', 'Azir', 'Mid');
INSERT INTO PlayerPlaysChampion (pName, cName, role) VALUES ('topLaneLegend', 'Garen', 'Top');

-- INSERT INTO PlayedIn
INSERT INTO PlayedIn (matchID, uName, cName, sName_F, sName_D, rPrincipal, rSecondary, role, team, kills, assists, deaths) 
VALUES (1, 'theshy', 'Irelia', 'Flash', 'Teleport', 'Precision', 'Domination', 'Top', 'Blue', 10, 8, 2);

INSERT INTO PlayedIn (matchID, uName, cName, sName_F, sName_D, rPrincipal, rSecondary, role, team, kills, assists, deaths) 
VALUES (1, 'hideonbush', 'Ahri', 'Flash', 'Ignite', 'Domination', 'Sorcery', 'Mid', 'Blue', 12, 9, 1);

INSERT INTO PlayedIn (matchID, uName, cName, sName_F, sName_D, rPrincipal, rSecondary, role, team, kills, assists, deaths) 
VALUES (1, 'DoubleLift', 'Caitlyn', 'Flash', 'Heal', 'Precision', 'Domination', 'ADC', 'Blue', 7, 11, 0);

INSERT INTO PlayedIn (matchID, uName, cName, sName_F, sName_D, rPrincipal, rSecondary, role, team, kills, assists, deaths) 
VALUES (1, 'rekkless', 'Lulu', 'Flash', 'Heal', 'Sorcery', 'Inspiration', 'Support', 'Blue', 2, 22, 5);

INSERT INTO PlayedIn (matchID, uName, cName, sName_F, sName_D, rPrincipal, rSecondary, role, team, kills, assists, deaths) 
VALUES (1, 'doinb', 'Talon', 'Flash', 'Smite', 'Domination', 'Sorcery', 'Jungle', 'Blue', 5, 4, 6);

INSERT INTO PlayedIn (matchID, uName, cName, sName_F, sName_D, rPrincipal, rSecondary, role, team, kills, assists, deaths) 
VALUES (2, 'G2Caps', 'Azir', 'Flash', 'Barrier', 'Sorcery', 'Inspiration', 'Mid', 'Red', 1, 3, 9);

-- INSERT INTO GamePerformance
-- Great: KDA >= 4.0 or 0 Deaths | Good: KDA >= 2.0 | Poor: KDA >= 1.0 | Bad: KDA < 1.0
INSERT INTO GamePerformance (kills, deaths, assists, performance) VALUES (15, 1, 5, 'Great');
INSERT INTO GamePerformance (kills, deaths, assists, performance) VALUES (10, 2, 8, 'Great');
INSERT INTO GamePerformance (kills, deaths, assists, performance) VALUES (3, 4, 25, 'Great');
INSERT INTO GamePerformance (kills, deaths, assists, performance) VALUES (8, 4, 3, 'Good');
INSERT INTO GamePerformance (kills, deaths, assists, performance) VALUES (5, 5, 2, 'Poor');
INSERT INTO GamePerformance (kills, deaths, assists, performance) VALUES (2, 7, 3, 'Bad');
