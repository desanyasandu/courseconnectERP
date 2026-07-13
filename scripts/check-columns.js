import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function check() {
    try {
        const { executeOracleQuery } = await import('../src/lib/oracle.js');
        const res = await executeOracleQuery(
            `SELECT column_name, data_type FROM user_tab_columns WHERE table_name = 'PAYMENT'`
        );
        console.log('PAYMENT columns:', res.rows);
    } catch (err) {
        console.error(err);
    }
}
check();
