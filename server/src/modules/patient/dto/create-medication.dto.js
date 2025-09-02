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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePatientNoteDto = exports.CreateMedicationDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CreateMedicationDto = function () {
    var _a;
    var _patient_id_decorators;
    var _patient_id_initializers = [];
    var _patient_id_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _dosage_decorators;
    var _dosage_initializers = [];
    var _dosage_extraInitializers = [];
    var _frequency_decorators;
    var _frequency_initializers = [];
    var _frequency_extraInitializers = [];
    var _start_date_decorators;
    var _start_date_initializers = [];
    var _start_date_extraInitializers = [];
    var _end_date_decorators;
    var _end_date_initializers = [];
    var _end_date_extraInitializers = [];
    var _instructions_decorators;
    var _instructions_initializers = [];
    var _instructions_extraInitializers = [];
    var _added_by_decorators;
    var _added_by_initializers = [];
    var _added_by_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateMedicationDto() {
                this.patient_id = __runInitializers(this, _patient_id_initializers, void 0);
                this.name = (__runInitializers(this, _patient_id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.dosage = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _dosage_initializers, void 0));
                this.frequency = (__runInitializers(this, _dosage_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
                this.start_date = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _start_date_initializers, void 0));
                this.end_date = (__runInitializers(this, _start_date_extraInitializers), __runInitializers(this, _end_date_initializers, void 0));
                this.instructions = (__runInitializers(this, _end_date_extraInitializers), __runInitializers(this, _instructions_initializers, void 0));
                this.added_by = (__runInitializers(this, _instructions_extraInitializers), __runInitializers(this, _added_by_initializers, void 0));
                this.status = (__runInitializers(this, _added_by_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                __runInitializers(this, _status_extraInitializers);
            }
            return CreateMedicationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _patient_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Patient ID', example: '550e8400-e29b-41d4-a716-446655440000' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsUUID)()];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Medication name', example: 'Metoprolol' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _dosage_decorators = [(0, swagger_1.ApiProperty)({ description: 'Dosage', example: '50mg' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _frequency_decorators = [(0, swagger_1.ApiProperty)({ description: 'Frequency', example: 'Twice daily' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _start_date_decorators = [(0, swagger_1.ApiProperty)({ description: 'Start date', example: '2023-09-01' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsDateString)()];
            _end_date_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'End date', example: '2023-12-01' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _instructions_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Instructions', example: 'Take with food' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _added_by_decorators = [(0, swagger_1.ApiProperty)({ description: 'Added by', enum: ['Doctor', 'Nurse'], example: 'Doctor' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEnum)(['Doctor', 'Nurse'])];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Status', enum: ['Active', 'Discontinued', 'Completed'], default: 'Active' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(['Active', 'Discontinued', 'Completed'])];
            __esDecorate(null, null, _patient_id_decorators, { kind: "field", name: "patient_id", static: false, private: false, access: { has: function (obj) { return "patient_id" in obj; }, get: function (obj) { return obj.patient_id; }, set: function (obj, value) { obj.patient_id = value; } }, metadata: _metadata }, _patient_id_initializers, _patient_id_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _dosage_decorators, { kind: "field", name: "dosage", static: false, private: false, access: { has: function (obj) { return "dosage" in obj; }, get: function (obj) { return obj.dosage; }, set: function (obj, value) { obj.dosage = value; } }, metadata: _metadata }, _dosage_initializers, _dosage_extraInitializers);
            __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: function (obj) { return "frequency" in obj; }, get: function (obj) { return obj.frequency; }, set: function (obj, value) { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
            __esDecorate(null, null, _start_date_decorators, { kind: "field", name: "start_date", static: false, private: false, access: { has: function (obj) { return "start_date" in obj; }, get: function (obj) { return obj.start_date; }, set: function (obj, value) { obj.start_date = value; } }, metadata: _metadata }, _start_date_initializers, _start_date_extraInitializers);
            __esDecorate(null, null, _end_date_decorators, { kind: "field", name: "end_date", static: false, private: false, access: { has: function (obj) { return "end_date" in obj; }, get: function (obj) { return obj.end_date; }, set: function (obj, value) { obj.end_date = value; } }, metadata: _metadata }, _end_date_initializers, _end_date_extraInitializers);
            __esDecorate(null, null, _instructions_decorators, { kind: "field", name: "instructions", static: false, private: false, access: { has: function (obj) { return "instructions" in obj; }, get: function (obj) { return obj.instructions; }, set: function (obj, value) { obj.instructions = value; } }, metadata: _metadata }, _instructions_initializers, _instructions_extraInitializers);
            __esDecorate(null, null, _added_by_decorators, { kind: "field", name: "added_by", static: false, private: false, access: { has: function (obj) { return "added_by" in obj; }, get: function (obj) { return obj.added_by; }, set: function (obj, value) { obj.added_by = value; } }, metadata: _metadata }, _added_by_initializers, _added_by_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateMedicationDto = CreateMedicationDto;
var CreatePatientNoteDto = function () {
    var _a;
    var _patient_id_decorators;
    var _patient_id_initializers = [];
    var _patient_id_extraInitializers = [];
    var _author_decorators;
    var _author_initializers = [];
    var _author_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePatientNoteDto() {
                this.patient_id = __runInitializers(this, _patient_id_initializers, void 0);
                this.author = (__runInitializers(this, _patient_id_extraInitializers), __runInitializers(this, _author_initializers, void 0));
                this.type = (__runInitializers(this, _author_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.content = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _content_initializers, void 0));
                __runInitializers(this, _content_extraInitializers);
            }
            return CreatePatientNoteDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _patient_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Patient ID', example: '550e8400-e29b-41d4-a716-446655440000' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsUUID)()];
            _author_decorators = [(0, swagger_1.ApiProperty)({ description: 'Author of the note', example: 'Dr. Smith' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _type_decorators = [(0, swagger_1.ApiProperty)({ description: 'Note type', enum: ['Observation', 'Assessment', 'Medication', 'General'], example: 'Observation' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEnum)(['Observation', 'Assessment', 'Medication', 'General'])];
            _content_decorators = [(0, swagger_1.ApiProperty)({ description: 'Note content', example: 'Patient appears stable and responsive' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _patient_id_decorators, { kind: "field", name: "patient_id", static: false, private: false, access: { has: function (obj) { return "patient_id" in obj; }, get: function (obj) { return obj.patient_id; }, set: function (obj, value) { obj.patient_id = value; } }, metadata: _metadata }, _patient_id_initializers, _patient_id_extraInitializers);
            __esDecorate(null, null, _author_decorators, { kind: "field", name: "author", static: false, private: false, access: { has: function (obj) { return "author" in obj; }, get: function (obj) { return obj.author; }, set: function (obj, value) { obj.author = value; } }, metadata: _metadata }, _author_initializers, _author_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreatePatientNoteDto = CreatePatientNoteDto;
