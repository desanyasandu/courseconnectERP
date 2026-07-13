import { NextResponse } from 'next/server';
import { executeOracleQuery } from '@/lib/oracle';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;
        
        // Query to verify user credentials
        const query = `
            SELECT user_id, role, email 
            FROM USERS 
            WHERE email = :1 AND password_hash = :2 AND is_active = 1
        `;
        
        const binds = [email, password];
        const result = await executeOracleQuery(query, binds);
        
        if (result.rows && result.rows.length > 0) {
            return NextResponse.json({ 
                success: true, 
                message: "Login successful",
                user: result.rows[0] 
            });
        }
        
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
