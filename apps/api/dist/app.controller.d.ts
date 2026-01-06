import { AppService } from './app.service';
import type { HealthResponse } from '@projectops/shared';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    health(): HealthResponse;
    getHello(): string;
}
