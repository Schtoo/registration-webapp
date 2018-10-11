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
    it('should give you an error if no plate is added', async function (){
        let noPlates = regNumbers(pool);
        await noPlates.takeRegNumber('CJ 987-321');
        let noAddedPlate = await noPlates.takeRegNumber('CJ 987-321');
        assert.equal(noAddedPlate, 'No registration added');
    });
    beforeEach (async function(){
        await pool.query('delete from plates');
     });
    it('should add a registration number', async function (){
        let addPlate = regNumbers(pool);
        await addPlate.takeRegNumber('CA 1523')
        let regNum = await addPlate.getRegPlate();
        assert.equal(regNum[0].registration, 'CA 1523');
    });
    beforeEach (async function(){
        await pool.query('delete from plates');
     });
    it('should give you towns from cape town only', async function(){
        let fromCpt = regNumbers(pool);
        await fromCpt.takeRegNumber('CA 232 123, CA 123-123', 'CA');
        let cptReg = await fromCpt.townFilter('CA');
        assert.deepEqual(cptReg, [{ registration: 'CA 232 123, CA 123-123' }]);
    });
    beforeEach (async function(){
        await pool.query('delete from plates');
     });
     it('should give you registration numbers from Worcester', async function(){
         let fromWorcester = regNumbers(pool);
         await fromWorcester.takeRegNumber('CW 123 321, CW 321-321, CW 987256');
         let Worcester = await fromWorcester.townFilter('CW');
         assert.deepEqual(Worcester, [{registration: 'CW 123 321, CW 321-321, CW 987256'}])
     });
     beforeEach (async function(){
        await pool.query('delete from plates');
     });
     it('should give you registration numbers from Bellville', async function(){
         let fromWorcester = regNumbers(pool);
         await fromWorcester.takeRegNumber('CY 123 321, CY 321-321, CY 987256');
         let Worcester = await fromWorcester.townFilter('CY');
         assert.deepEqual(Worcester, [{registration: 'CY 123 321, CY 321-321, CY 987256'}])
     });
     beforeEach (async function(){
        await pool.query('delete from plates');
     });
     it('should give you registration numbers from Malmsebury', async function(){
         let fromWorcester = regNumbers(pool);
         await fromWorcester.takeRegNumber('CK 123 321, CK 321-543, CK 987659');
         let Worcester = await fromWorcester.townFilter('CK');
         assert.deepEqual(Worcester, [{registration: 'CK 123 321, CK 321-543, CK 987659'}]);
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