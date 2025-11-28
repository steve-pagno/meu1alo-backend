import * as fs from 'fs';

interface ParamsLogInterface {
    body: any,
    params: any,
    query: any,
}

export default class GenericLogger {
    public request(path: string, userId: number | undefined, code: number, paramsLog: ParamsLogInterface, result: any): void {
        const now = new Date(Date.now());
        const date = `${now.getDay()}_${now.getMonth()}_${now.getFullYear()}`;
        const pathDir = `logs${path}/${date}`.replace(':', '');
        const fullPath = `${pathDir}/${userId}.txt`;

        let file: Buffer = Buffer.from('');
        if(fs.existsSync(fullPath)){
            file = fs.readFileSync(fullPath);
        } else {
            fs.mkdirSync(pathDir, { recursive: true });
        }

        const fileResult = file.toString() + `[${code}] - ${JSON.stringify(paramsLog)} - ${JSON.stringify(result)}\n`;

        fs.writeFileSync(fullPath, fileResult);
    }
}
