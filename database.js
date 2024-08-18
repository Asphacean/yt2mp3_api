const mysql = require('mysql2/promise');

// Получаем данные для подключения из переменных окружения
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    waitForConnections: true,
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
    queueLimit: process.env.DB_QUEUE_LIMIT || 0
});

// Функция для выполнения запросов к базе данных
async function query(sql, params) {
    const [results, ] = await pool.query(sql, params);
    return results;
}

// Функция для закрытия всех подключений
async function closeAll() {
    await pool.end();
}

module.exports = {
    query,
    closeAll
};
