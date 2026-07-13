import { NextResponse } from 'next/server';
import { executeOracleQuery } from '@/lib/oracle';

// Fetch all students (GET)
export async function GET() {
    try {
        const query = `SELECT * FROM STUDENT`;
        const result = await executeOracleQuery(query);
        return NextResponse.json({ success: true, data: result.rows });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// Register a new student (POST)
export async function POST(request) {
    try {
        const body = await request.json();
        const { student_id, first_name, last_name, dob, contact_no } = body;
        
        const query = `
            INSERT INTO STUDENT (student_id, first_name, last_name, dob, contact_no) 
            VALUES (:1, :2, :3, TO_DATE(:4, 'YYYY-MM-DD'), :5)
        `;
        const binds = [student_id, first_name, last_name, dob, contact_no];
        
        await executeOracleQuery(query, binds, true);
        return NextResponse.json({ success: true, message: "Student registered successfully!" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
