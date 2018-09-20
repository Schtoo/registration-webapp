module.exports = function (pool) {
  async function takeRegNumber (regPlate){
    let regList = ['CA', 'CF', 'CK', 'CW'];
    if(regPlate != ''){
      if(registrations[regPlate] === undefined){
        for(let i=0;i<regList.length;i++){
         registrations[regPlate] = 0;
         return true;
        }
      } else {
        return false;
      }
 }
} return {
  takeRegNumber
}

  }
