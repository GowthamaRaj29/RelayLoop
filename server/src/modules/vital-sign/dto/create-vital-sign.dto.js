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
exports.CreateVitalSignDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var class_transformer_1 = require("class-transformer");
var CreateVitalSignDto = function () {
    var _a;
    var _patient_id_decorators;
    var _patient_id_initializers = [];
    var _patient_id_extraInitializers = [];
    var _temperature_decorators;
    var _temperature_initializers = [];
    var _temperature_extraInitializers = [];
    var _heart_rate_decorators;
    var _heart_rate_initializers = [];
    var _heart_rate_extraInitializers = [];
    var _blood_pressure_systolic_decorators;
    var _blood_pressure_systolic_initializers = [];
    var _blood_pressure_systolic_extraInitializers = [];
    var _blood_pressure_diastolic_decorators;
    var _blood_pressure_diastolic_initializers = [];
    var _blood_pressure_diastolic_extraInitializers = [];
    var _respiratory_rate_decorators;
    var _respiratory_rate_initializers = [];
    var _respiratory_rate_extraInitializers = [];
    var _oxygen_saturation_decorators;
    var _oxygen_saturation_initializers = [];
    var _oxygen_saturation_extraInitializers = [];
    var _weight_decorators;
    var _weight_initializers = [];
    var _weight_extraInitializers = [];
    var _height_decorators;
    var _height_initializers = [];
    var _height_extraInitializers = [];
    var _blood_glucose_decorators;
    var _blood_glucose_initializers = [];
    var _blood_glucose_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    var _recorded_by_decorators;
    var _recorded_by_initializers = [];
    var _recorded_by_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateVitalSignDto() {
                this.patient_id = __runInitializers(this, _patient_id_initializers, void 0);
                this.temperature = (__runInitializers(this, _patient_id_extraInitializers), __runInitializers(this, _temperature_initializers, void 0));
                this.heart_rate = (__runInitializers(this, _temperature_extraInitializers), __runInitializers(this, _heart_rate_initializers, void 0));
                this.blood_pressure_systolic = (__runInitializers(this, _heart_rate_extraInitializers), __runInitializers(this, _blood_pressure_systolic_initializers, void 0));
                this.blood_pressure_diastolic = (__runInitializers(this, _blood_pressure_systolic_extraInitializers), __runInitializers(this, _blood_pressure_diastolic_initializers, void 0));
                this.respiratory_rate = (__runInitializers(this, _blood_pressure_diastolic_extraInitializers), __runInitializers(this, _respiratory_rate_initializers, void 0));
                this.oxygen_saturation = (__runInitializers(this, _respiratory_rate_extraInitializers), __runInitializers(this, _oxygen_saturation_initializers, void 0));
                this.weight = (__runInitializers(this, _oxygen_saturation_extraInitializers), __runInitializers(this, _weight_initializers, void 0));
                this.height = (__runInitializers(this, _weight_extraInitializers), __runInitializers(this, _height_initializers, void 0));
                this.blood_glucose = (__runInitializers(this, _height_extraInitializers), __runInitializers(this, _blood_glucose_initializers, void 0));
                this.notes = (__runInitializers(this, _blood_glucose_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.recorded_by = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _recorded_by_initializers, void 0));
                __runInitializers(this, _recorded_by_extraInitializers);
            }
            return CreateVitalSignDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _patient_id_decorators = [(0, swagger_1.ApiProperty)({ description: 'Patient ID', example: '550e8400-e29b-41d4-a716-446655440000' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsUUID)()];
            _temperature_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Temperature in Celsius', example: 37.2 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 1 }), (0, class_validator_1.IsPositive)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value ? parseFloat(value) : undefined;
                })];
            _heart_rate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Heart rate in beats per minute', example: 72 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)({ allowNaN: false, allowInfinity: false }), (0, class_validator_1.IsPositive)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value ? parseInt(value) : undefined;
                })];
            _blood_pressure_systolic_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Systolic blood pressure in mmHg', example: 120 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)({ allowNaN: false, allowInfinity: false }), (0, class_validator_1.IsPositive)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value ? parseInt(value) : undefined;
                })];
            _blood_pressure_diastolic_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Diastolic blood pressure in mmHg', example: 80 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)({ allowNaN: false, allowInfinity: false }), (0, class_validator_1.IsPositive)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value ? parseInt(value) : undefined;
                })];
            _respiratory_rate_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Respiratory rate in breaths per minute', example: 16 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)({ allowNaN: false, allowInfinity: false }), (0, class_validator_1.IsPositive)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value ? parseInt(value) : undefined;
                })];
            _oxygen_saturation_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Oxygen saturation percentage', example: 98 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)({ allowNaN: false, allowInfinity: false }), (0, class_validator_1.IsPositive)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value ? parseInt(value) : undefined;
                })];
            _weight_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Weight in kg', example: 70.5 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }), (0, class_validator_1.IsPositive)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value ? parseFloat(value) : undefined;
                })];
            _height_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Height in cm', example: 175.5 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }), (0, class_validator_1.IsPositive)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value ? parseFloat(value) : undefined;
                })];
            _blood_glucose_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Blood glucose in mg/dL', example: 95.5 }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 1 }), (0, class_validator_1.IsPositive)(), (0, class_transformer_1.Transform)(function (_b) {
                    var value = _b.value;
                    return value ? parseFloat(value) : undefined;
                })];
            _notes_decorators = [(0, swagger_1.ApiPropertyOptional)({ description: 'Notes about the vital signs', example: 'Patient appears stable' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _recorded_by_decorators = [(0, swagger_1.ApiProperty)({ description: 'Name of the person recording the vitals', example: 'Nurse Johnson' }), (0, class_validator_1.IsNotEmpty)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _patient_id_decorators, { kind: "field", name: "patient_id", static: false, private: false, access: { has: function (obj) { return "patient_id" in obj; }, get: function (obj) { return obj.patient_id; }, set: function (obj, value) { obj.patient_id = value; } }, metadata: _metadata }, _patient_id_initializers, _patient_id_extraInitializers);
            __esDecorate(null, null, _temperature_decorators, { kind: "field", name: "temperature", static: false, private: false, access: { has: function (obj) { return "temperature" in obj; }, get: function (obj) { return obj.temperature; }, set: function (obj, value) { obj.temperature = value; } }, metadata: _metadata }, _temperature_initializers, _temperature_extraInitializers);
            __esDecorate(null, null, _heart_rate_decorators, { kind: "field", name: "heart_rate", static: false, private: false, access: { has: function (obj) { return "heart_rate" in obj; }, get: function (obj) { return obj.heart_rate; }, set: function (obj, value) { obj.heart_rate = value; } }, metadata: _metadata }, _heart_rate_initializers, _heart_rate_extraInitializers);
            __esDecorate(null, null, _blood_pressure_systolic_decorators, { kind: "field", name: "blood_pressure_systolic", static: false, private: false, access: { has: function (obj) { return "blood_pressure_systolic" in obj; }, get: function (obj) { return obj.blood_pressure_systolic; }, set: function (obj, value) { obj.blood_pressure_systolic = value; } }, metadata: _metadata }, _blood_pressure_systolic_initializers, _blood_pressure_systolic_extraInitializers);
            __esDecorate(null, null, _blood_pressure_diastolic_decorators, { kind: "field", name: "blood_pressure_diastolic", static: false, private: false, access: { has: function (obj) { return "blood_pressure_diastolic" in obj; }, get: function (obj) { return obj.blood_pressure_diastolic; }, set: function (obj, value) { obj.blood_pressure_diastolic = value; } }, metadata: _metadata }, _blood_pressure_diastolic_initializers, _blood_pressure_diastolic_extraInitializers);
            __esDecorate(null, null, _respiratory_rate_decorators, { kind: "field", name: "respiratory_rate", static: false, private: false, access: { has: function (obj) { return "respiratory_rate" in obj; }, get: function (obj) { return obj.respiratory_rate; }, set: function (obj, value) { obj.respiratory_rate = value; } }, metadata: _metadata }, _respiratory_rate_initializers, _respiratory_rate_extraInitializers);
            __esDecorate(null, null, _oxygen_saturation_decorators, { kind: "field", name: "oxygen_saturation", static: false, private: false, access: { has: function (obj) { return "oxygen_saturation" in obj; }, get: function (obj) { return obj.oxygen_saturation; }, set: function (obj, value) { obj.oxygen_saturation = value; } }, metadata: _metadata }, _oxygen_saturation_initializers, _oxygen_saturation_extraInitializers);
            __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: function (obj) { return "weight" in obj; }, get: function (obj) { return obj.weight; }, set: function (obj, value) { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
            __esDecorate(null, null, _height_decorators, { kind: "field", name: "height", static: false, private: false, access: { has: function (obj) { return "height" in obj; }, get: function (obj) { return obj.height; }, set: function (obj, value) { obj.height = value; } }, metadata: _metadata }, _height_initializers, _height_extraInitializers);
            __esDecorate(null, null, _blood_glucose_decorators, { kind: "field", name: "blood_glucose", static: false, private: false, access: { has: function (obj) { return "blood_glucose" in obj; }, get: function (obj) { return obj.blood_glucose; }, set: function (obj, value) { obj.blood_glucose = value; } }, metadata: _metadata }, _blood_glucose_initializers, _blood_glucose_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _recorded_by_decorators, { kind: "field", name: "recorded_by", static: false, private: false, access: { has: function (obj) { return "recorded_by" in obj; }, get: function (obj) { return obj.recorded_by; }, set: function (obj, value) { obj.recorded_by = value; } }, metadata: _metadata }, _recorded_by_initializers, _recorded_by_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateVitalSignDto = CreateVitalSignDto;
