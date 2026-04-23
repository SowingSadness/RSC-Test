import express from 'express';
import { renderToReadableStream } from '@lazarv/rsc';
import App from './App';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
  try {
    const stream = await renderToReadableStream(<App />);
    const html = await streamToString(stream);
    
    const template = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset=\"UTF-8\" />
          <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />
          <title>RSC App</title>
        </head>
        <body>
          <div id=\"root\">${html}</div>
          <script>
            (function() {
              const root = document.getElementById('root');
              // Payload hydration logic here
              console.log('RSC payload hydrated on root:', root);
            })();
          </script>
        </body>
      </html>
    `;
    
    res.send(template);
  } catch (error) {
    console.error('Error rendering:', error);
    res.status(500).send('Error rendering page');
  }
});

async function streamToString(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8');
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});