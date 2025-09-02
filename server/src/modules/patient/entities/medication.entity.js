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
exports.Medication = void 0;
var typeorm_1 = require("typeorm");
var patient_entity_1 = require("./patient.entity");
var Medication = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('medications')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
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
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    var _patient_decorators;
    var _patient_initializers = [];
    var _patient_extraInitializers = [];
    var Medication = _classThis = /** @class */ (function () {
        function Medication_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.patient_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _patient_id_initializers, void 0));
            this.name = (__runInitializers(this, _patient_id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
            this.dosage = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _dosage_initializers, void 0));
            this.frequency = (__runInitializers(this, _dosage_extraInitializers), __runInitializers(this, _frequency_initializers, void 0));
            this.start_date = (__runInitializers(this, _frequency_extraInitializers), __runInitializers(this, _start_date_initializers, void 0));
            this.end_date = (__runInitializers(this, _start_date_extraInitializers), __runInitializers(this, _end_date_initializers, void 0));
            this.instructions = (__runInitializers(this, _end_date_extraInitializers), __runInitializers(this, _instructions_initializers, void 0));
            this.added_by = (__runInitializers(this, _instructions_extraInitializers), __runInitializers(this, _added_by_initializers, void 0)); // Doctor, Nurse
            this.status = (__runInitializers(this, _added_by_extraInitializers), __runInitializers(this, _status_initializers, void 0)); // Active, Discontinued, Completed
            this.created_at = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
            // Relations
            this.patient = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _patient_initializers, void 0));
            __runInitializers(this, _patient_extraInitializers);
        }
        return Medication_1;
    }());
    __setFunctionName(_classThis, "Medication");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _patient_id_decorators = [(0, typeorm_1.Column)('uuid')];
        _name_decorators = [(0, typeorm_1.Column)({ length: 200 })];
        _dosage_decorators = [(0, typeorm_1.Column)({ length: 100 })];
        _frequency_decorators = [(0, typeorm_1.Column)({ length: 100 })];
        _start_date_decorators = [(0, typeorm_1.Column)({ type: 'date' })];
        _end_date_decorators = [(0, typeorm_1.Column)({ type: 'date', nullable: true })];
        _instructions_decorators = [(0, typeorm_1.Column)({ type: 'text', nullable: true })];
        _added_by_decorators = [(0, typeorm_1.Column)({ length: 100, default: 'Doctor' })];
        _status_decorators = [(0, typeorm_1.Column)({ length: 50, default: 'Active' })];
        _created_at_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _patient_decorators = [(0, typeorm_1.ManyToOne)(function () { return patient_entity_1.Patient; }, function (patient) { return patient.medications; }), (0, typeorm_1.JoinColumn)({ name: 'patient_id' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _patient_id_decorators, { kind: "field", name: "patient_id", static: false, private: false, access: { has: function (obj) { return "patient_id" in obj; }, get: function (obj) { return obj.patient_id; }, set: function (obj, value) { obj.patient_id = value; } }, metadata: _metadata }, _patient_id_initializers, _patient_id_extraInitializers);
        __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
        __esDecorate(null, null, _dosage_decorators, { kind: "field", name: "dosage", static: false, private: false, access: { has: function (obj) { return "dosage" in obj; }, get: function (obj) { return obj.dosage; }, set: function (obj, value) { obj.dosage = value; } }, metadata: _metadata }, _dosage_initializers, _dosage_extraInitializers);
        __esDecorate(null, null, _frequency_decorators, { kind: "field", name: "frequency", static: false, private: false, access: { has: function (obj) { return "frequency" in obj; }, get: function (obj) { return obj.frequency; }, set: function (obj, value) { obj.frequency = value; } }, metadata: _metadata }, _frequency_initializers, _frequency_extraInitializers);
        __esDecorate(null, null, _start_date_decorators, { kind: "field", name: "start_date", static: false, private: false, access: { has: function (obj) { return "start_date" in obj; }, get: function (obj) { return obj.start_date; }, set: function (obj, value) { obj.start_date = value; } }, metadata: _metadata }, _start_date_initializers, _start_date_extraInitializers);
        __esDecorate(null, null, _end_date_decorators, { kind: "field", name: "end_date", static: false, private: false, access: { has: function (obj) { return "end_date" in obj; }, get: function (obj) { return obj.end_date; }, set: function (obj, value) { obj.end_date = value; } }, metadata: _metadata }, _end_date_initializers, _end_date_extraInitializers);
        __esDecorate(null, null, _instructions_decorators, { kind: "field", name: "instructions", static: false, private: false, access: { has: function (obj) { return "instructions" in obj; }, get: function (obj) { return obj.instructions; }, set: function (obj, value) { obj.instructions = value; } }, metadata: _metadata }, _instructions_initializers, _instructions_extraInitializers);
        __esDecorate(null, null, _added_by_decorators, { kind: "field", name: "added_by", static: false, private: false, access: { has: function (obj) { return "added_by" in obj; }, get: function (obj) { return obj.added_by; }, set: function (obj, value) { obj.added_by = value; } }, metadata: _metadata }, _added_by_initializers, _added_by_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
        __esDecorate(null, null, _patient_decorators, { kind: "field", name: "patient", static: false, private: false, access: { has: function (obj) { return "patient" in obj; }, get: function (obj) { return obj.patient; }, set: function (obj, value) { obj.patient = value; } }, metadata: _metadata }, _patient_initializers, _patient_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Medication = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Medication = _classThis;
}();
exports.Medication = Medication;
