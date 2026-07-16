import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// We dynamically import these modules to ensure dotenv is fully configured first,
// preventing process.env variables from being undefined at import time.
async function getDbUtils() {
    const oracleModule = await import('../src/lib/oracle.js');
    const mongoModule = await import('../src/lib/mongo.js');
    return {
        executeOracleQuery: oracleModule.executeOracleQuery,
        connectMongo: mongoModule.connectMongo
    };
}

async function seedOracle(executeOracleQuery) {
    console.log('--- Starting Oracle Seeding ---');

    // 1. Insert Users (Admin, Lecturer, Student)
    console.log('Seeding USERS table...');
    const users = [
        { id: 'U001', role: 'admin', email: 'admin@courseconnect.app', pwd: '123', active: 1 },
        { id: 'U002', role: 'lecturer', email: 'lecturer@courseconnect.app', pwd: '123', active: 1 },
        { id: 'U003', role: 'student', email: 'student@courseconnect.app', pwd: '123', active: 1 }
    ];

    for (const u of users) {
        try {
            await executeOracleQuery(
                `DELETE FROM USERS WHERE user_id = :1`,
                [u.id],
                true
            );
            await executeOracleQuery(
                `INSERT INTO USERS (user_id, role, email, password_hash, is_active) VALUES (:1, :2, :3, :4, :5)`,
                [u.id, u.role, u.email, u.pwd, u.active],
                true
            );
            console.log(`Successfully seeded user: ${u.email}`);
        } catch (err) {
            console.error(`Error seeding user ${u.email}:`, err.message);
        }
    }

    // 2. Insert Lecturer Profile
    console.log('Seeding LECTURER table...');
    try {
        await executeOracleQuery(`DELETE FROM LECTURER WHERE lecturer_id IN ('U002', 'U001')`, [], true);
        await executeOracleQuery(
            `INSERT INTO LECTURER (lecturer_id, first_name, last_name) VALUES (:1, :2, :3)`,
            ['U002', 'John', 'Doe'],
            true
        );
        await executeOracleQuery(
            `INSERT INTO LECTURER (lecturer_id, first_name, last_name) VALUES (:1, :2, :3)`,
            ['U001', 'Admin', 'User'],
            true
        );
        console.log('Successfully seeded lecturer profile for U002 and U001');
    } catch (err) {
        console.error('Error seeding lecturer profile:', err.message);
    }

    // 3. Insert Student Profile
    console.log('Seeding STUDENT table...');
    try {
        await executeOracleQuery(`DELETE FROM STUDENT WHERE student_id = 'U003'`, [], true);
        await executeOracleQuery(
            `INSERT INTO STUDENT (student_id, first_name, last_name, dob, contact_no) VALUES (:1, :2, :3, TO_DATE(:4, 'YYYY-MM-DD'), :5)`,
            ['U003', 'Jane', 'Smith', '2000-05-15', '0771234567'],
            true
        );
        console.log('Successfully seeded student profile for U003');
    } catch (err) {
        console.error('Error seeding student profile:', err.message);
    }

    // 4. Insert 3 Realistic Courses
    console.log('Seeding COURSE table...');
    const courses = [
        { id: 'C001', lecturer_id: 'U002', title: 'Web Development Fundamentals', desc: 'Learn HTML, CSS, JavaScript, and Tailwind CSS.', price: 5000, cat: 'Web Development' },
        { id: 'C002', lecturer_id: 'U002', title: 'Introduction to Data Science', desc: 'Python basics, Pandas, NumPy, and data visualization.', price: 8000, cat: 'Data Science' },
        { id: 'C003', lecturer_id: 'U002', title: 'Modern UI/UX Design', desc: 'Design stunning user interfaces using Figma and Design Systems.', price: 6000, cat: 'Design' }
    ];

    for (const c of courses) {
        try {
            await executeOracleQuery(`DELETE FROM COURSE WHERE course_id = :1`, [c.id], true);
            await executeOracleQuery(
                `INSERT INTO COURSE (course_id, lecturer_id, title, description, price, category, is_published) VALUES (:1, :2, :3, :4, :5, :6, 1)`,
                [c.id, c.lecturer_id, c.title, c.desc, c.price, c.cat],
                true
            );
            console.log(`Successfully seeded course: ${c.title}`);
        } catch (err) {
            console.error(`Error seeding course ${c.title}:`, err.message);
        }
    }

    // 5. Insert Active Enrollments
    console.log('Seeding ENROLLMENT table...');
    const enrollments = [
        { id: 'E001', student_id: 'U003', course_id: 'C001', status: 'active', pct: 75 },
        { id: 'E002', student_id: 'U003', course_id: 'C002', status: 'completed', pct: 100 }
    ];

    for (const e of enrollments) {
        try {
            await executeOracleQuery(`DELETE FROM ENROLLMENT WHERE enrollment_id = :1`, [e.id], true);
            await executeOracleQuery(
                `INSERT INTO ENROLLMENT (enrollment_id, student_id, course_id, status, progress_percentage) VALUES (:1, :2, :3, :4, :5)`,
                [e.id, e.student_id, e.course_id, e.status, e.pct],
                true
            );
            console.log(`Successfully seeded enrollment: ${e.id}`);
        } catch (err) {
            console.error(`Error seeding enrollment ${e.id}:`, err.message);
        }
    }

    // 6. Insert Completed Payments
    console.log('Seeding PAYMENT table...');
    const payments = [
        { id: 'P001', enrollment_id: 'E001', amount: 5000, method: 'Credit Card', status: 'completed' },
        { id: 'P002', enrollment_id: 'E002', amount: 8000, method: 'Bank Transfer', status: 'completed' }
    ];

    for (const p of payments) {
        try {
            await executeOracleQuery(`DELETE FROM PAYMENT WHERE payment_id = :1`, [p.id], true);
            await executeOracleQuery(
                `INSERT INTO PAYMENT (payment_id, enrollment_id, amount, payment_method, status, processed_date) VALUES (:1, :2, :3, :4, :5, SYSDATE)`,
                [p.id, p.enrollment_id, p.amount, p.method, p.status],
                true
            );
            console.log(`Successfully seeded payment transaction: ${p.id}`);
        } catch (err) {
            console.error(`Error seeding payment ${p.id}:`, err.message);
        }
    }

    console.log('--- Oracle Seeding Completed ---');
}

