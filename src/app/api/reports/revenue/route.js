import { NextResponse } from 'next/server';
import { executeOracleQuery } from '@/lib/oracle';
import oracledb from 'oracledb';

export async function GET() {
    try {
        const query = `BEGIN :ret := get_total_revenue(); END;`;
        
        const binds = {
            ret: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
        };
        
        const result = await executeOracleQuery(query, binds);
        
        return NextResponse.json({ 
            success: true, 
            totalRevenue: result.outBinds.ret 
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
