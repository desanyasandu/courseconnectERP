import { NextResponse } from 'next/server';
import { executeOracleQuery } from '@/lib/oracle';

export async function POST(request) {
    try {
        const body = await request.json();
        const { enrollment_id } = body;
        
        if (!enrollment_id) {
            return NextResponse.json({ success: false, error: "Missing enrollment_id" }, { status: 400 });
        }

        const query = `
            UPDATE ENROLLMENT 
            SET status = 'dropped' 
            WHERE enrollment_id = :1
        `;
        await executeOracleQuery(query, [enrollment_id], true);
        
        return NextResponse.json({ success: true, message: "Successfully unenrolled from the course." });
    } catch (error) {
        console.error("Unenrollment failed:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
