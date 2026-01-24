import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User';

const MONGODB_URI = 'mongodb+srv://sanketdongare89:Sanket123@cluster0.ksdjupc.mongodb.net/sdevx?retryWrites=true&w=majority';

async function createDummyUser() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Check if user already exists
        const existingUser = await User.findOne({ email: 'admin@test.com' });
        if (existingUser) {
            console.log('Admin user already exists!');
            console.log('Email: admin@test.com');
            console.log('Password: admin123');
            process.exit(0);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Create admin user
        await User.create({
            name: 'Admin User',
            email: 'admin@test.com',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('✅ Admin user created successfully!');
        console.log('Email: admin@test.com');
        console.log('Password: admin123');
        console.log('Role: admin');
        console.log('\nYou can now login at http://localhost:3000/login');

        // Create regular user
        const regularPassword = await bcrypt.hash('user123', 10);
        await User.create({
            name: 'Regular User',
            email: 'user@test.com',
            password: regularPassword,
            role: 'user'
        });

        console.log('\n✅ Regular user created successfully!');
        console.log('Email: user@test.com');
        console.log('Password: user123');
        console.log('Role: user');

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createDummyUser();
