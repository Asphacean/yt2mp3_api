const mysql = require('mysql2/promise');

// Создаем пул подключений
const pool = mysql.createPool({
    host: 'nasra.li',
    user: 'apiuser',
    password: '6Ed3Z0Az7BD1@',
    database: 'youtubemp3',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
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
