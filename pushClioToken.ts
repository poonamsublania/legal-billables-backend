require('dotenv').config();
const mongoose = require('mongoose');
const ClioTokenModel = require('./src/models/clioToken').default;

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Remove duplicate Clio token documents
    await mongoose.connection.db.collection('cliotokens').deleteMany({_id: {$ne: 'singleton'}});
    console.log('✅ Duplicate Clio token documents removed');

    // Upsert singleton token
    const tokenData = {
      clioAccessToken: '22661-xZwt28AOVSHAbjqdaN11CD4JqfCKi63snM',
      clioRefreshToken: 'Ifnh7dp10m89zgCu6OJHBnBps3McqYso0GCpFakX',
      clioTokenExpiry: 1765719675424,
      accessToken: '22223-alT5SROwh88TH2AdEEi5G9micbLEZwWw47',
      refreshToken: 'NkbidJTgKT8qGh9E7PEubz5DMg1xEiZNxS0soevK',
      expiresAt: new Date('2025-10-31T15:23:10.281Z')
    };

    const saved = await ClioTokenModel.findOneAndUpdate(
      { _id: 'singleton' },
      tokenData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log('✅ Singleton token updated:', saved);
    process.exit(0);
  } catch (e) {
    console.error('❌ Error:', e);
    process.exit(1);
  }
})();
