import { NextResponse } from 'next/server';
import { executeOracleQuery } from '@/lib/oracle';

export async function GET() {
    try {
        const query = `
            SELECT s.student_id, u.username, s.first_name, s.last_name
            FROM STUDENT s
            JOIN USERS u ON s.user_id = u.user_id
            ORDER BY s.student_id
        `;
        const result = await executeOracleQuery(query);
        return NextResponse.json({ success: true, data: result.rows });
    } catch (error) {
        console.error("Failed to fetch students list:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
