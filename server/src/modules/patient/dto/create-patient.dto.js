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
exports.CreatePatientDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var CreatePatientDto = function () {
    var _a;
    var _mrn_decorators;
    var _mrn_initializers = [];
    var _mrn_extraInitializers = [];
    var _first_name_decorators;
    var _first_name_initializers = [];
    var _first_name_extraInitializers = [];
    var _last_name_decorators;
    var _last_name_initializers = [];
    var _last_name_extraInitializers = [];
    var _dob_decorators;
    var _dob_initializers = [];
    var _dob_extraInitializers = [];
    var _gender_decorators;
    var _gender_initializers = [];
    var _gender_extraInitializers = [];
    var _department_decorators;
    var _department_initializers = [];
    var _department_extraInitializers = [];
    var _attending_doctor_decorators;
    var _attending_doctor_initializers = [];
    var _attending_doctor_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _address_decorators;
    var _address_initializers = [];
    var _address_extraInitializers = [];
    var _insurance_decorators;
    var _insurance_initializers = [];
    var _insurance_extraInitializers = [];
    var _room_decorators;
    var _room_initializers = [];
    var _room_extraInitializers = [];
    var _medical_conditions_decorators;
    var _medical_conditions_initializers = [];
    var _medical_conditions_extraInitializers = [];
    var _allergies_decorators;
    var _allergies_initializers = [];
    var _allergies_extraInitializers = [];
    var _last_admission_decorators;
    var _last_admission_initializers = [];
    var _last_admission_extraInitializers = [];
    var _last_visit_decorators;
    var _last_visit_initializers = [];
    var _last_visit_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePatientDto() {
                this.mrn = __runInitializers(this, _mrn_initializers, void 0);
                this.first_name = (__runInitializers(this, _mrn_extraInitializers), __runInitializers(this, _first_name_initializers, void 0));
                this.last_name = (__runInitializers(this, _first_name_extraInitializers), __runInitializers(this, _last_name_initializers, void 0));
                this.dob = (__runInitializers(this, _last_name_extraInitializers), __runInitializers(this, _dob_initializers, void 0));
                this.gender = (__runInitializers(this, _dob_extraInitializers), __runInitializers(this, _gender_initializers, void 0));
                this.department = (__runInitializers(this, _gender_extraInitializers), __runInitializers(this, _department_initializers, void 0));
                this.attending_doctor = (__runInitializers(this, _department_extraInitializers), __runInitializers(this, _attending_doctor_initializers, void 0));
                this.phone = (__runInitializers(this, _attending_doctor_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.email = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.address = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.insurance = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _insurance_initializers, void 0));
                this.room = (__runInitializers(this, _insurance_extraInitializers), __runInitializers(this, _room_initializers, void 0));
                this.medical_conditions = (__runInitializers(this, _room_extraInitializers), __runInitializers(this, _medical_conditions_initializers, void 0));
                this.allergies = (__runInitializers(this, _medical_conditions_extraInitializers), __runInitializers(this, _allergies_initializers, void 0));
                this.last_admission = (__runInitializers(this, _allergies_extraInitializers), __runInitializers(this, _last_admission_initializers, void 0));
                this.last_visit = (__runInitializers(this, _last_admission_extraInitializers), __runInitializers(this, _last_visit_initializers, void 0));
                this.status = (__runInitializers(this, _last_visit_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.notes = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
            return CreatePatientDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _mrn_decorators = [(0, swagger_1.ApiProperty)({ description: 'Medical Record Number', example: 'MRN12345' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _first_name_decorators = [(0, swagger_1.ApiProperty)({ description: 'First name', example: 'John' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _last_name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Last name', example: 'Doe' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _dob_decorators = [(0, swagger_1.ApiProperty)({ description: 'Date of birth', example: '1980-05-15' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsDateString)()];
            _gender_decorators = [(0, swagger_1.ApiProperty)({ description: 'Gender', enum: ['Male', 'Female', 'Other'], example: 'Male' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsEnum)(['Male', 'Female', 'Other'])];
            _department_decorators = [(0, swagger_1.ApiProperty)({ description: 'Department', example: 'Cardiology' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _attending_doctor_decorators = [(0, swagger_1.ApiProperty)({ description: 'Attending doctor', example: 'Dr. Smith' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            _phone_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Phone number', example: '(555) 123-4567' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _email_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Email address', example: 'john.doe@example.com' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEmail)()];
            _address_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Address', example: '123 Main St, Anytown, CA' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _insurance_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Insurance provider', example: 'Blue Cross Blue Shield' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _room_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Room number', example: '205-A' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _medical_conditions_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Medical conditions',
                    type: [String],
                    example: ['Hypertension', 'Diabetes']
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return Array.isArray(value) ? value : [];
                })];
            _allergies_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    description: 'Allergies',
                    type: [String],
                    example: ['Penicillin', 'Latex']
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return Array.isArray(value) ? value : [];
                })];
            _last_admission_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Last admission date', example: '2023-07-20' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _last_visit_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Last visit date', example: '2023-08-20' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _status_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Patient status', example: 'Active', default: 'Active' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'General notes', example: 'Patient reports chest pain during physical activity.' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _mrn_decorators, { kind: "field", name: "mrn", static: false, private: false, access: { has: function (obj) { return "mrn" in obj; }, get: function (obj) { return obj.mrn; }, set: function (obj, value) { obj.mrn = value; } }, metadata: _metadata }, _mrn_initializers, _mrn_extraInitializers);
            __esDecorate(null, null, _first_name_decorators, { kind: "field", name: "first_name", static: false, private: false, access: { has: function (obj) { return "first_name" in obj; }, get: function (obj) { return obj.first_name; }, set: function (obj, value) { obj.first_name = value; } }, metadata: _metadata }, _first_name_initializers, _first_name_extraInitializers);
            __esDecorate(null, null, _last_name_decorators, { kind: "field", name: "last_name", static: false, private: false, access: { has: function (obj) { return "last_name" in obj; }, get: function (obj) { return obj.last_name; }, set: function (obj, value) { obj.last_name = value; } }, metadata: _metadata }, _last_name_initializers, _last_name_extraInitializers);
            __esDecorate(null, null, _dob_decorators, { kind: "field", name: "dob", static: false, private: false, access: { has: function (obj) { return "dob" in obj; }, get: function (obj) { return obj.dob; }, set: function (obj, value) { obj.dob = value; } }, metadata: _metadata }, _dob_initializers, _dob_extraInitializers);
            __esDecorate(null, null, _gender_decorators, { kind: "field", name: "gender", static: false, private: false, access: { has: function (obj) { return "gender" in obj; }, get: function (obj) { return obj.gender; }, set: function (obj, value) { obj.gender = value; } }, metadata: _metadata }, _gender_initializers, _gender_extraInitializers);
            __esDecorate(null, null, _department_decorators, { kind: "field", name: "department", static: false, private: false, access: { has: function (obj) { return "department" in obj; }, get: function (obj) { return obj.department; }, set: function (obj, value) { obj.department = value; } }, metadata: _metadata }, _department_initializers, _department_extraInitializers);
            __esDecorate(null, null, _attending_doctor_decorators, { kind: "field", name: "attending_doctor", static: false, private: false, access: { has: function (obj) { return "attending_doctor" in obj; }, get: function (obj) { return obj.attending_doctor; }, set: function (obj, value) { obj.attending_doctor = value; } }, metadata: _metadata }, _attending_doctor_initializers, _attending_doctor_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _insurance_decorators, { kind: "field", name: "insurance", static: false, private: false, access: { has: function (obj) { return "insurance" in obj; }, get: function (obj) { return obj.insurance; }, set: function (obj, value) { obj.insurance = value; } }, metadata: _metadata }, _insurance_initializers, _insurance_extraInitializers);
            __esDecorate(null, null, _room_decorators, { kind: "field", name: "room", static: false, private: false, access: { has: function (obj) { return "room" in obj; }, get: function (obj) { return obj.room; }, set: function (obj, value) { obj.room = value; } }, metadata: _metadata }, _room_initializers, _room_extraInitializers);
            __esDecorate(null, null, _medical_conditions_decorators, { kind: "field", name: "medical_conditions", static: false, private: false, access: { has: function (obj) { return "medical_conditions" in obj; }, get: function (obj) { return obj.medical_conditions; }, set: function (obj, value) { obj.medical_conditions = value; } }, metadata: _metadata }, _medical_conditions_initializers, _medical_conditions_extraInitializers);
            __esDecorate(null, null, _allergies_decorators, { kind: "field", name: "allergies", static: false, private: false, access: { has: function (obj) { return "allergies" in obj; }, get: function (obj) { return obj.allergies; }, set: function (obj, value) { obj.allergies = value; } }, metadata: _metadata }, _allergies_initializers, _allergies_extraInitializers);
            __esDecorate(null, null, _last_admission_decorators, { kind: "field", name: "last_admission", static: false, private: false, access: { has: function (obj) { return "last_admission" in obj; }, get: function (obj) { return obj.last_admission; }, set: function (obj, value) { obj.last_admission = value; } }, metadata: _metadata }, _last_admission_initializers, _last_admission_extraInitializers);
            __esDecorate(null, null, _last_visit_decorators, { kind: "field", name: "last_visit", static: false, private: false, access: { has: function (obj) { return "last_visit" in obj; }, get: function (obj) { return obj.last_visit; }, set: function (obj, value) { obj.last_visit = value; } }, metadata: _metadata }, _last_visit_initializers, _last_visit_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreatePatientDto = CreatePatientDto;
