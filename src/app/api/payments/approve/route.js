import { NextResponse } from 'next/server';
import { executeOracleQuery } from '@/lib/oracle';

export async function POST(request) {
    try {
        const body = await request.json();
        const { payment_id, enrollment_id } = body;
        
        if (!payment_id || !enrollment_id) {
            return NextResponse.json({ success: false, error: "Missing payment_id or enrollment_id" }, { status: 400 });
        }

        const plsqlBlock = `
            BEGIN
                UPDATE PAYMENT 
                SET status = 'completed', processed_date = SYSDATE
                WHERE payment_id = :1;

                UPDATE ENROLLMENT 
                SET status = 'active' 
                WHERE enrollment_id = :2;
            END;
        `;
        const binds = [payment_id, enrollment_id];
        await executeOracleQuery(plsqlBlock, binds, true);

        return NextResponse.json({ success: true, message: "Payment and enrollment successfully approved!" });
    } catch (error) {
        console.error("Failed to approve payment:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
