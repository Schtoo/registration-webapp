module.exports = function (pool) {
  // Adding the registration number
  async function takeRegNumber(regPlate ) {
    let whichTown = regPlate.substr(0, 3).trim();
    let result = await pool.query('SELECT * FROM plates WHERE registration=$1', [whichTown]);
    if (result.rowCount === 0) {
      let townId = await pool.query('SELECT id FROM towns WHERE starts_with=$1', [whichTown]);
      await pool.query('INSERT INTO plates (registration, towns_id) values ($1, $2)', [regPlate, townId.rows[0].id]);
    }
  }
  //Get registration
  async function getRegPlate() {
    let getPlates = await pool.query('SELECT * FROM plates');
    return getPlates.rows;
  }
//reset database 
  async function resetDb() {
    let reset = await pool.query('DELETE FROM plates');
    return reset;
  }
//filter Functions for towns
  async function forCpt() {
    let cape = await pool.query("SELECT * FROM plates WHERE towns_id='1'");
    console.log(cape);
    return cape.rows;
  }

  async function forBellville() {
    let bell = await pool.query("SELECT * FROM plates WHERE towns_id='2'");
    return bell.rows;
  }

  async function forWorcester() {
    let worce = await pool.query("SELECT * FROM plates WHERE towns_id='3'");
    return worce.rows;
  }

  async function forMalmesbury() {
    let malmes = await pool.query("SELECT * FROM plates WHERE towns_id='4'");
    return malmes.rows;
  }

  return {
    takeRegNumber,
    resetDb,
    getRegPlate,
    forCpt,
    forBellville,
    forWorcester,
    forMalmesbury
  }
}