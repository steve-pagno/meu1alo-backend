import { readFile } from 'fs/promises';
import { HTMLTwoPDF } from 'htmltwopdf';

export default class HtmlToPdfBuffer {
    private html2pdf: HTMLTwoPDF = new HTMLTwoPDF();

    public async generate<T>(htmlPath: string, data: T): Promise<Buffer> {
        const html = await readFile(__dirname + '/../../templates/' + htmlPath + '.html','utf8');

        const pdf = await this.html2pdf.create<T>({ document: { data, html } });

        return pdf.toBuffer();
    }
}
