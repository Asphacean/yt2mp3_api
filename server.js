const express = require('express');
const ytdl = require('@distube/ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const db = require('./database');
const cors = require('cors');
const app = express();
const PORT = 3000;
const AUDIO_DIR = path.join(__dirname, 'audiofiles');
const VIDEO_DIR = path.join(__dirname, 'videofiles');

// Используем cors middleware
app.use(cors());

if (!fs.existsSync(AUDIO_DIR)) {
    fs.mkdirSync(AUDIO_DIR, { recursive: true });
}
if (!fs.existsSync(VIDEO_DIR)) {
    fs.mkdirSync(VIDEO_DIR, { recursive: true });
}

// Загрузите cookies из файла
const cookies = JSON.parse(fs.readFileSync('cookies.json'));

// Создайте агент с cookies
const agent = ytdl.createAgent(cookies);

app.get('/download-audio', async (req, res) => {
    const videoUrl = req.query.url;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (!videoUrl) {
        console.log('No URL provided by client');
        return res.status(400).send('No URL provided');
    }

    try {
        // Чекаем бд на наличие файла
        const existingFiles = await db.query(
            'SELECT file_name FROM downloads WHERE video_url = ?',
            [videoUrl]
        );
        if (existingFiles.length > 0) {
            const filePath = path.join(AUDIO_DIR, existingFiles[0].file_name);
            console.log(`File already exists, sending ${filePath}`);
            return res.download(filePath);
        }
    } catch (error) {
        console.error('Database query error:', error);
        return res.status(500).send('Database query failed');
    }

    const videoId = ytdl.getURLVideoID(videoUrl);
    const tempVideoPath = path.join(VIDEO_DIR, `temp-${videoId}.mp4`);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const tempAudioPath = path.join(AUDIO_DIR, `audio-${uniqueSuffix}.mp3`);

    console.log(`Downloading video to ${tempVideoPath}`);
    ytdl(videoUrl, {
        quality: 'highest',
        filter: format => format.hasAudio && format.hasVideo
    })
        .pipe(fs.createWriteStream(tempVideoPath))
        .on('error', (err) => {
            console.error('Error during video download:', err);
            res.status(500).send('Failed to download video');
        })
        .on('finish', () => {
            console.log(`Video downloaded to ${tempVideoPath}`);
            console.log(`Converting video to audio at ${tempAudioPath}`);
            ffmpeg(tempVideoPath)
                .output(tempAudioPath)
                .audioBitrate(192)
                .audioChannels(2)
                .on('end', async () => {
                    console.log(`Conversion complete, serving ${tempAudioPath}`);
                    res.download(tempAudioPath, async () => {
                        try {
                            await db.query(
                                'INSERT INTO downloads (client_ip, video_url, file_name, created_at) VALUES (?, ?, ?, NOW())',
                                [clientIp, videoUrl, path.basename(tempAudioPath)]
                            );
                            console.log('Database updated successfully');
                        } catch (error) {
                            console.error('Database error on insert:', error);
                        }
                        // Удаление видеофайла после конвертации
                        fs.unlink(tempVideoPath, err => {
                            if (err) {
                                console.error(`Error removing video file: ${err}`);
                            } else {
                                console.log(`Video file ${tempVideoPath} removed successfully.`);
                            }
                        });
                    });
                })
                .on('error', err => {
                    console.error('Error converting video:', err);
                    res.status(500).send('Audio conversion failed');
                })
                .run();
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});