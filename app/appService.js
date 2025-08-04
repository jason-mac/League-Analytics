const oracledb = require("oracledb");
const loadEnvFile = require("./utils/envUtil");

const envVariables = loadEnvFile("./.env");

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
  user: envVariables.ORACLE_USER,
  password: envVariables.ORACLE_PASS,
  connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
  poolMin: 1,
  poolMax: 3,
  poolIncrement: 1,
  poolTimeout: 60,
};

// initialize connection pool
async function initializeConnectionPool() {
  try {
    await oracledb.createPool(dbConfig);
    console.log("Connection pool started");
  } catch (err) {
    console.error("Initialization error: " + err.message);
  }
}

async function closePoolAndExit() {
  console.log("\nTerminating");
  try {
    await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
    console.log("Pool closed");
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

initializeConnectionPool();

process.once("SIGTERM", closePoolAndExit).once("SIGINT", closePoolAndExit);

// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
  let connection;
  try {
    connection = await oracledb.getConnection(); // Gets a connection from the default pool
    return await action(connection);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
  return await withOracleDB(async (connection) => {
    return true;
  }).catch(() => {
    return false;
  });
}

// Fetch table data
async function fetchTableDataFromDb(tableName) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(`SELECT * FROM ${tableName}`);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function fetchMatchTableDataFromDb(attributes) {
  return await withOracleDB(async (connection) => {
    if (!attributes || attributes.length == 0) {
      return [];
    }
    const query = `SELECT ${attributes.join(", ")} FROM MATCH`;
    const result = await connection.execute(query);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function fetchPlayerTableDataFromDb(attributes) {
  return await withOracleDB(async (connection) => {
    if (!attributes || attributes.length == 0) {
      return [];
    }
    const query = `SELECT ${attributes.join(", ")} FROM PLAYER`;
    const result = await connection.execute(query);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function fetchChampionTableDataFromDb(attributes) {
  return await withOracleDB(async (connection) => {
    if (!attributes || attributes.length == 0) {
      return [];
    }
    const query = `SELECT ${attributes.join(", ")} FROM CHAMPION`;
    const result = await connection.execute(query);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function fetchPlayedInTableDataFromDb(attributes) {
  return await withOracleDB(async (connection) => {
    if (!attributes || attributes.length == 0) {
      return [];
    }
    const query = `SELECT ${attributes.join(", ")} FROM PLAYEDIN`;
    const result = await connection.execute(query);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function fetchGamePerformanceTableDataFromDb(attributes) {
  return await withOracleDB(async (connection) => {
    if (!attributes || attributes.length == 0) {
      return [];
    }
    const query = `SELECT ${attributes.join(", ")} FROM GAMEPERFORMANCE`;
    const result = await connection.execute(query);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function fetchSummonerSpellTableDataFromDb(attributes) {
  return await withOracleDB(async (connection) => {
    if (!attributes || attributes.length == 0) {
      return [];
    }
    const query = `SELECT ${attributes.join(", ")} FROM SUMMONERSPELL`;
    const result = await connection.execute(query);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function insertPlayer(playerId, country, dateCreated, email) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `INSERT INTO PLAYER (playerId, country, dateCreated, email) VALUES (:playerId, :country, TO_DATE(:dateCreated, 'YYYY-MM-DD'), :email)`,
      [playerId, country, dateCreated, email],
      { autoCommit: true },
    );

    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
    return false;
  });
}

async function updatePlayer(playerId, email) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `UPDATE PLAYER SET email = :email WHERE playerID = :playerID`,
      [email, playerId],
      { autoCommit: true },
    );

    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
    return false;
  });
}

async function insertChampion(championId, championClass, race) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `INSERT INTO CHAMPION (championId, class, race) VALUES (:championId, :championClass, :race)`,
      [championId, championClass, race],
      { autoCommit: true },
    );
    console.log(championId);
    console.log(championClass);
    console.log(race);

    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
    return false;
  });
}

async function updateChampion(championID, championClass) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `UPDATE CHAMPION SET class = :championClass WHERE championId = :championID`,
      [championClass, championID],
      { autoCommit: true },
    );

    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
    return false;
  });
}

async function fetchNumPlayersByRegionDataFromDb(num) {
  console.log(num);
  return await withOracleDB(async (connection) => {
    const query = `
    SELECT l.region, count(p.playerId) AS PlayerCount
    FROM Player p INNER JOIN Location l
    ON p.country = l.country
    GROUP BY l.region 
    HAVING count(p.playerId) >= :num
    ORDER BY count(p.playerId) Asc, l.region Asc
    `;
    const result = await connection.execute(query, [num]);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function fetchNumPlayersByRegionDataFromDb(num) {
  console.log(num);
  return await withOracleDB(async (connection) => {
    const query = `
    SELECT l.region, count(p.playerId) AS PlayerCount
    FROM Player p INNER JOIN Location l
    ON p.country = l.country
    GROUP BY l.region 
    HAVING count(p.playerId) >= :num
    ORDER BY count(p.playerId) Asc, l.region Asc
    `;
    const result = await connection.execute(query, [num]);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function fetchPlayerAvgKda() {
  return await withOracleDB(async (connection) => {
    const query = `
    SELECT p.uName, TRUNC((sum(p.kills) + sum(p.assists)) / GREATEST(1, sum(p.deaths)), 2) AS KDA
    FROM playedin p
    GROUP BY p.uName
    HAVING 1 < (SELECT COUNT(*) 
		            FROM playedin p2
		            WHERE p2.uName = p.uName)
    ORDER BY KDA Desc, p.uName Asc
    `;
    const result = await connection.execute(query);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function fetchPlayersWinRate() {
  return await withOracleDB(async (connection) => {
    const query = `
  WITH PlayerWinCounts AS ( SELECT uName, count(*) AS winCount
                            FROM playedin pi INNER JOIN MATCH m
                            ON pi.matchid = m.matchid
                            WHERE pi.team = m.winningteam
                            GROUP BY uName)
  SELECT pwc.uName, pwc.winCount, count(pi2.matchid) AS MatchesPlayed, 1.0 * pwc.winCount / count(pi2.matchid) AS WinRate
  FROM playerWinCounts pwc 
  LEFT OUTER JOIN playedin pi2 ON pwc.uName = pi2.uName
  GROUP BY pwc.uName, pwc.winCount
    `;
    const result = await connection.execute(query);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function fetchChampionBanRate() {
  return await withOracleDB(async (connection) => {
    const query = `
    WITH ChampBanRate AS (
						SELECT cname, count(cname) / (SELECT count(m.matchid) FROM MATCH m WHERE m.gamemode = 'Ranked') AS BanRate 
						FROM bannedChampion bc 
						GROUP BY cname)
    SELECT * FROM champbanrate
    `;
    const result = await connection.execute(query);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function joinPlayersPlayedIn(playerID) {
  return await withOracleDB(async (connection) => {
    const query = `
    SELECT p.playerID, m.matchID, m.cname, m.kills, m.assists, m.deaths
    FROM player p, playedin m
    WHERE p.playerID = m.uName AND p.playerID = :playerID
    `;
    const result = await connection.execute(query, [playerID]);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

async function deleteSummonerSpell(ssID) {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `DELETE FROM SummonerSpell WHERE ssID = :ssID`,
      [ssID],
      { autoCommit: true },
    );
    return result.rowsAffected && result.rowsAffected > 0;
  }).catch(() => {
    return false;
  });
}

async function findPlayersUseAllSS() {
  return await withOracleDB(async (connection) => {
    const result = await connection.execute(
      `SELECT playerID FROM Player P
       WHERE NOT EXISTS
      ((SELECT ssID 
	      FROM SummonerSpell S)
	      MINUS 
  	    (SELECT sName_F FROM PlayedIn P_i WHERE P.playerID = P_i.uName
        UNION
        SELECT sName_D FROM PlayedIn P_i WHERE P.playerID = P_i.uName))`,
    );
    return result.rows;
  }).catch(() => {
    return false;
  });
}

async function filterChampions(cID, cClass, cRace) {
  return await withOracleDB(async (connection) => {
    let query = `
    SELECT *
    FROM Champion C
    WHERE 1 = 1`;

    const arg = {};

    if (cID) {
      query += ` AND C.championID = :cID`;
      arg.cID = cID;
    }
    if (cClass) {
      query += ` AND C.class = :cClass`;
      arg.cClass = cClass;
    }
    if (cRace) {
      query += ` AND C.race = :cRace`;
      arg.cRace = cRace;
    }

    const result = await connection.execute(query, arg);
    return result.rows;
  }).catch(() => {
    return [];
  });
}

module.exports = {
  testOracleConnection,
  insertPlayer,
  insertChampion,
  updatePlayer,
  updateChampion,
  fetchPlayerAvgKda,
  fetchPlayersWinRate,
  fetchTableDataFromDb,
  fetchChampionBanRate,
  fetchNumPlayersByRegionDataFromDb,
  fetchPlayersWinRate,
  joinPlayersPlayedIn,
  deleteSummonerSpell,
  findPlayersUseAllSS,
  filterChampions,
  fetchPlayerTableDataFromDb,
  fetchChampionTableDataFromDb,
  fetchPlayedInTableDataFromDb,
  fetchGamePerformanceTableDataFromDb,
  fetchMatchTableDataFromDb,
  fetchSummonerSpellTableDataFromDb,
};
