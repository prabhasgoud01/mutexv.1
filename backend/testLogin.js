import mongoose from 'mongoose';

const testLogin = async () => {
  try {
    await mongoose.connect('mongodb+srv://22d41a1248_db_user:OQQmzEYDa964fZK0@cluster1.9te27xz.mongodb.net/projectmutex?appName=Cluster1');
    console.log('Connected to DB');

    const { default: Admin } = await import('./models/Admin.js');
    
    // Update test admin to have collegeName
    const admin = await Admin.findOne({ email: 'test500@mutex.com' });
    admin.collegeName = 'Test College';
    await admin.save();
    console.log('Updated admin with collegeName');

    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test500@mutex.com',
        password: 'Password123!',
        portalRole: 'admin'
      })
    });
    
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', data);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

testLogin();
