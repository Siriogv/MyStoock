'use server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'user',
  password: process.env.MYSQL_PASSWORD || 'password',
  database: process.env.MYSQL_DATABASE || 'portfolio',
};

export async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database!');
    return connection;
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
    throw error;
  }
}

export async function getAllStocks() {
    const connection = await connectToDatabase();
    try {
        const [rows] = await connection.execute('SELECT * FROM stocks');
        return rows;
    } catch (error) {
        console.error('Error fetching stocks:', error);
        return [];
    } finally {
        await connection.end();
    }
}

export async function getSettings(userId: string) {
    const connection = await connectToDatabase();
    try {
        const [rows] = await connection.execute('SELECT * FROM user_settings WHERE user_id = ?', [userId]);
        // If no settings are found for the user, return default settings
        if (!rows || rows.length === 0) {
            return {
                user_id: userId,
                currency: 'EUR',
                market: 'NYSE',
                theme: 'light',
                commissionType: 'fixed',
                commissionValue: '5',
                taxRate: '26',
                language: 'en',
                nationality: 'US'
            };
        }
        return rows[0];
    } catch (error) {
        console.error('Error fetching user settings:', error);
        return null;
    } finally {
        await connection.end();
    }
}

export async function saveSettings(userId: string, settings: any) {
    const connection = await connectToDatabase();
    try {
        await connection.execute(
            'INSERT INTO user_settings (user_id, currency, market, theme, commissionType, commissionValue, taxRate, language, nationality, username, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE currency = ?, market = ?, theme = ?, commissionType = ?, commissionValue = ?, taxRate = ?, language = ?, nationality = ?, username = ?, password = ?',
            [
                userId,
                settings.currency,
                settings.market,
                settings.theme,
                settings.commissionType,
                settings.commissionValue,
                settings.taxRate,
                settings.language,
                settings.nationality,
                settings.username,
                settings.password,
                settings.currency,
                settings.market,
                settings.theme,
                settings.commissionType,
                settings.commissionValue,
                settings.taxRate,
                settings.language,
                settings.nationality,
                settings.username,
                settings.password
            ]
        );
        console.log('User settings saved successfully for user:', userId);
    } catch (error) {
        console.error('Error saving user settings:', error);
    } finally {
        await connection.end();
    }
}

export async function getMockPortfolio(): Promise<any[]> {
    const connection = await connectToDatabase();
    try {
        const [rows] = await connection.execute('SELECT * FROM mock_portfolio');
        return rows;
    } catch (error) {
        console.error('Error fetching mock portfolio:', error);
        return [];
    } finally {
        await connection.end();
    }
}

'use server';
