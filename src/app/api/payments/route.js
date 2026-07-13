import { NextResponse } from 'next/server';
import { executeOracleQuery } from '@/lib/oracle';

export async function POST(request) {
    try {
        const body = await request.json();
        const { payment_id, student_id, course_id, amount, payment_method } = body;
        
        if (!payment_id || !student_id || !course_id || !amount) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        // Find matching enrollment
        const enrollQuery = `
            SELECT enrollment_id FROM ENROLLMENT 
            WHERE student_id = :1 AND course_id = :2
        `;
        const enrollResult = await executeOracleQuery(enrollQuery, [student_id, course_id]);
        
        let enrollment_id;
        if (enrollResult.rows && enrollResult.rows.length > 0) {
            enrollment_id = enrollResult.rows[0].ENROLLMENT_ID;
        } else {
            // Auto-create enrollment if it doesn't exist yet
            enrollment_id = 'E' + Math.floor(1000 + Math.random() * 9000);
            const createEnroll = `
                INSERT INTO ENROLLMENT (enrollment_id, student_id, course_id, status, progress_percentage)
                VALUES (:1, :2, :3, 'active', 0)
            `;
            await executeOracleQuery(createEnroll, [enrollment_id, student_id, course_id], true);
        }
        
        const query = `
            INSERT INTO PAYMENT (payment_id, enrollment_id, amount, payment_method, status, processed_date)
            VALUES (:1, :2, :3, :4, 'completed', SYSDATE)
        `;
        const binds = [payment_id, enrollment_id, parseFloat(amount), payment_method];
        
        await executeOracleQuery(query, binds, true);
        return NextResponse.json({ success: true, message: "Payment processed and logged successfully!" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

