import { NextResponse } from 'next/server';
import { executeOracleQuery } from '@/lib/oracle';

export async function POST(request) {
    try {
        const body = await request.json();
        const { payment_id, student_id, amount, payment_method } = body;
        
        const query = `
            INSERT INTO PAYMENT (payment_id, student_id, amount, payment_method, payment_date)
            VALUES (:1, :2, :3, :4, SYSDATE)
        `;
        const binds = [payment_id, student_id, parseFloat(amount), payment_method];
        
        await executeOracleQuery(query, binds, true);
        return NextResponse.json({ success: true, message: "Payment processed and logged successfully!" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
