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
	log: function (level: LoggerLevelEnum, ...args: any[]): void {
		console[level](...args);
	},
	info: function (...args: any[]): void {
		console.info(...args);
	},
	error: function (...args: any[]): void {
		console.error(...args);
	},
	warn: function (...args: any[]): void {
		console.warn(...args);
	},
	warning(...args: any[]): void {
		console.warn(...args);
	},
	debug: function (...args: any[]): void {
		console.debug(...args);
	},
};
