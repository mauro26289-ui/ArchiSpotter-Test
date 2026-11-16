// Segmentación de texto para la síntesis de voz del dispositivo.
// Extraído sin modificar su algoritmo original.
function audioChunks(text, maxLength = 170) {
            const sentences = String(text || '').split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÜÑ])/);
            const chunks = [];
            let buffer = '';
            for (const sentence of sentences) {
                const words = sentence.trim().split(/\s+/);
                for (const word of words) {
                    if ((buffer + ' ' + word).length > maxLength && buffer) {
                        chunks.push(buffer.trim()); buffer = '';
                    }
                    buffer += (buffer ? ' ' : '') + word;
                }
            }
            if (buffer.trim()) chunks.push(buffer.trim());
            return chunks;
        }
