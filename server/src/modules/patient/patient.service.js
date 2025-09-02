"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.PatientService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("typeorm");
var PatientService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PatientService = _classThis = /** @class */ (function () {
        function PatientService_1(patientRepository, patientNoteRepository, medicationRepository) {
            this.patientRepository = patientRepository;
            this.patientNoteRepository = patientNoteRepository;
            this.medicationRepository = medicationRepository;
            this.logger = new common_1.Logger(PatientService.name);
        }
        PatientService_1.prototype.create = function (createPatientDto) {
            return __awaiter(this, void 0, void 0, function () {
                var existingPatient, patient, savedPatient, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.patientRepository.findOne({
                                    where: { mrn: createPatientDto.mrn }
                                })];
                        case 1:
                            existingPatient = _a.sent();
                            if (existingPatient) {
                                throw new common_1.BadRequestException("Patient with MRN ".concat(createPatientDto.mrn, " already exists"));
                            }
                            patient = this.patientRepository.create(__assign(__assign({}, createPatientDto), { dob: new Date(createPatientDto.dob), last_admission: createPatientDto.last_admission ? new Date(createPatientDto.last_admission) : null, last_visit: createPatientDto.last_visit ? new Date(createPatientDto.last_visit) : null, medical_conditions: createPatientDto.medical_conditions || [], allergies: createPatientDto.allergies || [], status: createPatientDto.status || 'Active' }));
                            return [4 /*yield*/, this.patientRepository.save(patient)];
                        case 2:
                            savedPatient = _a.sent();
                            this.logger.log("Created patient with ID: ".concat(savedPatient.id));
                            return [2 /*return*/, savedPatient];
                        case 3:
                            error_1 = _a.sent();
                            if (error_1 instanceof common_1.BadRequestException) {
                                throw error_1;
                            }
                            this.logger.error("Failed to create patient: ".concat(error_1.message), error_1.stack);
                            throw new common_1.BadRequestException('Failed to create patient');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        PatientService_1.prototype.findAll = function (department_1, search_1) {
            return __awaiter(this, arguments, void 0, function (department, search, limit, offset) {
                var where, searchConditions, _a, patients_1, total_1, _b, patients, total, error_2;
                if (limit === void 0) { limit = 50; }
                if (offset === void 0) { offset = 0; }
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 4, , 5]);
                            where = {};
                            if (department) {
                                where.department = department;
                            }
                            if (!search) return [3 /*break*/, 2];
                            searchConditions = [
                                __assign(__assign({}, where), { first_name: (0, typeorm_1.Like)("%".concat(search, "%")) }),
                                __assign(__assign({}, where), { last_name: (0, typeorm_1.Like)("%".concat(search, "%")) }),
                                __assign(__assign({}, where), { mrn: (0, typeorm_1.Like)("%".concat(search, "%")) }),
                                __assign(__assign({}, where), { email: (0, typeorm_1.Like)("%".concat(search, "%")) })
                            ];
                            return [4 /*yield*/, this.patientRepository.findAndCount({
                                    where: searchConditions,
                                    relations: ['vital_signs', 'notes_history', 'medications'],
                                    order: { created_at: 'DESC' },
                                    take: limit,
                                    skip: offset
                                })];
                        case 1:
                            _a = _c.sent(), patients_1 = _a[0], total_1 = _a[1];
                            return [2 /*return*/, { patients: patients_1, total: total_1 }];
                        case 2: return [4 /*yield*/, this.patientRepository.findAndCount({
                                where: where,
                                relations: ['vital_signs', 'notes_history', 'medications'],
                                order: { created_at: 'DESC' },
                                take: limit,
                                skip: offset
                            })];
                        case 3:
                            _b = _c.sent(), patients = _b[0], total = _b[1];
                            return [2 /*return*/, { patients: patients, total: total }];
                        case 4:
                            error_2 = _c.sent();
                            this.logger.error("Failed to fetch patients: ".concat(error_2.message), error_2.stack);
                            throw new common_1.BadRequestException('Failed to fetch patients');
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        PatientService_1.prototype.findOne = function (id, userDepartment) {
            return __awaiter(this, void 0, void 0, function () {
                var patient, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.patientRepository.findOne({
                                    where: { id: id },
                                    relations: ['vital_signs', 'notes_history', 'medications']
                                })];
                        case 1:
                            patient = _a.sent();
                            if (!patient) {
                                throw new common_1.NotFoundException("Patient with ID ".concat(id, " not found"));
                            }
                            // Check department access for non-admin users
                            if (userDepartment && patient.department !== userDepartment) {
                                throw new common_1.ForbiddenException("Access denied. Patient belongs to ".concat(patient.department, " department"));
                            }
                            return [2 /*return*/, patient];
                        case 2:
                            error_3 = _a.sent();
                            if (error_3 instanceof common_1.NotFoundException || error_3 instanceof common_1.ForbiddenException) {
                                throw error_3;
                            }
                            this.logger.error("Failed to fetch patient ".concat(id, ": ").concat(error_3.message), error_3.stack);
                            throw new common_1.BadRequestException('Failed to fetch patient');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        PatientService_1.prototype.update = function (id, updatePatientDto, userDepartment) {
            return __awaiter(this, void 0, void 0, function () {
                var patient, updatedPatient, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.findOne(id, userDepartment)];
                        case 1:
                            patient = _a.sent();
                            // Update the patient
                            Object.assign(patient, __assign(__assign({}, updatePatientDto), { dob: updatePatientDto.dob ? new Date(updatePatientDto.dob) : patient.dob, last_admission: updatePatientDto.last_admission ? new Date(updatePatientDto.last_admission) : patient.last_admission, last_visit: updatePatientDto.last_visit ? new Date(updatePatientDto.last_visit) : patient.last_visit }));
                            return [4 /*yield*/, this.patientRepository.save(patient)];
                        case 2:
                            updatedPatient = _a.sent();
                            this.logger.log("Updated patient with ID: ".concat(updatedPatient.id));
                            return [2 /*return*/, updatedPatient];
                        case 3:
                            error_4 = _a.sent();
                            if (error_4 instanceof common_1.NotFoundException || error_4 instanceof common_1.ForbiddenException) {
                                throw error_4;
                            }
                            this.logger.error("Failed to update patient ".concat(id, ": ").concat(error_4.message), error_4.stack);
                            throw new common_1.BadRequestException('Failed to update patient');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        PatientService_1.prototype.remove = function (id, userDepartment) {
            return __awaiter(this, void 0, void 0, function () {
                var patient, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            return [4 /*yield*/, this.findOne(id, userDepartment)];
                        case 1:
                            patient = _a.sent();
                            return [4 /*yield*/, this.patientRepository.remove(patient)];
                        case 2:
                            _a.sent();
                            this.logger.log("Deleted patient with ID: ".concat(id));
                            return [3 /*break*/, 4];
                        case 3:
                            error_5 = _a.sent();
                            if (error_5 instanceof common_1.NotFoundException || error_5 instanceof common_1.ForbiddenException) {
                                throw error_5;
                            }
                            this.logger.error("Failed to delete patient ".concat(id, ": ").concat(error_5.message), error_5.stack);
                            throw new common_1.BadRequestException('Failed to delete patient');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // Medication management
        PatientService_1.prototype.addMedication = function (createMedicationDto, userDepartment) {
            return __awaiter(this, void 0, void 0, function () {
                var medication, savedMedication, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            // Verify patient exists and user has access
                            return [4 /*yield*/, this.findOne(createMedicationDto.patient_id, userDepartment)];
                        case 1:
                            // Verify patient exists and user has access
                            _a.sent();
                            medication = this.medicationRepository.create(__assign(__assign({}, createMedicationDto), { start_date: new Date(createMedicationDto.start_date), end_date: createMedicationDto.end_date ? new Date(createMedicationDto.end_date) : null, status: createMedicationDto.status || 'Active' }));
                            return [4 /*yield*/, this.medicationRepository.save(medication)];
                        case 2:
                            savedMedication = _a.sent();
                            this.logger.log("Added medication for patient ".concat(createMedicationDto.patient_id));
                            return [2 /*return*/, savedMedication];
                        case 3:
                            error_6 = _a.sent();
                            if (error_6 instanceof common_1.NotFoundException || error_6 instanceof common_1.ForbiddenException) {
                                throw error_6;
                            }
                            this.logger.error("Failed to add medication: ".concat(error_6.message), error_6.stack);
                            throw new common_1.BadRequestException('Failed to add medication');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // Patient notes management
        PatientService_1.prototype.addNote = function (createPatientNoteDto, userDepartment) {
            return __awaiter(this, void 0, void 0, function () {
                var note, savedNote, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 3, , 4]);
                            // Verify patient exists and user has access
                            return [4 /*yield*/, this.findOne(createPatientNoteDto.patient_id, userDepartment)];
                        case 1:
                            // Verify patient exists and user has access
                            _a.sent();
                            note = this.patientNoteRepository.create(createPatientNoteDto);
                            return [4 /*yield*/, this.patientNoteRepository.save(note)];
                        case 2:
                            savedNote = _a.sent();
                            this.logger.log("Added note for patient ".concat(createPatientNoteDto.patient_id));
                            return [2 /*return*/, savedNote];
                        case 3:
                            error_7 = _a.sent();
                            if (error_7 instanceof common_1.NotFoundException || error_7 instanceof common_1.ForbiddenException) {
                                throw error_7;
                            }
                            this.logger.error("Failed to add note: ".concat(error_7.message), error_7.stack);
                            throw new common_1.BadRequestException('Failed to add note');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // Analytics methods for admin dashboard
        PatientService_1.prototype.getPatientStats = function (department) {
            return __awaiter(this, void 0, void 0, function () {
                var where, totalPatients, activePatients, thirtyDaysAgo, recentAdmissions, departmentStats, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            where = {};
                            if (department) {
                                where.department = department;
                            }
                            return [4 /*yield*/, this.patientRepository.count({ where: where })];
                        case 1:
                            totalPatients = _a.sent();
                            return [4 /*yield*/, this.patientRepository.count({
                                    where: __assign(__assign({}, where), { status: 'Active' })
                                })];
                        case 2:
                            activePatients = _a.sent();
                            thirtyDaysAgo = new Date();
                            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                            return [4 /*yield*/, this.patientRepository.count({
                                    where: __assign(__assign({}, where), { last_admission: {
                                            gte: thirtyDaysAgo
                                        } })
                                })];
                        case 3:
                            recentAdmissions = _a.sent();
                            return [4 /*yield*/, this.patientRepository
                                    .createQueryBuilder('patient')
                                    .select('patient.department', 'department')
                                    .addSelect('COUNT(*)', 'count')
                                    .groupBy('patient.department')
                                    .getRawMany()];
                        case 4:
                            departmentStats = _a.sent();
                            return [2 /*return*/, {
                                    totalPatients: totalPatients,
                                    activePatients: activePatients,
                                    recentAdmissions: recentAdmissions,
                                    departmentStats: departmentStats
                                }];
                        case 5:
                            error_8 = _a.sent();
                            this.logger.error("Failed to get patient stats: ".concat(error_8.message), error_8.stack);
                            throw new common_1.BadRequestException('Failed to get patient statistics');
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        return PatientService_1;
    }());
    __setFunctionName(_classThis, "PatientService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PatientService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PatientService = _classThis;
}();
exports.PatientService = PatientService;
