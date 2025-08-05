document.addEventListener("DOMContentLoaded", () => {
    console.log("JavaScript Loaded 🚀");

    document.getElementById("generatePreview").addEventListener("click", () => {
        const name = document.getElementById("name").value;
        const bio = document.getElementById("bio").value;
        const education = document.getElementById("education").value.split(",").map(item => `<li>${item.trim()}</li>`).join('');
        const projects = document.getElementById("projects").value.split(",").map(item => `<li>${item.trim()}</li>`).join('');

        const portfolioHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>${name}'s Portfolio</title>
                <style>
                    body {
                        font-family: 'Poppins', sans-serif;
                        background: linear-gradient(135deg, #ff7eb3, #00c9ff);
                        color: white;
                        text-align: center;
                        margin: 0;
                        padding: 20px;
                    }
                    h1 { color: white; }
                    ul { list-style-type: none; padding: 0; }
                    li { background: rgba(255,255,255,0.2); padding: 10px; border-radius: 5px; margin: 5px 0; }
                </style>
            </head>
            <body>
                <h1>${name}</h1>
                <p>${bio}</p>
                <h2>Education</h2>
                <ul>${education}</ul>
                <h2>Projects</h2>
                <ul>${projects}</ul>
            </body>
            </html>
        `;

        const iframe = document.getElementById("previewFrame");
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(portfolioHTML);
        iframeDoc.close();
    });

    document.getElementById("updatePreview").addEventListener("click", () => {
        const updatedHTML = document.getElementById("codeEditor").value;
        const iframe = document.getElementById("previewFrame");
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(updatedHTML);
        iframeDoc.close();
    });
});
