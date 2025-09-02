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
exports.DepartmentService = void 0;
var common_1 = require("@nestjs/common");
var DepartmentService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DepartmentService = _classThis = /** @class */ (function () {
        function DepartmentService_1() {
            this.logger = new common_1.Logger(DepartmentService.name);
        }
        DepartmentService_1.prototype.getDepartments = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    try {
                        // Return standard hospital departments
                        return [2 /*return*/, [
                                {
                                    id: 'cardiology',
                                    name: 'Cardiology',
                                    description: 'Heart and cardiovascular system care',
                                    head: 'Dr. Sarah Wilson',
                                    totalStaff: 25,
                                    activePatients: 45
                                },
                                {
                                    id: 'neurology',
                                    name: 'Neurology',
                                    description: 'Brain and nervous system care',
                                    head: 'Dr. Michael Johnson',
                                    totalStaff: 20,
                                    activePatients: 35
                                },
                                {
                                    id: 'general-medicine',
                                    name: 'General Medicine',
                                    description: 'General medical care and internal medicine',
                                    head: 'Dr. Emily Davis',
                                    totalStaff: 30,
                                    activePatients: 60
                                },
                                {
                                    id: 'pediatrics',
                                    name: 'Pediatrics',
                                    description: 'Children\'s healthcare',
                                    head: 'Dr. David Lee',
                                    totalStaff: 18,
                                    activePatients: 25
                                },
                                {
                                    id: 'oncology',
                                    name: 'Oncology',
                                    description: 'Cancer treatment and care',
                                    head: 'Dr. Jennifer Brown',
                                    totalStaff: 22,
                                    activePatients: 30
                                }
                            ]];
                    }
                    catch (error) {
                        this.logger.error("Failed to get departments: ".concat(error.message), error.stack);
                        throw new Error('Failed to get departments');
                    }
                    return [2 /*return*/];
                });
            });
        };
        DepartmentService_1.prototype.getDepartmentStats = function (departmentId) {
            return __awaiter(this, void 0, void 0, function () {
                var allStats;
                return __generator(this, function (_a) {
                    try {
                        allStats = {
                            'cardiology': {
                                totalPatients: 45,
                                criticalPatients: 5,
                                recentAdmissions: 8,
                                averageStayDays: 4.2,
                                staffOnDuty: 15
                            },
                            'neurology': {
                                totalPatients: 35,
                                criticalPatients: 3,
                                recentAdmissions: 6,
                                averageStayDays: 6.1,
                                staffOnDuty: 12
                            },
                            'general-medicine': {
                                totalPatients: 60,
                                criticalPatients: 2,
                                recentAdmissions: 12,
                                averageStayDays: 3.8,
                                staffOnDuty: 18
                            },
                            'pediatrics': {
                                totalPatients: 25,
                                criticalPatients: 1,
                                recentAdmissions: 4,
                                averageStayDays: 2.5,
                                staffOnDuty: 10
                            },
                            'oncology': {
                                totalPatients: 30,
                                criticalPatients: 8,
                                recentAdmissions: 5,
                                averageStayDays: 7.2,
                                staffOnDuty: 14
                            }
                        };
                        if (departmentId) {
                            return [2 /*return*/, allStats[departmentId] || null];
                        }
                        return [2 /*return*/, allStats];
                    }
                    catch (error) {
                        this.logger.error("Failed to get department stats: ".concat(error.message), error.stack);
                        throw new Error('Failed to get department statistics');
                    }
                    return [2 /*return*/];
                });
            });
        };
        return DepartmentService_1;
    }());
    __setFunctionName(_classThis, "DepartmentService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DepartmentService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DepartmentService = _classThis;
}();
exports.DepartmentService = DepartmentService;
