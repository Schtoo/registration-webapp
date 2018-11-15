module.exports = function (pool) {
  // Adding the registration number
  async function takeRegNumber(regPlate) {
    //console.log(regPlate);
    let whichTown = regPlate.toUpperCase().substr(0, 3).trim();
    let result = await pool.query('SELECT id FROM towns WHERE starts_with=$1', [whichTown]);
    if (result.rowCount > 0) {
      let duplicate = await pool.query('SELECT id FROM plates WHERE registration=$1', [regPlate]);
      console.log(duplicate.rows);
      if (duplicate.rowCount > 0) {
        return 'Registration number already exists';
      }
      await pool.query('INSERT INTO plates (registration, towns_id) values ($1, $2)', [regPlate, result.rows[0].id]);
      return 'Registration successfully added';
    }
    return 'No registration added';
  }
  //Getting the registration number
  async function getRegPlate() {
    let getPlates = await pool.query('SELECT * FROM plates');
    return getPlates.rows;
  }
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
  async function townFilter(regNo) {
    if (regNo === 'All') {
      let allTowns = await pool.query("SELECT registration FROM plates");
      return {
        status: "success",
        results : allTowns.rows
      }
    }else{
      let regTown = regNo.substr(0, 3).trim();
      let result = await pool.query('SELECT id FROM towns WHERE starts_with=$1', [regTown]);
      let reg = await pool.query('SELECT registration FROM plates WHERE towns_id=$1', [result.rows[0].id]);
      if(reg.rowCount > 0){
        return {
          status: "success",
          results: reg.rows
        }
        
      }else{
        return {
          status: "error",
          results: [],
          message: "No registration number for this town"
        };
      }
    } 
  }

  return {
    takeRegNumber,
    resetDb,
    getRegPlate,
    forTowns,
    townFilter
  }
}