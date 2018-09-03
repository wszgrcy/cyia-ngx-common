"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var http_token_1 = require("./http.token");
var deepassign_1 = require("../object/deepassign");
// console.error('请求token出错,请核实后再操作');
var CyiaHttpService = /** @class */ (function () {
    function CyiaHttpService(requestList, http) {
        this.requestList = requestList;
        this.http = http;
    }
    /**
     *传入请求
     *
     * @param {HttpRequestItem} httpRequestConfig
     * @returns
     * @memberof CyiaHttp
     */
    CyiaHttpService.prototype.request = function (httpRequestConfig) {
        /**请求接口 */
        var httpRequestItem = null;
        /**查看请求前缀地址 */
        var requestItem = this.requestList.find(function (listVal) {
            httpRequestItem = listVal.apiList.find(function (itemVal) { return itemVal.token === httpRequestConfig.token; });
            if (httpRequestItem)
                return true;
            return false;
        });
        if (!requestItem || !httpRequestItem) {
            return;
        }
        var obj = deepassign_1._deepAssign({}, httpRequestConfig, httpRequestItem);
        obj.url = requestItem.prefixurl + obj.url + (obj.suffix || '');
        return this.http.request(obj.method, obj.url, obj.options);
        //doc未找到返回 
    };
    CyiaHttpService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(http_token_1.REQUEST_LIST)),
        __metadata("design:paramtypes", [Array, http_1.HttpClient])
    ], CyiaHttpService);
    return CyiaHttpService;
}());
exports.CyiaHttpService = CyiaHttpService;
//# sourceMappingURL=http.service.js.map