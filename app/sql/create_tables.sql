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
