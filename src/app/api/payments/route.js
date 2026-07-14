import { NextResponse } from 'next/server';
import { executeOracleQuery } from '@/lib/oracle';

export async function POST(request) {
    try {
        const body = await request.json();
        const { payment_id, student_id, course_id, amount, payment_method, slip_url } = body;
        
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
        const isBank = payment_method === 'Bank Transfer';
        const initialEnrollStatus = 'active';
        const initialPayStatus = isBank ? 'pending' : 'completed';

        if (enrollResult.rows && enrollResult.rows.length > 0) {
            enrollment_id = enrollResult.rows[0].ENROLLMENT_ID;
            // Update enrollment status
            const updateEnroll = `
                UPDATE ENROLLMENT 
                SET status = :1 
                WHERE enrollment_id = :2
            `;
            await executeOracleQuery(updateEnroll, [initialEnrollStatus, enrollment_id], true);
        } else {
            // Auto-create enrollment if it doesn't exist yet
            enrollment_id = 'E' + Math.floor(1000 + Math.random() * 9000);
            const createEnroll = `
                INSERT INTO ENROLLMENT (enrollment_id, student_id, course_id, status, progress_percentage)
                VALUES (:1, :2, :3, :4, 0)
            `;
            await executeOracleQuery(createEnroll, [enrollment_id, student_id, course_id, initialEnrollStatus], true);
        }
        
        const query = `
            INSERT INTO PAYMENT (payment_id, enrollment_id, amount, payment_method, status, processed_date, slip_url)
            VALUES (:1, :2, :3, :4, :5, SYSDATE, :6)
        `;
        const binds = [payment_id, enrollment_id, parseFloat(amount), payment_method, initialPayStatus, slip_url || null];
        
        await executeOracleQuery(query, binds, true);
        return NextResponse.json({ success: true, message: isBank ? "Payment slip uploaded and pending admin approval." : "Payment processed and logged successfully!" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

