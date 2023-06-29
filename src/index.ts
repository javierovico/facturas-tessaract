import { createWorker } from 'tesseract.js';
import chalk from 'chalk';
import readline from 'readline';

console.log("Iniciando")
async function performOCR(imagePath: string) {
    let iniciado = false
    const worker = await createWorker({
        logger: m => {
            const progress = m.progress * 100;
            const progressBar = `${m.status} (${m.workerId})\n[${'='.repeat(progress)}${' '.repeat(100 - progress)}] ${progress.toFixed(2)}%`;
            if (!iniciado) {
                iniciado = true
            } else {
                readline.clearLine(process.stdout, 0);              // Borra la linea actual
                readline.moveCursor(process.stdout, 0, -1);     // Se mueve a la linea de arriba
                readline.clearLine(process.stdout, 0);              // Borra la linea de arriba
                readline.cursorTo(process.stdout, 0);               // Mueve el cursor al inicio de la línea
            }
            process.stdout.write(chalk.green(progressBar));
        }
    });
    await worker.loadLanguage('spa');
    await worker.initialize('spa');
    // await worker.setParameters({
    //     tessedit_char_whitelist: '0123456789',
    // });
    const result = await worker.recognize(imagePath);
    console.log("")
    console.log(result.data.text);
    await worker.terminate();
}

performOCR('/home/aldo/facturas/2023-06-27_1_1.jpg');
