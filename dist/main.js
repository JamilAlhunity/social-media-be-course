"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const logger_service_1 = require("./core/lib/logger/logger.service");
const nestjs_i18n_1 = require("nestjs-i18n");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
    });
    const logger = app.get(logger_service_1.LoggerService);
    app.useLogger(logger);
    app.useGlobalPipes(new nestjs_i18n_1.I18nValidationPipe());
    app.useGlobalFilters(new nestjs_i18n_1.I18nValidationExceptionFilter({
        detailedErrors: false,
        errorHttpStatusCode: common_1.HttpStatus.BAD_REQUEST,
    }));
    await app.listen(3000, () => {
        logger.log(`Application is running on port: ${3000} 🚀 `, 'NestApplication');
    });
}
bootstrap();
//# sourceMappingURL=main.js.map