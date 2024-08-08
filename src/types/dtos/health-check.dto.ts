import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CpuStatusDto {
	@ApiProperty({ description: 'The percentage of CPU usage' })
	usagePercentage: number;

	@ApiProperty({ description: 'Indicates if the CPU usage is healthy or not' })
	healthy: boolean;
}

export class MemoryUsageDto {
	@ApiProperty({ description: 'The percentage of memory usage' })
	usagePercentage: number;

	@ApiProperty({ description: 'Indicates if the memory usage is healthy or not' })
	healthy: boolean;
}

export class DiskFreeSpaceInMegaBytesDto {
	@ApiProperty({ description: 'The amount of free space in megabytes' })
	freeSpaceInMegabytes: number;

	@ApiProperty({ description: 'Indicates if the disk free space is healthy or not' })
	healthy: boolean;
}

export class HealthCheckResponseDto {
	@ApiProperty({ description: 'Indicates if the service is healthy or not' })
	healthy: boolean;

	@ApiPropertyOptional({ description: 'CPU usage status', type: CpuStatusDto })
	cpu?: CpuStatusDto;

	@ApiPropertyOptional({ description: 'Memory usage status', type: MemoryUsageDto })
	memory?: MemoryUsageDto;

	@ApiPropertyOptional({ description: 'Disk free space status', type: DiskFreeSpaceInMegaBytesDto })
	disk?: DiskFreeSpaceInMegaBytesDto;
}
