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

// WORKING ON
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

async function fetchPlayersAvgKda() {
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

module.exports = {
  testOracleConnection, // 1
  fetchPlayersAvgKda,
  fetchTableDataFromDb,
  insertPlayer,
  insertChampion,

  // WORKKING ON
  fetchNumPlayersByRegionDataFromDb,
  updatePlayer,
  updateChampion,
};
