module.exports = function (pool) {
  // Adding the registration number
  async function takeRegNumber(regPlate) {
    let whichTown = regPlate.toUpperCase().substr(0, 3).trim();
   // console.log(whichTown);
    // let regex = whichTown./([c-y])\d\d\d-\d\d\d/;
    let result = await pool.query('SELECT * FROM plates WHERE registration=$1', [whichTown]);
     if (result.rowCount === 0) {
        let townId = await pool.query('SELECT id FROM towns WHERE starts_with=$1', [whichTown]);
        await pool.query('INSERT INTO plates (registration, towns_id) values ($1, $2)', [regPlate, townId.rows[0].id]);
    }
  }
    //Getting the registration number
  async function getRegPlate() {
    let getPlates = await pool.query('SELECT * FROM plates');
    return getPlates.rows;
  }

  // async function duplicate(reg) {
  //   let dupli = await getRegPlate();
  //   let makeString = JSON.stringify(dupli);
  //   return makeString.rows;
  // }
//reseting the database 
  async function resetDb() {
    let reset = await pool.query('DELETE FROM plates');
    return reset;
  }
//Filter Function for all towns
  async function forTowns() {
    let city = await pool.query("SELECT * FROM towns");
    //console.log(city.rows);
    return city.rows;
  }
//Filtering for specific town
  async function townFilter (regNo) {    
    if(regNo === 'All'){
      let allTowns = await pool.query("SELECT registration FROM plates");
      return allTowns.rows;
    } else {    
      let regTown = regNo.substr(0, 3).trim();
      let result = await pool.query('SELECT id FROM towns WHERE starts_with=$1', [regTown]);
      let reg = await pool.query('SELECT registration FROM plates WHERE towns_id=$1', [result.rows[0].id]);
      return reg.rows;
    }
  }

  return {
    takeRegNumber,
    resetDb,
    getRegPlate,
    // duplicate,
    forTowns,
    townFilter
  }
}