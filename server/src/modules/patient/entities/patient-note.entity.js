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
exports.PatientNote = void 0;
var typeorm_1 = require("typeorm");
var patient_entity_1 = require("./patient.entity");
var PatientNote = function () {
    var _classDecorators = [(0, typeorm_1.Entity)('patient_notes')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
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
    var _date_decorators;
    var _date_initializers = [];
    var _date_extraInitializers = [];
    var _created_at_decorators;
    var _created_at_initializers = [];
    var _created_at_extraInitializers = [];
    var _patient_decorators;
    var _patient_initializers = [];
    var _patient_extraInitializers = [];
    var PatientNote = _classThis = /** @class */ (function () {
        function PatientNote_1() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.patient_id = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _patient_id_initializers, void 0));
            this.author = (__runInitializers(this, _patient_id_extraInitializers), __runInitializers(this, _author_initializers, void 0));
            this.type = (__runInitializers(this, _author_extraInitializers), __runInitializers(this, _type_initializers, void 0));
            this.content = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _content_initializers, void 0));
            this.date = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _date_initializers, void 0));
            this.created_at = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _created_at_initializers, void 0));
            // Relations
            this.patient = (__runInitializers(this, _created_at_extraInitializers), __runInitializers(this, _patient_initializers, void 0));
            __runInitializers(this, _patient_extraInitializers);
        }
        return PatientNote_1;
    }());
    __setFunctionName(_classThis, "PatientNote");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)('uuid')];
        _patient_id_decorators = [(0, typeorm_1.Column)('uuid')];
        _author_decorators = [(0, typeorm_1.Column)({ length: 100 })];
        _type_decorators = [(0, typeorm_1.Column)({ enum: ['Observation', 'Assessment', 'Medication', 'General'], default: 'Observation' })];
        _content_decorators = [(0, typeorm_1.Column)({ type: 'text' })];
        _date_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _created_at_decorators = [(0, typeorm_1.CreateDateColumn)()];
        _patient_decorators = [(0, typeorm_1.ManyToOne)(function () { return patient_entity_1.Patient; }, function (patient) { return patient.notes_history; }), (0, typeorm_1.JoinColumn)({ name: 'patient_id' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _patient_id_decorators, { kind: "field", name: "patient_id", static: false, private: false, access: { has: function (obj) { return "patient_id" in obj; }, get: function (obj) { return obj.patient_id; }, set: function (obj, value) { obj.patient_id = value; } }, metadata: _metadata }, _patient_id_initializers, _patient_id_extraInitializers);
        __esDecorate(null, null, _author_decorators, { kind: "field", name: "author", static: false, private: false, access: { has: function (obj) { return "author" in obj; }, get: function (obj) { return obj.author; }, set: function (obj, value) { obj.author = value; } }, metadata: _metadata }, _author_initializers, _author_extraInitializers);
        __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
        __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
        __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
        __esDecorate(null, null, _created_at_decorators, { kind: "field", name: "created_at", static: false, private: false, access: { has: function (obj) { return "created_at" in obj; }, get: function (obj) { return obj.created_at; }, set: function (obj, value) { obj.created_at = value; } }, metadata: _metadata }, _created_at_initializers, _created_at_extraInitializers);
        __esDecorate(null, null, _patient_decorators, { kind: "field", name: "patient", static: false, private: false, access: { has: function (obj) { return "patient" in obj; }, get: function (obj) { return obj.patient; }, set: function (obj, value) { obj.patient = value; } }, metadata: _metadata }, _patient_initializers, _patient_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PatientNote = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PatientNote = _classThis;
}();
exports.PatientNote = PatientNote;
