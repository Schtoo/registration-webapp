module.exports = function (pool) {
  async function takeRegNumber(regPlate ) {
    let whichTown = regPlate.substr(0, 3).trim();
    let result = await pool.query('SELECT * FROM plates WHERE registration=$1', [whichTown]);
    if (result.rowCount === 0) {
      let townId = await pool.query('SELECT id FROM towns WHERE starts_with=$1', [whichTown]);
      //console.log(townId.rows[0].id)
      await pool.query('INSERT INTO plates (registration, towns_id) values ($1, $2)', [regPlate, townId.rows[0].id]);
    }
  }

  async function getRegPlate() {
    let getPlates = await pool.query('SELECT * FROM plates');
    return getPlates.rows;
  }

  // async function getTown(pickTown) {
  //   let towns = await pool.query('SELECT FROM towns town_name, starts_with');
  //   for (let i = 0; i < towns.rowCount; i++) {
  //     let storedTowns = towns.rows[i];
  //     if (storedTowns.starts_with === pickTown) {
  //       storedTowns.selected = true;
  //     }
  //   }
  //   return towns.rows;
  // }



  return {
    takeRegNumber,
    // getTown,
    getRegPlate
  }
}