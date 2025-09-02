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
exports.Patient = void 0;
var typeorm_1 = require("typeorm");
var vital_sign_entity_1 = require("../../vital-sign/entities/vital-sign.entity");
var patient_note_entity_1 = require("./patient-note.entity");
var medication_entity_1 = require("./medication.entity");
var Patient = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('patients')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
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
    var _risk_score_decorators;
    var _risk_score_initializers = [];
    var _risk_score_extraInitializers = [];
    var _risk_level_decorators;
    var _risk_level_initializers = [];
    var _risk_level_extraInitializers = [];
    var _prediction_factors_decorators;
    var _prediction_factors_initializers = [];
    var _prediction_factors_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    var _updated_at_decorators;
    var _updated_at_initializers = [];
    var _updated_at_extraInitializers = [];
    var _vital_signs_decorators;
    var _vital_signs_initializers = [];
    var _vital_signs_extraInitializers = [];
    var _notes_history_decorators;
    var _notes_history_initializers = [];
    var _notes_history_extraInitializers = [];
    var _medications_decorators;
    var _medications_initializers = [];
    var _medications_extraInitializers = [];
    var Patient = _classThis = /** @class */ (function () {
        function Patient_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.mrn = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _mrn_initializers, void 0)); // Medical Record Number
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
            // Risk prediction fields
            this.risk_score = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _risk_score_initializers, void 0));
            this.risk_level = (__runInitializers(this, _risk_score_extraInitializers), __runInitializers(this, _risk_level_initializers, void 0)); // Low, Medium, High
            this.prediction_factors = (__runInitializers(this, _risk_level_extraInitializers), __runInitializers(this, _prediction_factors_initializers, void 0));
            this.created_at = (__runInitializers(this, _prediction_factors_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
            this.updated_at = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _updated_at_initializers, void 0));
            // Relations
            this.vital_signs = (__runInitializers(this, _updated_at_extraInitializers), __runInitializers(this, _vital_signs_initializers, void 0));
            this.notes_history = (__runInitializers(this, _vital_signs_extraInitializers), __runInitializers(this, _notes_history_initializers, void 0));
            this.medications = (__runInitializers(this, _notes_history_extraInitializers), __runInitializers(this, _medications_initializers, void 0));
            __runInitializers(this, _medications_extraInitializers);
        }
        Object.defineProperty(Patient_1.prototype, "vitals", {
            // Virtual fields for frontend compatibility
            get: function () {
                var _a;
                return ((_a = this.vital_signs) === null || _a === void 0 ? void 0 : _a.map(function (vs) { return ({
                    id: vs.id,
                    date: vs.recorded_at,
                    temperature: vs.temperature,
                    heartRate: vs.heart_rate,
                    bloodPressure: "".concat(vs.blood_pressure_systolic, "/").concat(vs.blood_pressure_diastolic),
                    respiratoryRate: vs.respiratory_rate,
                    oxygenSaturation: vs.oxygen_saturation,
                    weight: vs.weight,
                    height: vs.height,
                    notes: vs.notes
                }); })) || [];
            },
            enumerable: false,
            configurable: true
        });
        return Patient_1;
    }());
    __setFunctionName(_classThis, "Patient");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _mrn_decorators = [(0, typeorm_1.Column)({ length: 20, unique: true })];
        _first_name_decorators = [(0, typeorm_1.Column)({ length: 100 })];
        _last_name_decorators = [(0, typeorm_1.Column)({ length: 100 })];
        _dob_decorators = [(0, typeorm_1.Column)({ type: 'date' })];
        _gender_decorators = [(0, typeorm_1.Column)({ enum: ['Male', 'Female', 'Other'] })];
        _department_decorators = [(0, typeorm_1.Column)({ length: 100 })];
        _attending_doctor_decorators = [(0, typeorm_1.Column)({ length: 100 })];
        _phone_decorators = [(0, typeorm_1.Column)({ length: 15, nullable: true })];
        _email_decorators = [(0, typeorm_1.Column)({ length: 255, nullable: true })];
        _address_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _insurance_decorators = [(0, typeorm_1.Column)({ length: 100, nullable: true })];
        _room_decorators = [(0, typeorm_1.Column)({ length: 20, nullable: true })];
        _medical_conditions_decorators = [(0, typeorm_1.Column)('text', { array: true, default: [] })];
        _allergies_decorators = [(0, typeorm_1.Column)('text', { array: true, default: [] })];
        _last_admission_decorators = [(0, typeorm_1.Column)({ type: 'date', nullable: true })];
        _last_visit_decorators = [(0, typeorm_1.Column)({ type: 'date', nullable: true })];
        _status_decorators = [(0, typeorm_1.Column)({ length: 50, default: 'Active' })];
        _notes_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _risk_score_decorators = [(0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true })];
        _risk_level_decorators = [(0, typeorm_1.Column)({ length: 50, nullable: true })];
        _prediction_factors_decorators = [(0, typeorm_1.Column)({ type: 'jsonb', nullable: true })];
        _created_at_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _updated_at_decorators = [(0, typeorm_1.UpdateDateColumn)()];
        _vital_signs_decorators = [(0, typeorm_1.OneToMany)(function () { return vital_sign_entity_1.VitalSign; }, function (vitalSign) { return vitalSign.patient; }, { cascade: true })];
        _notes_history_decorators = [(0, typeorm_1.OneToMany)(function () { return patient_note_entity_1.PatientNote; }, function (note) { return note.patient; }, { cascade: true })];
        _medications_decorators = [(0, typeorm_1.OneToMany)(function () { return medication_entity_1.Medication; }, function (medication) { return medication.patient; }, { cascade: true })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
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
        __esDecorate(null, null, _risk_score_decorators, { kind: "field", name: "risk_score", static: false, private: false, access: { has: function (obj) { return "risk_score" in obj; }, get: function (obj) { return obj.risk_score; }, set: function (obj, value) { obj.risk_score = value; } }, metadata: _metadata }, _risk_score_initializers, _risk_score_extraInitializers);
        __esDecorate(null, null, _risk_level_decorators, { kind: "field", name: "risk_level", static: false, private: false, access: { has: function (obj) { return "risk_level" in obj; }, get: function (obj) { return obj.risk_level; }, set: function (obj, value) { obj.risk_level = value; } }, metadata: _metadata }, _risk_level_initializers, _risk_level_extraInitializers);
        __esDecorate(null, null, _prediction_factors_decorators, { kind: "field", name: "prediction_factors", static: false, private: false, access: { has: function (obj) { return "prediction_factors" in obj; }, get: function (obj) { return obj.prediction_factors; }, set: function (obj, value) { obj.prediction_factors = value; } }, metadata: _metadata }, _prediction_factors_initializers, _prediction_factors_extraInitializers);
        __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
        __esDecorate(null, null, _updated_at_decorators, { kind: "field", name: "updated_at", static: false, private: false, access: { has: function (obj) { return "updated_at" in obj; }, get: function (obj) { return obj.updated_at; }, set: function (obj, value) { obj.updated_at = value; } }, metadata: _metadata }, _updated_at_initializers, _updated_at_extraInitializers);
        __esDecorate(null, null, _vital_signs_decorators, { kind: "field", name: "vital_signs", static: false, private: false, access: { has: function (obj) { return "vital_signs" in obj; }, get: function (obj) { return obj.vital_signs; }, set: function (obj, value) { obj.vital_signs = value; } }, metadata: _metadata }, _vital_signs_initializers, _vital_signs_extraInitializers);
        __esDecorate(null, null, _notes_history_decorators, { kind: "field", name: "notes_history", static: false, private: false, access: { has: function (obj) { return "notes_history" in obj; }, get: function (obj) { return obj.notes_history; }, set: function (obj, value) { obj.notes_history = value; } }, metadata: _metadata }, _notes_history_initializers, _notes_history_extraInitializers);
        __esDecorate(null, null, _medications_decorators, { kind: "field", name: "medications", static: false, private: false, access: { has: function (obj) { return "medications" in obj; }, get: function (obj) { return obj.medications; }, set: function (obj, value) { obj.medications = value; } }, metadata: _metadata }, _medications_initializers, _medications_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Patient = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Patient = _classThis;
}();
exports.Patient = Patient;
