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
    //     let noAddedPlate = await noPlates.takeRegNumber('');
    //     assert.equal(noAddedPlate, 'not a valid plate');
    // });
    it('should add a registration number', async function (){
        let doublePlate = regNumbers(pool);
        await doublePlate.takeRegNumber('ca 1523')
        let duplicateReg = await doublePlate.getRegPlate();
        assert.equal(duplicateReg[0].registration, 'ca 1523');
    });
    // it('should give you all the towns', async function (){
    //     let towns = regNumbers(pool);
    //     let allTowns = await towns.getRegPlate('CA 232 123, CY 1231, CK 213-532, CJ 97860, CW 846-615', 'CA 232 123, CY 1231, CK 213-532, CJ 97860, CW 846-61');
    //     assert.equal(allTowns, 'CA 232-123, CY 1231, CK 213-532, CJ 97860, CW 846-615');
    // });
    // it('should give you towns from cape town only', async function(){
    //     let fromCpt = regNumbers(pool);
    //     let cptReg = await fromCpt.getTown('CA 232 123');
    //     assert.equal(cptReg, 'CA 232 123', 'CA 232 123');
    // });
    after(function(){
        pool.end();
    });
});
