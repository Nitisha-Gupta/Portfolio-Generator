const express = require('express');
const multer = require('multer');
const fs = require('fs');
const archiver = require('archiver');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 5000;


// Middleware for parsing JSON and serving static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Multer configuration for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Save portfolio HTML to a file
app.post('/save-portfolio', (req, res) => {
    const { filename, content } = req.body;

    if (!filename || !content) {
        return res.status(400).send('Filename and content are required');
    }

    const filePath = path.join(__dirname, 'portfolios', `${filename}.html`);
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error saving file');
        }
        res.send({ message: 'Portfolio saved successfully', filePath });
    });
});

// Download portfolio as a ZIP
app.post('/download-portfolio', upload.none(), (req, res) => {
    const { filename, content } = req.body;

    if (!filename || !content) {
        return res.status(400).send('Filename and content are required');
    }

    const zipPath = path.join(__dirname, 'portfolios', `${filename}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
        res.download(zipPath, `${filename}.zip`, (err) => {
            if (err) {
                console.error(err);
            }
            fs.unlinkSync(zipPath); // Clean up ZIP file
        });
    });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);
    archive.append(content, { name: `${filename}.html` });
    archive.finalize();
});

// Share portfolio to GitHub
app.post('/share-to-github', async (req, res) => {
    const { repoName, content, githubToken } = req.body;

    if (!repoName || !content || !githubToken) {
        return res.status(400).send('Repo name, content, and GitHub token are required');
    }

    try {
        // Create GitHub repository
        const createRepoResponse = await axios.post(
            'https://api.github.com/user/repos',
            { name: repoName },
            { headers: { Authorization: `token ${githubToken}` } }
        );

        const repoUrl = createRepoResponse.data.html_url;

        // Upload portfolio HTML to the repository
        const uploadFileResponse = await axios.put(
            `https://api.github.com/repos/${createRepoResponse.data.owner.login}/${repoName}/contents/index.html`,
            {
                message: 'Add portfolio',
                content: Buffer.from(content).toString('base64'),
            },
            { headers: { Authorization: `token ${githubToken}` } }
        );

        res.send({ message: 'Portfolio shared to GitHub', repoUrl });
    } catch (error) {
        console.error(error.response.data);
        res.status(500).send('Error sharing to GitHub');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

