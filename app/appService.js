const { Pool } = require("pg");
const loadEnvFile = require("./utils/envUtil");

const envVariables = loadEnvFile("./.env");

const dbConfig = {
  user: envVariables.PG_USER,
  password: envVariables.PG_PASS,
  host: envVariables.PG_HOST,
  port: envVariables.PG_PORT,
  database: envVariables.PG_DB,
  max: 3,
  idleTimeoutMillis: 60000,
};

const pool = new Pool(dbConfig);

pool.on("connect", () => {
  console.log("PostgreSQL pool connected");
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

async function closePoolAndExit() {
  console.log("\nTerminating");
  try {
    await pool.end();
    console.log("Pool closed");
    process.exit(0);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

process.once("SIGTERM", closePoolAndExit).once("SIGINT", closePoolAndExit);

async function withPostgres(action) {
  const client = await pool.connect();
  try {
    return await action(client);
  } catch (err) {
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
}

async function testPostgresConnection() {
  return await withPostgres(async (client) => {
    const res = await client.query("SELECT 1");
    return res.rowCount === 1;
  }).catch(() => false);
}

testPostgresConnection().then((ok) => {
  console.log("Postgres connection test:", ok ? "SUCCESS" : "FAIL");
});

// Fetch table data
async function fetchTableDataFromDb(tableName) {
  try {
    const result = await pool.query(`SELECT * FROM ${tableName.toLowerCase()}`);
    return result.rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}

async function fetchMatchTableDataFromDb(attributes) {
  try {
    if (!attributes || attributes.length == 0) {
      return [];
    }
    const query = `SELECT ${attributes.join(", ")} FROM match`;
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error(err);
    return;
  }
}

async function fetchPlayerTableDataFromDb(attributes) {
  try {
    if (!attributes || attributes.length == 0) {
      return [];
    }
    const query = `SELECT ${attributes.join(", ")} FROM PLAYER`;
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error(err);
    return;
  }
}

async function fetchChampionTableDataFromDb(attributes) {
  try {
    if (!attributes || attributes.length == 0) {
      return [];
    }
    const query = `SELECT ${attributes.join(", ")} FROM CHAMPION`;
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error(err);
    return;
  }
}

async function fetchPlayedInTableDataFromDb(attributes) {
  try {
    if (!attributes || attributes.length == 0) {
      return [];
    }
    const query = `SELECT ${attributes.join(", ")} FROM PLAYEDIN`;
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error(err);
    return;
  }
}

async function fetchGamePerformanceTableDataFromDb(attributes) {
  try {
    if (!attributes || attributes.length == 0) {
      return [];
    }
    const query = `SELECT ${attributes.join(", ")} FROM GAMEPERFORMANCE`;
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error(err);
    return;
  }
}

async function fetchSummonerSpellTableDataFromDb(attributes) {
  try {
    if (!attributes || attributes.length == 0) {
      return [];
    }
    const query = `SELECT ${attributes.join(", ")} FROM SUMMONERSPELL`;
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error(err);
    return;
  }
}

async function insertPlayer(playerId, country, dateCreated, email) {
  try {
    const query = `
        INSERT INTO PLAYER (playerId, country, dateCreated, email)  
        VALUES ($1, $2, $3, $4)`;
    const values = [playerId, country, dateCreated, email];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
  } catch (err) {
    console.error("Error inserting player:", err);
    return false;
  }
}

async function updatePlayer(playerID, email, dateCreated, country) {
  try {
    let query = `
      UPDATE player 
      SET email = $1, dateCreated = $2, country = $3
      WHERE playerId = $4;
      `;
    const values = [email, dateCreated, country, playerID];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
  } catch (err) {
    console.error("Error updating player:", err);
    return false;
  }
}

async function insertChampion(championId, championClass, race) {
  try {
    const query = `
        INSERT INTO champion (championId, championClass, race)  
        VALUES ($1, $2, $3, $4)
        `;
    const values = [championId, championClass, race];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
  } catch (err) {
    console.error("Error inserting champion:", err);
    return false;
  }
}

async function updateChampion(championID, championClass) {
  try {
    let query = `
      UPDATE champion
      SET championClass = $1
      WHERE championId = $2;
      `;
    const values = [championClass, championID];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
  } catch (err) {
    console.error("Error updating champion:", err);
    return false;
  }
}

async function fetchNumPlayersByRegionDataFromDb(num) {
  try {
    const query = `
    SELECT l.region, count(p.playerId) AS PlayerCount
    FROM Player p INNER JOIN Location l ON p.country = l.country
    GROUP BY l.region 
    HAVING count(p.playerId) >= $1
    ORDER BY count(p.playerId) ASC, l.region ASC
    `;
    const result = await pool.query(query, [num]);
    return result.rows;
  } catch (err) {
    console.error("Error fetching region player count", err);
    return [];
  }
}

async function fetchNumPlayersByRegionDataFromDb(num) {
  try {
    const query = `
    SELECT l.region, count(p.playerId) AS PlayerCount
    FROM Player p INNER JOIN Location l
    ON p.country = l.country
    GROUP BY l.region 
    HAVING count(p.playerId) >= $1
    ORDER BY count(p.playerId) ASC, l.region ASC
    `;
    const result = await pool.query(query, [num]);
    return result.rows;
  } catch (err) {
    console.error("Error fetching number of players by region", err);
    return [];
  }
}

async function fetchPlayerAvgKda() {
  try {
    const query = `
    SELECT p.uName, TRUNC((sum(p.kills) + sum(p.assists)) / GREATEST(1, sum(p.deaths)), 2) AS KDA
    FROM playedin p
    GROUP BY p.uName
    HAVING 1 < (SELECT COUNT(*) 
		            FROM playedin p2
		            WHERE p2.uName = p.uName)
    ORDER BY KDA DESC, p.uName ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error("Error fetching average kda by player", err);
    return [];
  }
}

async function fetchPlayersWinRate() {
  try {
    const query = `
      WITH PlayerWinCounts AS ( SELECT uName, count(*) AS winCount
                                FROM playedin pi INNER JOIN MATCH m
                                ON pi.matchid = m.matchid
                                WHERE pi.team = m.winningteam
                                GROUP BY uName)
      SELECT pwc.uName, pwc.winCount, count(pi2.matchid) AS MatchesPlayed, ROUND(pwc.winCount / count(pi2.matchid), 2) AS WinRate
      FROM playerWinCounts pwc 
      LEFT OUTER JOIN playedin pi2 ON pwc.uName = pi2.uName
      GROUP BY pwc.uName, pwc.winCount
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error("Error fetching player win rate", err);
    return [];
  }
}

async function fetchChampionBanRate() {
  try {
    const query = `
    WITH ChampBanRate AS (
						SELECT cname, ROUND(COUNT(cname)::numeric / (SELECT count(m.matchid) FROM match m WHERE m.gamemode = 'Ranked'), 2) AS BanRate 
						FROM bannedChampion bc 
						GROUP BY cname)
    SELECT * FROM ChampBanRate
    `;
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error("Error fetching champion ban rate", err);
    return [];
  }
}

async function joinPlayersPlayedIn(playerID) {
  try {
    const query = `
    SELECT p.playerID, m.matchID, m.cname, m.kills, m.assists, m.deaths
    FROM player p, playedin m
    WHERE p.playerID = m.uName AND p.playerID = $1
    `;
    const result = await pool.query(query, [playerID]);
    return result.rows;
  } catch (err) {
    console.error("Error Joining Players with PlayedIn", err);
    return [];
  }
}

async function deleteSummonerSpell(ssID) {
  try {
    const query = `DELETE FROM SummonerSpell WHERE ssID = $1`;
    const result = await pool.query(query, [ssID]);
    return result.rowCount > 0;
  } catch (err) {
    console.error("Error deleting summoner spell", err);
    return false;
  }
}

async function findPlayersUseAllSS() {
  try {
    const result = await pool.query(
      `SELECT playerID FROM Player P
       WHERE NOT EXISTS
      ((SELECT ssID 
	      FROM SummonerSpell S)
	      EXCEPT
  	    (SELECT sName_F FROM PlayedIn P_i WHERE P.playerID = P_i.uName
        UNION
        SELECT sName_D FROM PlayedIn P_i WHERE P.playerID = P_i.uName))`,
    );
    return result.rows;
  } catch (err) {
    console.error(
      "Error finding all players that used all summoner spells",
      err,
    );
    return false;
  }
}

async function filterChampions(cID, cClass, cRace) {
  try {
    let query = `
    SELECT *
    FROM Champion C
    WHERE 1 = 1`;

    const values = [];
    let idx = 1;

    if (cID) {
      query += ` AND C.championID = $${idx}`;
      values.push(cID);
      idx++;
    }
    if (cClass) {
      query += ` AND C.class = $${idx}`;
      values.push(cClass);
      idx++;
    }
    if (cRace) {
      query += ` AND C.race = $${idx}`;
      values.push(cRace);
      idx++;
    }
    const result = await pool.query(query, values);
    return result.rows;
  } catch (err) {
    console.error("Error filtering champions", err);
    return [];
  }
}

module.exports = {
  pool,
  withPostgres,
  testPostgresConnection,
  insertPlayer,
  insertChampion,
  updatePlayer,
  updateChampion,
  fetchPlayerAvgKda,
  fetchPlayersWinRate,
  fetchTableDataFromDb,
  fetchChampionBanRate,
  fetchNumPlayersByRegionDataFromDb,
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
