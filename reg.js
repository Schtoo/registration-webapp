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
  async function forTowns() {
    let cape = await pool.query("SELECT * FROM plates");
    console.log(cape.rows);
    return cape.rows;
  }

  return {
    takeRegNumber,
    resetDb,
    getRegPlate,
    forTowns
  }
}