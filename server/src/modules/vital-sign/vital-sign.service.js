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
exports.VitalSignService = void 0;
var common_1 = require("@nestjs/common");
var VitalSignService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var VitalSignService = _classThis = /** @class */ (function () {
        function VitalSignService_1(vitalSignRepository, patientRepository) {
            this.vitalSignRepository = vitalSignRepository;
            this.patientRepository = patientRepository;
            this.logger = new common_1.Logger(VitalSignService.name);
        }
        VitalSignService_1.prototype.create = function (createVitalSignDto, userDepartment) {
            return __awaiter(this, void 0, void 0, function () {
                var patient, vitalSign, savedVitalSign, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.patientRepository.findOne({
                                    where: { id: createVitalSignDto.patient_id }
                                })];
                        case 1:
                            patient = _a.sent();
                            if (!patient) {
                                throw new common_1.NotFoundException("Patient with ID ".concat(createVitalSignDto.patient_id, " not found"));
                            }
                            // Check department access for non-admin users
                            if (userDepartment && patient.department !== userDepartment) {
                                throw new common_1.ForbiddenException("Access denied. Patient belongs to ".concat(patient.department, " department"));
                            }
                            vitalSign = this.vitalSignRepository.create(createVitalSignDto);
                            return [4 /*yield*/, this.vitalSignRepository.save(vitalSign)];
                        case 2:
                            savedVitalSign = _a.sent();
                            this.logger.log("Created vital signs for patient ".concat(createVitalSignDto.patient_id));
                            return [2 /*return*/, savedVitalSign];
                        case 3:
                            error_1 = _a.sent();
                            if (error_1 instanceof common_1.NotFoundException || error_1 instanceof common_1.ForbiddenException) {
                                throw error_1;
                            }
                            this.logger.error("Failed to create vital signs: ".concat(error_1.message), error_1.stack);
                            throw new common_1.BadRequestException('Failed to create vital signs');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        VitalSignService_1.prototype.findByPatient = function (patientId_1, userDepartment_1) {
            return __awaiter(this, arguments, void 0, function (patientId, userDepartment, limit, offset) {
                var patient, _a, vitalSigns, total, error_2;
                if (limit === void 0) { limit = 20; }
                if (offset === void 0) { offset = 0; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.patientRepository.findOne({
                                    where: { id: patientId }
                                })];
                        case 1:
                            patient = _b.sent();
                            if (!patient) {
                                throw new common_1.NotFoundException("Patient with ID ".concat(patientId, " not found"));
                            }
                            if (userDepartment && patient.department !== userDepartment) {
                                throw new common_1.ForbiddenException("Access denied. Patient belongs to ".concat(patient.department, " department"));
                            }
                            return [4 /*yield*/, this.vitalSignRepository.findAndCount({
                                    where: { patient_id: patientId },
                                    order: { recorded_at: 'DESC' },
                                    take: limit,
                                    skip: offset
                                })];
                        case 2:
                            _a = _b.sent(), vitalSigns = _a[0], total = _a[1];
                            return [2 /*return*/, { vitalSigns: vitalSigns, total: total }];
                        case 3:
                            error_2 = _b.sent();
                            if (error_2 instanceof common_1.NotFoundException || error_2 instanceof common_1.ForbiddenException) {
                                throw error_2;
                            }
                            this.logger.error("Failed to fetch vital signs: ".concat(error_2.message), error_2.stack);
                            throw new common_1.BadRequestException('Failed to fetch vital signs');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        VitalSignService_1.prototype.findOne = function (id, userDepartment) {
            return __awaiter(this, void 0, void 0, function () {
                var vitalSign, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.vitalSignRepository.findOne({
                                    where: { id: id },
                                    relations: ['patient']
                                })];
                        case 1:
                            vitalSign = _a.sent();
                            if (!vitalSign) {
                                throw new common_1.NotFoundException("Vital sign with ID ".concat(id, " not found"));
                            }
                            if (userDepartment && vitalSign.patient.department !== userDepartment) {
                                throw new common_1.ForbiddenException("Access denied. Patient belongs to ".concat(vitalSign.patient.department, " department"));
                            }
                            return [2 /*return*/, vitalSign];
                        case 2:
                            error_3 = _a.sent();
                            if (error_3 instanceof common_1.NotFoundException || error_3 instanceof common_1.ForbiddenException) {
                                throw error_3;
                            }
                            this.logger.error("Failed to fetch vital sign ".concat(id, ": ").concat(error_3.message), error_3.stack);
                            throw new common_1.BadRequestException('Failed to fetch vital sign');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        VitalSignService_1.prototype.update = function (id, updateVitalSignDto, userDepartment) {
            return __awaiter(this, void 0, void 0, function () {
                var vitalSign, updatedVitalSign, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.findOne(id, userDepartment)];
                        case 1:
                            vitalSign = _a.sent();
                            Object.assign(vitalSign, updateVitalSignDto);
                            return [4 /*yield*/, this.vitalSignRepository.save(vitalSign)];
                        case 2:
                            updatedVitalSign = _a.sent();
                            this.logger.log("Updated vital sign with ID: ".concat(id));
                            return [2 /*return*/, updatedVitalSign];
                        case 3:
                            error_4 = _a.sent();
                            if (error_4 instanceof common_1.NotFoundException || error_4 instanceof common_1.ForbiddenException) {
                                throw error_4;
                            }
                            this.logger.error("Failed to update vital sign ".concat(id, ": ").concat(error_4.message), error_4.stack);
                            throw new common_1.BadRequestException('Failed to update vital sign');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        VitalSignService_1.prototype.remove = function (id, userDepartment) {
            return __awaiter(this, void 0, void 0, function () {
                var vitalSign, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.findOne(id, userDepartment)];
                        case 1:
                            vitalSign = _a.sent();
                            return [4 /*yield*/, this.vitalSignRepository.remove(vitalSign)];
                        case 2:
                            _a.sent();
                            this.logger.log("Deleted vital sign with ID: ".concat(id));
                            return [3 /*break*/, 4];
                        case 3:
                            error_5 = _a.sent();
                            if (error_5 instanceof common_1.NotFoundException || error_5 instanceof common_1.ForbiddenException) {
                                throw error_5;
                            }
                            this.logger.error("Failed to delete vital sign ".concat(id, ": ").concat(error_5.message), error_5.stack);
                            throw new common_1.BadRequestException('Failed to delete vital sign');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // Get latest vital signs for a patient
        VitalSignService_1.prototype.getLatestVitalSigns = function (patientId, userDepartment) {
            return __awaiter(this, void 0, void 0, function () {
                var patient, latestVitalSigns, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.patientRepository.findOne({
                                    where: { id: patientId }
                                })];
                        case 1:
                            patient = _a.sent();
                            if (!patient) {
                                throw new common_1.NotFoundException("Patient with ID ".concat(patientId, " not found"));
                            }
                            if (userDepartment && patient.department !== userDepartment) {
                                throw new common_1.ForbiddenException("Access denied. Patient belongs to ".concat(patient.department, " department"));
                            }
                            return [4 /*yield*/, this.vitalSignRepository.findOne({
                                    where: { patient_id: patientId },
                                    order: { recorded_at: 'DESC' }
                                })];
                        case 2:
                            latestVitalSigns = _a.sent();
                            return [2 /*return*/, latestVitalSigns];
                        case 3:
                            error_6 = _a.sent();
                            if (error_6 instanceof common_1.NotFoundException || error_6 instanceof common_1.ForbiddenException) {
                                throw error_6;
                            }
                            this.logger.error("Failed to get latest vital signs: ".concat(error_6.message), error_6.stack);
                            throw new common_1.BadRequestException('Failed to get latest vital signs');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // Get vital signs statistics for analytics
        VitalSignService_1.prototype.getVitalSignsStats = function (department) {
            return __awaiter(this, void 0, void 0, function () {
                var where, queryBuilder, totalRecords_1, last24Hours_1, recentRecords_1, totalRecords, last24Hours, recentRecords, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 6, , 7]);
                            where = {};
                            if (!department) return [3 /*break*/, 3];
                            queryBuilder = this.vitalSignRepository
                                .createQueryBuilder('vs')
                                .leftJoin('vs.patient', 'patient')
                                .where('patient.department = :department', { department: department });
                            return [4 /*yield*/, queryBuilder.getCount()];
                        case 1:
                            totalRecords_1 = _a.sent();
                            last24Hours_1 = new Date();
                            last24Hours_1.setHours(last24Hours_1.getHours() - 24);
                            return [4 /*yield*/, queryBuilder
                                    .andWhere('vs.recorded_at >= :date', { date: last24Hours_1 })
                                    .getCount()];
                        case 2:
                            recentRecords_1 = _a.sent();
                            return [2 /*return*/, {
                                    totalRecords: totalRecords_1,
                                    recentRecords: recentRecords_1
                                }];
                        case 3: return [4 /*yield*/, this.vitalSignRepository.count()];
                        case 4:
                            totalRecords = _a.sent();
                            last24Hours = new Date();
                            last24Hours.setHours(last24Hours.getHours() - 24);
                            return [4 /*yield*/, this.vitalSignRepository.count({
                                    where: {
                                        recorded_at: {
                                            gte: last24Hours
                                        }
                                    }
                                })];
                        case 5:
                            recentRecords = _a.sent();
                            return [2 /*return*/, {
                                    totalRecords: totalRecords,
                                    recentRecords: recentRecords
                                }];
                        case 6:
                            error_7 = _a.sent();
                            this.logger.error("Failed to get vital signs stats: ".concat(error_7.message), error_7.stack);
                            throw new common_1.BadRequestException('Failed to get vital signs statistics');
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        return VitalSignService_1;
    }());
    __setFunctionName(_classThis, "VitalSignService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VitalSignService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VitalSignService = _classThis;
}();
exports.VitalSignService = VitalSignService;
