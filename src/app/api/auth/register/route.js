import { NextResponse } from 'next/server';
import { executeOracleQuery } from '@/lib/oracle';

export async function POST(request) {
    try {
        const body = await request.json();
        const { role, email, password, firstName, lastName, dob, contactNo, bio, expertiseArea } = body;

        // 1. Basic validation
        if (!role || !email || !password || !firstName || !lastName) {
            return NextResponse.json({ success: false, error: "Required fields are missing." }, { status: 400 });
        }

        const cleanRole = role.toLowerCase();
        if (cleanRole !== 'student' && cleanRole !== 'lecturer') {
            return NextResponse.json({ success: false, error: "Invalid role selected." }, { status: 400 });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ success: false, error: "Invalid email format." }, { status: 400 });
        }

        // Password validation (min 6 characters)
        if (password.length < 6) {
            return NextResponse.json({ success: false, error: "Password must be at least 6 characters long." }, { status: 400 });
        }

        // Names validation
        const nameRegex = /^[a-zA-Z\s]{2,50}$/;
        if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
            return NextResponse.json({ success: false, error: "First name and Last name must contain only letters and be 2-50 characters long." }, { status: 400 });
        }

        // Role-specific validations
        if (cleanRole === 'student') {
            if (!dob || !contactNo) {
                return NextResponse.json({ success: false, error: "Student DOB and Contact Number are required." }, { status: 400 });
            }
            // DOB check
            if (isNaN(Date.parse(dob))) {
                return NextResponse.json({ success: false, error: "Invalid date of birth." }, { status: 400 });
            }
            if (new Date(dob) > new Date()) {
                return NextResponse.json({ success: false, error: "Date of birth cannot be in the future." }, { status: 400 });
            }
            // Contact No check ( Sri Lankan / standard 9-12 digits)
            const phoneRegex = /^\d{9,12}$/;
            if (!phoneRegex.test(contactNo)) {
                return NextResponse.json({ success: false, error: "Contact number must be a valid 9-12 digit number." }, { status: 400 });
            }
        }

        // 2. Check if email already exists
        const checkEmailQuery = `SELECT COUNT(*) AS cnt FROM USERS WHERE email = :1`;
        const emailResult = await executeOracleQuery(checkEmailQuery, [email]);
        const emailCount = emailResult.rows[0].CNT || emailResult.rows[0].cnt || Object.values(emailResult.rows[0])[0];
        if (Number(emailCount) > 0) {
            return NextResponse.json({ success: false, error: "An account with this email is already registered." }, { status: 400 });
        }

        // 3. Generate a unique user ID
        let userId = '';
        let idExists = true;
        let attempts = 0;
        while (idExists && attempts < 10) {
            userId = 'U' + Math.floor(1000 + Math.random() * 9000);
            const checkIdQuery = `SELECT COUNT(*) AS cnt FROM USERS WHERE user_id = :1`;
            const idResult = await executeOracleQuery(checkIdQuery, [userId]);
            const idCount = idResult.rows[0].CNT || idResult.rows[0].cnt || Object.values(idResult.rows[0])[0];
            if (Number(idCount) === 0) {
                idExists = false;
            }
            attempts++;
        }
        if (idExists) {
            return NextResponse.json({ success: false, error: "Failed to generate a unique user ID." }, { status: 500 });
        }

        // 4. Perform atomic insertion using PL/SQL block
        if (cleanRole === 'student') {
            const plsqlBlock = `
                BEGIN
                    INSERT INTO USERS (user_id, role, email, password_hash, is_active, created_at)
                    VALUES (:1, :2, :3, :4, 1, SYSDATE);
                    
                    INSERT INTO STUDENT (student_id, first_name, last_name, dob, contact_no)
                    VALUES (:5, :6, :7, TO_DATE(:8, 'YYYY-MM-DD'), :9);
                END;
            `;
            const binds = [userId, 'student', email, password, userId, firstName, lastName, dob, contactNo];
            await executeOracleQuery(plsqlBlock, binds, true);
        } else {
            const plsqlBlock = `
                BEGIN
                    INSERT INTO USERS (user_id, role, email, password_hash, is_active, created_at)
                    VALUES (:1, :2, :3, :4, 1, SYSDATE);
                    
                    INSERT INTO LECTURER (lecturer_id, first_name, last_name, expertise_area, bio)
                    VALUES (:5, :6, :7, :8, :9);
                END;
            `;
            const binds = [userId, 'lecturer', email, password, userId, firstName, lastName, expertiseArea || null, bio || null];
            await executeOracleQuery(plsqlBlock, binds, true);
        }

        return NextResponse.json({ 
            success: true, 
            message: `${cleanRole.charAt(0).toUpperCase() + cleanRole.slice(1)} registered successfully! Please sign in.`,
            user: { USER_ID: userId, EMAIL: email, ROLE: cleanRole }
        });

    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
