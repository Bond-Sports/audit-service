type LoggerLevelEnum = 'info' | 'error' | 'warn' | 'warning' | 'debug';

type TLogger = {
	log(level: LoggerLevelEnum, ...args: any[]): void;
	info(...args: any[]): void;
	error(...args: any[]): void;
	warn(...args: any[]): void;
	warning(...args: any[]): void;
	debug(...args: any[]): void;
};

export const Logger: TLogger = {
	log(level: LoggerLevelEnum, ...args: any[]): void {
		const now: Date = new Date();
		console[level](`[${now.toISOString()}] ${level.toUpperCase()}:`, ...args);
	},
	info(...args: any[]): void {
		this.log('info', ...args);
	},
	error(...args: any[]): void {
		this.log('error', ...args);
	},
	warn(...args: any[]): void {
		this.log('warn', ...args);
	},
	warning(...args: any[]): void {
		this.warn(...args);
	},
	debug(...args: any[]): void {
		this.log('debug', ...args);
	},
};
