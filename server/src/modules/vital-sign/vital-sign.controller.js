"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VitalSignController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var roles_guard_1 = require("../common/guards/roles.guard");
var roles_decorator_1 = require("../common/decorators/roles.decorator");
var VitalSignController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Vital Signs'), (0, swagger_1.ApiBearerAuth)('JWT-auth'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard), (0, common_1.Controller)('vital-signs')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findByPatient_decorators;
    var _getLatestVitalSigns_decorators;
    var _getStats_decorators;
    var _findOne_decorators;
    var _update_decorators;
    var _remove_decorators;
    var VitalSignController = _classThis = /** @class */ (function () {
        function VitalSignController_1(vitalSignService) {
            this.vitalSignService = (__runInitializers(this, _instanceExtraInitializers), vitalSignService);
        }
        VitalSignController_1.prototype.create = function (createVitalSignDto, req) {
            return __awaiter(this, void 0, void 0, function () {
                var userDepartment, vitalSign;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            userDepartment = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin' ? undefined : (_b = req.user) === null || _b === void 0 ? void 0 : _b.department;
                            return [4 /*yield*/, this.vitalSignService.create(createVitalSignDto, userDepartment)];
                        case 1:
                            vitalSign = _c.sent();
                            return [2 /*return*/, {
                                    statusCode: common_1.HttpStatus.CREATED,
                                    message: 'Vital signs recorded successfully',
                                    data: vitalSign,
                                }];
                    }
                });
            });
        };
        VitalSignController_1.prototype.findByPatient = function (patientId_1) {
            return __awaiter(this, arguments, void 0, function (patientId, limit, offset, req) {
                var userDepartment, result;
                var _a, _b;
                if (limit === void 0) { limit = 20; }
                if (offset === void 0) { offset = 0; }
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            userDepartment = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin' ? undefined : (_b = req.user) === null || _b === void 0 ? void 0 : _b.department;
                            return [4 /*yield*/, this.vitalSignService.findByPatient(patientId, userDepartment, limit, offset)];
                        case 1:
                            result = _c.sent();
                            return [2 /*return*/, {
                                    statusCode: common_1.HttpStatus.OK,
                                    message: 'Vital signs retrieved successfully',
                                    data: result.vitalSigns,
                                    meta: {
                                        total: result.total,
                                        limit: limit,
                                        offset: offset,
                                        hasMore: (offset + limit) < result.total
                                    }
                                }];
                    }
                });
            });
        };
        VitalSignController_1.prototype.getLatestVitalSigns = function (patientId, req) {
            return __awaiter(this, void 0, void 0, function () {
                var userDepartment, latestVitalSigns;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            userDepartment = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin' ? undefined : (_b = req.user) === null || _b === void 0 ? void 0 : _b.department;
                            return [4 /*yield*/, this.vitalSignService.getLatestVitalSigns(patientId, userDepartment)];
                        case 1:
                            latestVitalSigns = _c.sent();
                            return [2 /*return*/, {
                                    statusCode: common_1.HttpStatus.OK,
                                    message: 'Latest vital signs retrieved successfully',
                                    data: latestVitalSigns
                                }];
                    }
                });
            });
        };
        VitalSignController_1.prototype.getStats = function (department, req) {
            return __awaiter(this, void 0, void 0, function () {
                var userDepartment, stats;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            userDepartment = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin' ? department : (_b = req.user) === null || _b === void 0 ? void 0 : _b.department;
                            return [4 /*yield*/, this.vitalSignService.getVitalSignsStats(userDepartment)];
                        case 1:
                            stats = _c.sent();
                            return [2 /*return*/, {
                                    statusCode: common_1.HttpStatus.OK,
                                    message: 'Vital signs statistics retrieved successfully',
                                    data: stats
                                }];
                    }
                });
            });
        };
        VitalSignController_1.prototype.findOne = function (id, req) {
            return __awaiter(this, void 0, void 0, function () {
                var userDepartment, vitalSign;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            userDepartment = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin' ? undefined : (_b = req.user) === null || _b === void 0 ? void 0 : _b.department;
                            return [4 /*yield*/, this.vitalSignService.findOne(id, userDepartment)];
                        case 1:
                            vitalSign = _c.sent();
                            return [2 /*return*/, {
                                    statusCode: common_1.HttpStatus.OK,
                                    message: 'Vital sign retrieved successfully',
                                    data: vitalSign
                                }];
                    }
                });
            });
        };
        VitalSignController_1.prototype.update = function (id, updateVitalSignDto, req) {
            return __awaiter(this, void 0, void 0, function () {
                var userDepartment, vitalSign;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            userDepartment = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin' ? undefined : (_b = req.user) === null || _b === void 0 ? void 0 : _b.department;
                            return [4 /*yield*/, this.vitalSignService.update(id, updateVitalSignDto, userDepartment)];
                        case 1:
                            vitalSign = _c.sent();
                            return [2 /*return*/, {
                                    statusCode: common_1.HttpStatus.OK,
                                    message: 'Vital sign updated successfully',
                                    data: vitalSign
                                }];
                    }
                });
            });
        };
        VitalSignController_1.prototype.remove = function (id, req) {
            return __awaiter(this, void 0, void 0, function () {
                var userDepartment;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            userDepartment = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'admin' ? undefined : (_b = req.user) === null || _b === void 0 ? void 0 : _b.department;
                            return [4 /*yield*/, this.vitalSignService.remove(id, userDepartment)];
                        case 1:
                            _c.sent();
                            return [2 /*return*/, {
                                    statusCode: common_1.HttpStatus.OK,
                                    message: 'Vital sign deleted successfully'
                                }];
                    }
                });
            });
        };
        return VitalSignController_1;
    }());
    __setFunctionName(_classThis, "VitalSignController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, roles_decorator_1.Roles)('admin', 'nurse'), (0, swagger_1.ApiOperation)({ summary: 'Record vital signs for a patient (Nurse access)' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Vital signs recorded successfully' }), (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied - wrong department' })];
        _findByPatient_decorators = [(0, common_1.Get)('patient/:patientId'), (0, roles_decorator_1.Roles)('admin', 'doctor', 'nurse'), (0, swagger_1.ApiOperation)({ summary: 'Get vital signs for a specific patient' }), (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Number of records to return', type: 'number' }), (0, swagger_1.ApiQuery)({ name: 'offset', required: false, description: 'Number of records to skip', type: 'number' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Vital signs retrieved successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied - wrong department' })];
        _getLatestVitalSigns_decorators = [(0, common_1.Get)('patient/:patientId/latest'), (0, roles_decorator_1.Roles)('admin', 'doctor', 'nurse'), (0, swagger_1.ApiOperation)({ summary: 'Get latest vital signs for a patient' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Latest vital signs retrieved successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Patient not found or no vital signs recorded' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied - wrong department' })];
        _getStats_decorators = [(0, common_1.Get)('stats'), (0, roles_decorator_1.Roles)('admin', 'doctor'), (0, swagger_1.ApiOperation)({ summary: 'Get vital signs statistics (Admin and Doctor access)' }), (0, swagger_1.ApiQuery)({ name: 'department', required: false, description: 'Filter stats by department' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Vital signs statistics retrieved successfully' })];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, roles_decorator_1.Roles)('admin', 'doctor', 'nurse'), (0, swagger_1.ApiOperation)({ summary: 'Get a specific vital sign record by ID' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Vital sign retrieved successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Vital sign not found' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied - wrong department' })];
        _update_decorators = [(0, common_1.Patch)(':id'), (0, roles_decorator_1.Roles)('admin', 'nurse'), (0, swagger_1.ApiOperation)({ summary: 'Update a vital sign record (Nurse access)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Vital sign updated successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Vital sign not found' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Access denied - wrong department' })];
        _remove_decorators = [(0, common_1.Delete)(':id'), (0, roles_decorator_1.Roles)('admin'), (0, swagger_1.ApiOperation)({ summary: 'Delete a vital sign record (Admin only)' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Vital sign deleted successfully' }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Vital sign not found' })];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findByPatient_decorators, { kind: "method", name: "findByPatient", static: false, private: false, access: { has: function (obj) { return "findByPatient" in obj; }, get: function (obj) { return obj.findByPatient; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getLatestVitalSigns_decorators, { kind: "method", name: "getLatestVitalSigns", static: false, private: false, access: { has: function (obj) { return "getLatestVitalSigns" in obj; }, get: function (obj) { return obj.getLatestVitalSigns; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getStats_decorators, { kind: "method", name: "getStats", static: false, private: false, access: { has: function (obj) { return "getStats" in obj; }, get: function (obj) { return obj.getStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VitalSignController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VitalSignController = _classThis;
}();
exports.VitalSignController = VitalSignController;
