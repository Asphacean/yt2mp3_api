# YouTube to MP3 API

This project is a Node.js based API that allows you to download and convert YouTube videos to MP3 format. The API uses `ytdl-core` for downloading videos and `ffmpeg` for converting them into audio files. Additionally, the API stores download information in a MySQL database.

## Features

- **Download and Convert:** Download YouTube videos and convert them to MP3 format.
- **Database Integration:** Stores information about downloaded files in a MySQL database.
- **Cookies Authentication:** Uses cookies for authentication to avoid YouTube rate limits.
- **Efficient Storage:** Checks the database for existing files to avoid duplicate downloads.

## Prerequisites

- Node.js (>=14.x)
- MySQL database
- FFmpeg (installed and available in the system PATH)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Asphacean/test_api.git
   cd test_api```
2. **Install dependencies:**
   ```npm install```
3. **Set up the database:**
- Create a MySQL database and update the connection details in db_config.json.
- Example database configuration (db_config.json):
```
{
  "host": "your-host",
  "user": "your-user",
  "password": "your-password",
  "database": "your-database",
  "waitForConnections": true,
  "connectionLimit": 10,
  "queueLimit": 0
}
```
4. **Set up cookies:**
- Place your YouTube authentication cookies in a cookies.json file in the root directory. This file should be formatted as an array of cookie objects. 
You can use https://github.com/ETCExtensions/Edit-This-Cookie
5. **Run the server:**

    ```node server.js```

6. **Access the API:**
- The server will start on http://localhost:3000.
- You can use the /download-audio endpoint to download and convert YouTube videos.
  Example:
```http://localhost:3000/download-audio?url=YOUR_YOUTUBE_VIDEO_URL```

## API Endpoints
*`GET /download-audio`*
Downloads a YouTube video and converts it to MP3.

**Query Parameters:**

*`url`*: The YouTube video URL to download and convert.

**Response:**

- On success, returns the MP3 file.
- On failure, returns an appropriate error message.

## Troubleshooting
- **Database Connection Issues:** Make sure the MySQL database is running and the credentials in db_config.json are correct.
- **Cookies Expiration:** If you encounter authentication issues, ensure that the cookies in cookies.json are still valid.
- **FFmpeg Errors:** Ensure that FFmpeg is correctly installed and available in your system's PATH.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.
