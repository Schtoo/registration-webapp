module.exports = function (pool) {
  async function takeRegNumber(regPlate) {
    let regList = ['All', 'CA', 'CY', 'CK', 'CW'];
    let plateNo = regPlate;
   // console.log(plateNo);
    let whichTown = plateNo.substr(0, 3).trim();
    for(let i=0;){}
    // if (plateNo === '' || !regList.includes(whichTown)) {
    //   return 'not a valid plate';
    // }
    let result = await pool.query('SELECT * FROM plates WHERE numbers=$1', [plateNo]);
    //console.log(result);
    if (result.rowCount === 0) {
      let id = await pool.query('SELECT id FROM towns WHERE starts_with=$1', [whichTown]);
      let insert = await pool.query('INSERT INTO plates (numbers, towns_id) values ($1, $2)', [result.rows[0].id, insert.rows[0].id]);
    //  console.log(insert);
    }
    return insert;
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

  async function getRegPlate(number) {
    let getReg = await pool.query('SELECT numbers FROM plates', [number]);
    return getReg.rows;
  }

  return {
    takeRegNumber,
    getTown,
    getRegPlate
  }
}