async function seedMongo(connectMongo) {
    console.log('--- Starting MongoDB Seeding ---');
    const conn = await connectMongo();
    const db = conn.connection.db;

    // 1. Seed course_materials
    console.log('Seeding course_materials...');
    try {
        await db.collection('course_materials').deleteMany({});
        const materials = [
            { course_id: 'C001', title: 'HTML & CSS Cheatsheet', type: 'PDF', url: 'https://example.com/materials/html-css-cheatsheet.pdf' },
            { course_id: 'C001', title: 'React Hooks Guide', type: 'Slides', url: 'https://example.com/materials/react-hooks.pdf' },
            { course_id: 'C002', title: 'Pandas & NumPy Quickstart', type: 'Notebook', url: 'https://example.com/materials/pandas-quickstart.ipynb' }
        ];
        await db.collection('course_materials').insertMany(materials);
        console.log('Successfully seeded course_materials');
    } catch (err) {
        console.error('Error seeding course_materials:', err.message);
    }

    // 2. Seed student_reviews
    console.log('Seeding student_reviews...');
    try {
        await db.collection('student_reviews').deleteMany({});
        const reviews = [
            { course_id: 'C001', student_id: 'U003', rating: 5, comment: 'Amazing structure and clear examples!' },
            { course_id: 'C001', student_id: 'S999', rating: 4, comment: 'Very helpful, but could move a bit slower.' },
            { course_id: 'C002', student_id: 'U003', rating: 5, comment: 'Perfect introduction to data analytics in Python.' },
            { course_id: 'C003', student_id: 'U003', rating: 4.5, comment: 'Beautiful design guidelines explained clearly.' }
        ];
        await db.collection('student_reviews').insertMany(reviews);
        console.log('Successfully seeded student_reviews');
    } catch (err) {
        console.error('Error seeding student_reviews:', err.message);
    }

    // 3. Seed discussion_forums
    console.log('Seeding discussion_forums...');
    try {
        await db.collection('discussion_forums').deleteMany({});
        const forums = [
            {
                course_id: 'C001',
                topic: 'Getting Started with Tailwind CSS',
                posts: [
                    { student_id: 'U003', message: 'How do I add custom fonts to Tailwind config?' },
                    { student_id: 'U002', message: 'You can define them in the theme section of tailwind.config.ts!' }
                ]
            },
            {
                course_id: 'C002',
                topic: 'Setting up Jupyter Notebooks locally',
                posts: [
                    { student_id: 'U003', message: 'Is it better to use Anaconda or pip install jupyter?' },
                    { student_id: 'U002', message: 'Using miniconda or pure pip is generally recommended to keep environments clean!' }
                ]
            }
        ];
        await db.collection('discussion_forums').insertMany(forums);
        console.log('Successfully seeded discussion_forums');
    } catch (err) {
        console.error('Error seeding discussion_forums:', err.message);
    }

    console.log('--- MongoDB Seeding Completed ---');
    return conn;
}

async function run() {
    let mongoConn;
    try {
        const { executeOracleQuery, connectMongo } = await getDbUtils();
        await seedOracle(executeOracleQuery);
        mongoConn = await seedMongo(connectMongo);
        console.log('🎉 Seeding successfully completed for all databases!');
    } catch (err) {
        console.error('Seeding process failed:', err);
    } finally {
        if (mongoConn) {
            await mongoConn.connection.close();
        }
        process.exit(0);
    }
}

run();
