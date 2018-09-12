"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/common/http");
var http_service_1 = require("./http.service");
var core_1 = require("@angular/core");
var http_token_1 = require("./http.token");
var CyiaHttpModule = /** @class */ (function () {
    function CyiaHttpModule() {
    }
    CyiaHttpModule_1 = CyiaHttpModule;
    CyiaHttpModule.forRoot = function (requestList) {
        return {
            ngModule: CyiaHttpModule_1,
            providers: [
                { provide: http_token_1.REQUEST_LIST, useValue: requestList },
                http_service_1.CyiaHttpService
            ]
        };
    };
    var CyiaHttpModule_1;
    CyiaHttpModule = CyiaHttpModule_1 = __decorate([
        core_1.NgModule({
            declarations: [],
            imports: [http_1.HttpClientModule],
            providers: [],
        })
    ], CyiaHttpModule);
    return CyiaHttpModule;
}());
exports.CyiaHttpModule = CyiaHttpModule;
//# sourceMappingURL=http.module.js.map