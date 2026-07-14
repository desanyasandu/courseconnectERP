import { NextResponse } from 'next/server';
import { executeOracleQuery } from '@/lib/oracle';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password, role } = body;
        
        if (!email || !password) {
            return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
        }

        // Query to verify user credentials
        const query = `
            SELECT user_id, role, email 
            FROM USERS 
            WHERE email = :1 AND password_hash = :2 AND is_active = 1
        `;
        
        const binds = [email, password];
        const result = await executeOracleQuery(query, binds);
        
        if (result.rows && result.rows.length > 0) {
            const user = result.rows[0];
            
            // Check if the selected login role matches the database role
            if (role && user.ROLE.toLowerCase() !== role.toLowerCase()) {
                return NextResponse.json({ 
                    success: false, 
                    message: `Incorrect role. This account is registered as a ${user.ROLE}.` 
                }, { status: 403 });
            }

            return NextResponse.json({ 
                success: true, 
                message: "Login successful",
                user: user 
            });
        }
        
        return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

