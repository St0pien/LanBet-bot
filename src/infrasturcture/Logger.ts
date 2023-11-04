export class Logger {
    static success(message: string) {
        console.log(`\x1b[32m[+] | ${new Date().toISOString()} | ${message}\x1b[0m`);
    }

    static info(message: string) {
        console.log(`[*] | ${new Date().toISOString()} | ${message}`);
    }

    static warn(message: string) {
        console.log(`\x1b[34m[!] | ${new Date().toISOString()} | ${message}\x1b[0m`);
    }

    static error(message: string) {
        console.log(`\x1b[31m[-] | ${new Date().toISOString()} | ${message}\x1b[0m`);
    }
}
