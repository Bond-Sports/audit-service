import { Injectable } from '@nestjs/common';
import * as os from 'os';
import * as child_process from 'child_process';
import { HealthCheckResponseDto } from '../types/dtos/health-check.dto';

let oldCPUTime: number = 0;
let oldCPUIdle: number = 0;

@Injectable()
export class HealthcheckService {
	private checkOsMetrics: boolean = false;

	private readonly cpuUnhealthyThresholdPercentage: number = 80;
	private readonly memoryUnhealthyThresholdPercentage: number = 80;
	private readonly diskUnhealthyThresholdMegabytes: number = 500;
	private diskPathToMonitor: string = '/';

	constructor() {
		this.checkOsMetrics = process.env.hasOwnProperty('CHECK_OS_METRICS') && process.env.CHECK_OS_METRICS === 'true';

		if (process.env.hasOwnProperty('CPU_UNHEALTHY_THRESHOLD_PERCENTAGE')) {
			this.cpuUnhealthyThresholdPercentage = parseInt(process.env.CPU_UNHEALTHY_THRESHOLD_PERCENTAGE);
		}
		if (process.env.hasOwnProperty('MEMORY_UNHEALTHY_THRESHOLD_PERCENTAGE')) {
			this.memoryUnhealthyThresholdPercentage = parseInt(process.env.MEMORY_UNHEALTHY_THRESHOLD_PERCENTAGE);
		}
		if (process.env.hasOwnProperty('DISK_UNHEALTHY_THRESHOLD_MEGABYTES')) {
			this.diskUnhealthyThresholdMegabytes = parseInt(process.env.DISK_UNHEALTHY_THRESHOLD_MEGABYTES);
		}
		if (process.env.hasOwnProperty('DISK_PATH_TO_MONITOR')) {
			this.diskPathToMonitor = process.env.DISK_PATH_TO_MONITOR;
		}
	}

	/**
	 * Returns the health of the system
	 * @returns {Promise<HealthCheckResponseDto>} - The health of the system
	 */
	public async checkHealth(): Promise<HealthCheckResponseDto> {
		if (!this.checkOsMetrics) {
			return {
				healthy: true,
			};
		}

		const cpuUsage: number = this.checkCpuUsage();
		const memoryUsage: number = this.checkMemoryUsage();
		const diskFreeSpaceInMegaBytes: number = (await this.checkDiscFreeSpaceInKilobytes()) / 1024;

		const cpuHealthy: boolean = cpuUsage < this.cpuUnhealthyThresholdPercentage;
		const memoryHealthy: boolean = memoryUsage < this.memoryUnhealthyThresholdPercentage;
		const diskHealthy: boolean = diskFreeSpaceInMegaBytes > this.diskUnhealthyThresholdMegabytes;

		return {
			healthy: cpuHealthy && memoryHealthy && diskHealthy,
			cpu: {
				usagePercentage: cpuUsage,
				healthy: cpuHealthy,
			},
			memory: {
				usagePercentage: memoryUsage,
				healthy: memoryHealthy,
			},
			disk: {
				freeSpaceInMegabytes: diskFreeSpaceInMegaBytes,
				healthy: diskHealthy,
			},
		};
	}

	private checkCpuUsage(): number {
		const cpuInfo = os.cpus();

		let totalTime: number = -oldCPUTime;
		let totalIdle: number = -oldCPUIdle;

		cpuInfo.forEach(cpu => {
			let type;
			for (type in cpu.times) {
				totalTime += cpu.times[type];
				if (type == 'idle') {
					totalIdle += cpu.times[type];
				}
			}
		});

		oldCPUTime = totalTime;
		oldCPUIdle = totalIdle;

		return 100 - Math.round((totalIdle / totalTime) * 100);
	}

	private checkMemoryUsage(): number {
		const freeMemoryInBytes = os.freemem();
		const totalMemoryInBytes = os.totalmem();

		return (freeMemoryInBytes / totalMemoryInBytes) * 100;
	}

	private checkDiscFreeSpaceInKilobytes(): Promise<number> {
		return new Promise((resolve, reject) => {
			child_process.exec(
				`df -k / | tail -n 1 | awk 'NF==1{old=$0;getline;$0=old FS $0;} {print $4}'`,
				(error, stdout) => {
					if (error) {
						reject(error);
						return;
					}

					resolve(parseInt(stdout));
				}
			);
		});
	}
}
