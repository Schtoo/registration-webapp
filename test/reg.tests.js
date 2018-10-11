const assert = require('assert');
const regNumbers = require('../reg');
const pg = require('pg');
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:pg123@localhost:5432/reg_numbers';

const pool = new Pool ({
    connectionString
});

describe('Registrations', async function(){
    beforeEach (async function(){
         await pool.query('delete from plates');
      });
    // it('should not give you a plate', async function (){
    //     let noPlates = regNumbers(pool);
    //     await noPlates.takeRegNumber();
    //     let noAddedPlate = await noPlates.getRegPlate('')
    //     assert.equal(noAddedPlate.registration, 'not a valid plate');
    // });
    it('should add a registration number', async function (){
        let doublePlate = regNumbers(pool);
        await doublePlate.takeRegNumber('CA 1523')
        let duplicateReg = await doublePlate.getRegPlate();
        assert.equal(duplicateReg[0].registration, 'CA 1523');
    });
    it('should give you towns from cape town only', async function(){
        let fromCpt = regNumbers(pool);
        await fromCpt.forTowns(['CA 232 123', 'CA 123-123', 'CW 654321', 'CK 321 321']);
       // console.log(fromCpt);
        let cptReg = await fromCpt.townFilter(['CA 232 123', 'CA 123-123']);
       // console.log(cptReg);
        assert.equal(['CA 232 123', 'CA 123-123'], cptReg);
    });
    it('should reset the entire database', async function(){
        let resetBtn = regNumbers(pool);
        let reset = await resetBtn.resetDb();
        assert.equal(0, reset.rowCount);
    });
    after(function(){
        pool.end();
    });
});
