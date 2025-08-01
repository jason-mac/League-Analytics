const express = require("express");
const appService = require("./appService");

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.

// TODO: REMOVE DEBUGGING CONSOLE LOG STATEMENTS WHEN FINISHED
router.get("/check-db-connection", async (req, res) => {
  const isConnect = await appService.testOracleConnection();
  if (isConnect) {
    res.send("connected");
  } else {
    res.send("unable to connect");
  }
});

router.get("/matchtable", async (req, res) => {
  const tableContent = await appService.fetchTableDataFromDb("match");
  res.json({ data: tableContent });
});

router.get("/playertable", async (req, res) => {
  const tableContent = await appService.fetchTableDataFromDb("player");
  res.json({ data: tableContent });
});

router.get("/championtable", async (req, res) => {
  const tableContent = await appService.fetchTableDataFromDb("champion");
  res.json({ data: tableContent });
});

router.get("/playedintable", async (req, res) => {
  const tableContent = await appService.fetchTableDataFromDb("playedin");
  res.json({ data: tableContent });
});

router.get("/gameperformancetable", async (req, res) => {
  const tableContent = await appService.fetchTableDataFromDb("gameperformance");
  res.json({ data: tableContent });
});

router.get("/player-win-rate", async (req, res) => {
  const tableContent = await appService.fetchPlayersWinRate();
  res.json({ data: tableContent });
});

router.get("/champion-ban-rate", async (req, res) => {
  const tableContent = await appService.fetchChampionBanRate();
  res.json({ data: tableContent });
});

router.post("/insert-player", async (req, res) => {
  const { playerId, country, dateCreated, email } = req.body;
  const insertResult = await appService.insertPlayer(
    playerId,
    country,
    dateCreated,
    email,
  );
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/insert-champion", async (req, res) => {
  const { championId, championClass, race } = req.body;
  const insertResult = await appService.insertChampion(
    championId,
    championClass,
    race,
  );
  if (insertResult) {
    res.json({ success: true });
  } else {
    res.status(500).json({ success: false });
  }
});

router.post("/updatePlayerEmail", async (req, res) => {
  const { playerId, email } = req.body;
  const result = await appService.updatePlayer(playerId, email);

  if (result) {
    res.json({
      success: true,
    });
  } else {
    res.status(500).json({
      success: false,
    });
  }
});

router.post("/updateChampionClass", async (req, res) => {
  const { playerId, championClass } = req.body;
  const result = await appService.updateChampion(playerId, championClass);

  if (result) {
    res.json({
      success: true,
    });
  } else {
    res.status(500).json({
      success: false,
    });
  }
});

// workking on
router.get("/player-region-count-data-table", async (req, res) => {
  const num = parseInt(req.query.num) || 0;
  const result = await appService.fetchNumPlayersByRegionDataFromDb(num);
  res.json({ data: result });
});

router.get("/players-avg-kda", async (req, res) => {
  const tableContent = await appService.fetchPlayersAvgKda();
  res.json({ data: tableContent });
});

module.exports = router;
