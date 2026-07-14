import { NextResponse } from 'next/server';
import { executeOracleQuery } from '@/lib/oracle';

export async function GET() {
    try {
        const query = `
            SELECT e.enrollment_id, e.status, e.progress_percentage, 
                   s.student_id, s.first_name, s.last_name, u.username,
                   c.course_id, c.title AS course_title, c.category, c.price
            FROM ENROLLMENT e
            JOIN STUDENT s ON e.student_id = s.student_id
            JOIN USERS u ON s.user_id = u.user_id
            JOIN COURSE c ON e.course_id = c.course_id
            WHERE e.status != 'dropped'
            ORDER BY s.student_id, c.title
        `;
        const result = await executeOracleQuery(query);
        return NextResponse.json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Failed to fetch all student progress:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
