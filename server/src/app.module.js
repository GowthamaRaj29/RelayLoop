"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var typeorm_1 = require("@nestjs/typeorm");
var auth_module_1 = require("./modules/auth/auth.module");
var user_module_1 = require("./modules/user/user.module");
var patient_module_1 = require("./modules/patient/patient.module");
var vital_sign_module_1 = require("./modules/vital-sign/vital-sign.module");
var department_module_1 = require("./modules/department/department.module");
var common_module_1 = require("./modules/common/common.module");
var supabase_module_1 = require("./modules/supabase/supabase.module");
var configuration_1 = require("./config/configuration");
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                // Configuration module
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    load: [configuration_1.default],
                    envFilePath: ['.env.local', '.env'],
                }),
                // Database connection using TypeORM with PostgreSQL (Supabase)
                typeorm_1.TypeOrmModule.forRootAsync({
                    imports: [config_1.ConfigModule],
                    useFactory: function (configService) { return ({
                        type: 'postgres',
                        url: configService.get('database.url'),
                        entities: [__dirname + '/**/*.entity{.ts,.js}'],
                        synchronize: configService.get('database.synchronize', false),
                        logging: configService.get('database.logging', false),
                        ssl: configService.get('database.ssl', true) ? {
                            rejectUnauthorized: false
                        } : false,
                        extra: {
                            connectionLimit: 10,
                        }
                    }); },
                    inject: [config_1.ConfigService],
                }),
                // Feature modules
                common_module_1.CommonModule,
                supabase_module_1.SupabaseModule,
                auth_module_1.AuthModule,
                user_module_1.UserModule,
                patient_module_1.PatientModule,
                vital_sign_module_1.VitalSignModule,
                department_module_1.DepartmentModule,
            ],
            controllers: [],
            providers: [],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
