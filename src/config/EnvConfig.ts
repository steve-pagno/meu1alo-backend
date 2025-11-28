import Dotenv from 'dotenv';
import fs from 'fs';

class EnvConfig {
    public getEnvFileName(): string {
        if(fs.existsSync('.env')) {
            return '.env';
        }

        if(fs.existsSync('.env.production')) {
            return '.env.production';
        }

        return '.env.development';
    }

    public configEnv(envFileName?: string): void {
        if(!envFileName) {
            envFileName = this.getEnvFileName();
        }

        Dotenv.config({ path: envFileName });
    }
}

export default EnvConfig;
