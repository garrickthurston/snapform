import * as db from '../../utils/dbUtils';
import sinon from 'sinon';
import mssql from 'mssql';

const { assert } = sinon;

describe('DB Utils', () => {
    let dbStub;
    let psStub;
    let psPrepareStub;
    let psUnprepareStub;
    let psInputStub;
    let consoleStub;

    beforeEach(() => {
        dbStub = sinon.stub(mssql.ConnectionPool.prototype, 'connect').resolves({});
        consoleStub = sinon.stub(console, 'log');
    });
    
    afterEach(() => {
        dbStub && dbStub.restore();
        psStub && psStub.restore();
        psPrepareStub && psPrepareStub.restore();
        psUnprepareStub && psUnprepareStub.restore();
        psInputStub && psInputStub.restore();
        consoleStub && consoleStub.restore();
    });

    describe('executeQuery', () => {
        it('should execute query with params', async () => {
            psPrepareStub = sinon.stub(mssql.PreparedStatement.prototype, 'prepare').resolves({});
            psUnprepareStub = sinon.stub(mssql.PreparedStatement.prototype, 'unprepare').resolves({});
            psInputStub = sinon.stub(mssql.PreparedStatement.prototype, 'input').resolves();
            psStub = sinon.stub(mssql.PreparedStatement.prototype, 'execute').resolves({
                recordset: [{}]
            });

            const query = `SELECT @param_1, @param_2, @param_3 FROM some_table`;
            const params = [
                { name: 'param_1', type: db.dataTypes.VarChar, value: 'param1' },
                { name: 'param_2', type: db.dataTypes.VarChar, value: 'param2' },
                { name: 'param_3', type: db.dataTypes.VarChar, value: 'param3' }
            ];

            const results = await db.executeQuery(query, params);

            assert.match(results, { recordset: [{}] });
            assert.match(psInputStub.callCount, 3);
            assert.match(psInputStub.args[0][0], 'param_1');
            assert.match(psInputStub.args[0][1], db.dataTypes.VarChar);
            assert.match(psInputStub.args[1][0], 'param_2');
            assert.match(psInputStub.args[1][1], db.dataTypes.VarChar);
            assert.match(psInputStub.args[2][0], 'param_3');
            assert.match(psInputStub.args[2][1], db.dataTypes.VarChar);
            assert.match(psPrepareStub.callCount, 1);
            assert.match(psPrepareStub.args[0][0], query);
            assert.match(psStub.callCount, 1);
            assert.match(psStub.args[0][0], {
                'param_1': 'param1',
                'param_2': 'param2',
                'param_3': 'param3'
            });
            assert.match(psUnprepareStub.callCount, 1);
        });

        it('should execute query with no params', async () => {
            psPrepareStub = sinon.stub(mssql.PreparedStatement.prototype, 'prepare').resolves({});
            psUnprepareStub = sinon.stub(mssql.PreparedStatement.prototype, 'unprepare').resolves({});
            psInputStub = sinon.stub(mssql.PreparedStatement.prototype, 'input').resolves();
            psStub = sinon.stub(mssql.PreparedStatement.prototype, 'execute').resolves({
                recordset: [{}]
            });

            const query = `SELECT 1 FROM some_table`;

            const results = await db.executeQuery(query);

            assert.match(results, { recordset: [{}] });
            assert.match(psInputStub.callCount, 0);
            assert.match(psPrepareStub.callCount, 1);
            assert.match(psPrepareStub.args[0][0], query);
            assert.match(psStub.callCount, 1);
            assert.match(psStub.args[0][0], {});
            assert.match(psUnprepareStub.callCount, 1);
        });

        it('should log if query fails and call unprepare', async () => {
            psPrepareStub = sinon.stub(mssql.PreparedStatement.prototype, 'prepare').resolves({});
            psUnprepareStub = sinon.stub(mssql.PreparedStatement.prototype, 'unprepare').resolves({});
            psInputStub = sinon.stub(mssql.PreparedStatement.prototype, 'input').resolves();
            psStub = sinon.stub(mssql.PreparedStatement.prototype, 'execute').throws();

            const query = `SELECT @param_1, @param_2, @param_3 FROM some_table`;
            const params = [
                { name: 'param_1', type: db.dataTypes.VarChar, value: 'param1' },
                { name: 'param_2', type: db.dataTypes.VarChar, value: 'param2' },
                { name: 'param_3', type: db.dataTypes.VarChar, value: 'param3' }
            ];

            let e;
            let results;
            try {
                results = await db.executeQuery(query, params);
            } catch (err) {
                e = err;
            } finally {
                assert.match(results, undefined);
                assert.match(!!e, true);
                assert.match(psInputStub.callCount, 3);
                assert.match(psInputStub.args[0][0], 'param_1');
                assert.match(psInputStub.args[0][1], db.dataTypes.VarChar);
                assert.match(psInputStub.args[1][0], 'param_2');
                assert.match(psInputStub.args[1][1], db.dataTypes.VarChar);
                assert.match(psInputStub.args[2][0], 'param_3');
                assert.match(psInputStub.args[2][1], db.dataTypes.VarChar);
                assert.match(psPrepareStub.callCount, 1);
                assert.match(psPrepareStub.args[0][0], query);
                assert.match(psStub.callCount, 1);
                assert.match(psStub.args[0][0], {
                    'param_1': 'param1',
                    'param_2': 'param2',
                    'param_3': 'param3'
                });
                assert.match(psUnprepareStub.callCount, 1);
            }
        });
    });

    describe('executeSproc', () => {
        it('should execute sproc with params', async () => {
            psInputStub = sinon.stub(mssql.Request.prototype, 'input').resolves();
            psStub = sinon.stub(mssql.Request.prototype, 'execute').resolves({
                recordset: [{}]
            });

            const query = `[app].[some_stored_procedure]`;
            const params = [
                { name: 'param_1', type: db.dataTypes.VarChar, value: 'param1' },
                { name: 'param_2', type: db.dataTypes.VarChar, value: 'param2' },
                { name: 'param_3', type: db.dataTypes.VarChar, value: 'param3' }
            ];

            const results = await db.executeSproc(query, params);

            assert.match(results, { recordset: [{}] });
            assert.match(psInputStub.callCount, 3);
            assert.match(psInputStub.args[0][0], 'param_1');
            assert.match(psInputStub.args[0][1], db.dataTypes.VarChar);
            assert.match(psInputStub.args[1][0], 'param_2');
            assert.match(psInputStub.args[1][1], db.dataTypes.VarChar);
            assert.match(psInputStub.args[2][0], 'param_3');
            assert.match(psInputStub.args[2][1], db.dataTypes.VarChar);
            assert.match(psStub.callCount, 1);
            assert.match(psStub.args[0][0], query);
        });

        it('should execute sproc without params', async () => {
            psInputStub = sinon.stub(mssql.Request.prototype, 'input').resolves();
            psStub = sinon.stub(mssql.Request.prototype, 'execute').resolves({
                recordset: [{}]
            });

            const query = `[app].[some_stored_procedure]`;

            const results = await db.executeSproc(query);

            assert.match(results, { recordset: [{}] });
            assert.match(psInputStub.callCount, 0);
            assert.match(psStub.callCount, 1);
            assert.match(psStub.args[0][0], query);
        });

        it('should throw if error', async () => {
            psInputStub = sinon.stub(mssql.Request.prototype, 'input').resolves();
            psStub = sinon.stub(mssql.Request.prototype, 'execute').throws(new Error('some message'));

            const query = `[app].[some_stored_procedure]`;

            let e;
            let results;
            try {
                results = await db.executeSproc(query);
            } catch (err) {
                e = err;
            } finally {
                assert.match(results, undefined);
                assert.match(!!e, true);
                assert.match(e.message, 'some message');
                assert.match(psInputStub.callCount, 0);
                assert.match(psStub.callCount, 1);
                assert.match(psStub.args[0][0], query);
            }
        });
    });
});
