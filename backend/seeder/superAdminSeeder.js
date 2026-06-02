import SuperAdmin from '../models/SuperAdmin.js';

const seedSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await SuperAdmin.findOne({ role: 'superadmin' });

    if (!existingSuperAdmin) {
      await SuperAdmin.create({
        name: 'Prabhas Palle',
        email: 'prabhaspalle1131@gmail.com',
        password: 'saikumar123', // Model pre-save hook will hash this
        role: 'superadmin',
        state: 'active'
      });
      console.log('Super Admin seeded successfully');
    } else {
      console.log('Super Admin already exists');
    }
  } catch (error) {
    console.error('Error seeding Super Admin:', error);
  }
};

export default seedSuperAdmin;
