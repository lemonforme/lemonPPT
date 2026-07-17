import { createServer } from './server.js';

const PORT = Number(process.env.LEMONPPT_PORT ?? 5300);
const OUTPUT_DIR = process.env.LEMONPPT_OUTPUT_DIR ?? './output';

const app = createServer({ port: PORT, outputDir: OUTPUT_DIR });

app.listen(PORT, () => {
  console.log(`[lemonPPT] server running at http://127.0.0.1:${PORT}`);
  console.log(`[lemonPPT] output dir: ${OUTPUT_DIR}`);
});
