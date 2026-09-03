import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './app/models/user.model.js';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log('Admin already exists');
            return;
        }

        const hash = await bcrypt.hash(password, 10);

        const admin = await User.create({
            name: 'Admin',
            email,
            password: hash,
            role: 'admin',
            isActive: true
        });

        console.log(`Admin created: ${admin.email}`);

    } catch (error) {
        console.error('Seed error:', error);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

seedAdmin();