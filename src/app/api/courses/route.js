import { NextResponse } from 'next/server';
import { executeOracleQuery } from '@/lib/oracle';

// Fetch all courses (GET)
export async function GET() {
    try {
        const query = `
            SELECT c.course_id, c.title, c.description, c.price, c.category, l.first_name AS lecturer_name 
            FROM COURSE c
            JOIN LECTURER l ON c.lecturer_id = l.lecturer_id
            WHERE c.is_published = 1
        `;
        const result = await executeOracleQuery(query);
        return NextResponse.json({ success: true, data: result.rows });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// Create a new course (POST)
export async function POST(request) {
    try {
        const body = await request.json();
        const { course_id, lecturer_id, title, description, price, category } = body;

        if (!course_id || !lecturer_id || !title || !description || price === undefined || price === null || price === '' || !category) {
            return NextResponse.json({ success: false, error: "All fields are required. Please fill out all fields before publishing." }, { status: 400 });
        }

        const numericPrice = Number(price);
        if (isNaN(numericPrice) || numericPrice < 0) {
            return NextResponse.json({ success: false, error: "Price must be a valid non-negative number." }, { status: 400 });
        }

        const query = `
            INSERT INTO COURSE (course_id, lecturer_id, title, description, price, category, is_published) 
            VALUES (:1, :2, :3, :4, :5, :6, 1)
        `;
        const binds = [course_id, lecturer_id, title, description, numericPrice, category];

        await executeOracleQuery(query, binds, true); // true enables auto-commit
        return NextResponse.json({ success: true, message: "Course created successfully!" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// Update an existing course (PUT)
export async function PUT(request) {
    try {
        const body = await request.json();
        const { course_id, title, description, price, category } = body;
        
        if (!course_id || !title || !description || price === undefined || price === null || price === '' || !category) {
            return NextResponse.json({ success: false, error: "All fields are required." }, { status: 400 });
        }

        const numericPrice = Number(price);
        if (isNaN(numericPrice) || numericPrice < 0) {
            return NextResponse.json({ success: false, error: "Price must be a valid non-negative number." }, { status: 400 });
        }

        const query = `
            UPDATE COURSE 
            SET title = :1, description = :2, price = :3, category = :4 
            WHERE course_id = :5
        `;
        const binds = [title, description, numericPrice, category, course_id];
        
        await executeOracleQuery(query, binds, true);
        return NextResponse.json({ success: true, message: "Course updated successfully!" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// Delete a course (DELETE)
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const course_id = searchParams.get('id');
        
        if (!course_id) throw new Error("Course ID is required");

        const query = `DELETE FROM COURSE WHERE course_id = :1`;
        await executeOracleQuery(query, [course_id], true);
        
        return NextResponse.json({ success: true, message: "Course deleted successfully!" });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

