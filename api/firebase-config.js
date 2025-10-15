// Vercel Serverless Function для віддачі Firebase config
export default function handler(req, res) {
    // CORS headers для доступу з фронтенду
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    
    // Повертаємо конфігурацію з змінних оточення
    const config = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    };
    
    // Перевірка чи всі змінні присутні
    const missingVars = Object.entries(config)
        .filter(([key, value]) => !value)
        .map(([key]) => key);
    
    if (missingVars.length > 0) {
        return res.status(500).json({
            error: 'Missing environment variables',
            missing: missingVars
        });
    }
    
    res.status(200).json(config);
}
