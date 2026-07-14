import { NextResponse } from 'next/server';
import { executeOracleQuery } from '@/lib/oracle';

export async function GET() {
    try {
        const query = `
            SELECT p.payment_id, p.amount, p.processed_date, p.slip_url, e.enrollment_id,
                   s.first_name, s.last_name, c.title AS course_title
            FROM PAYMENT p
            JOIN ENROLLMENT e ON p.enrollment_id = e.enrollment_id
            JOIN STUDENT s ON e.student_id = s.student_id
            JOIN COURSE c ON e.course_id = c.course_id
            WHERE p.status = 'pending' AND p.payment_method = 'Bank Transfer'
            ORDER BY p.processed_date DESC
        `;
        const result = await executeOracleQuery(query);
        return NextResponse.json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Failed to fetch pending payments:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
