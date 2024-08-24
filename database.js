const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Путь к файлу конфигурации базы данных
const configPath = path.join(__dirname, 'db_config.json');

// Чтение конфигурации из JSON файла
const dbConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Создаем пул подключений
const pool = mysql.createPool({
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    waitForConnections: dbConfig.waitForConnections,
    connectionLimit: dbConfig.connectionLimit,
    queueLimit: dbConfig.queueLimit
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
