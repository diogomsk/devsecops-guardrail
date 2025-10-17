import http from "http";
import { readFile } from "fs/promises";
import { extname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = __filename.substring(0, __filename.lastIndexOf("/"));

const server = http.createServer(async (req, res) => {
    if (req.url === "/health") {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ ok: true }));
    }

    // serve index.html para /
    let filePath = join(__dirname, "public", "index.html");
    let contentType = "text/html; charset=utf-8";

    // (se quiser evoluir para servir outros assets, mapeie por ext)
    if (extname(filePath) === ".css") contentType = "text/css; charset=utf-8";

    try {
        const html = await readFile(filePath);
        res.writeHead(200, { "Content-Type": contentType });
        res.end(html);
    } catch {
        res.writeHead(404);
        res.end("Not found");
    }
});

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`server listening on ${port}`));
