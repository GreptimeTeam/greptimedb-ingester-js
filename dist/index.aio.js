/*!
 * greptime 0.1.0 (https://github.com/alili/greptime-js-sdk)
 * API https://github.com/alili/greptime-js-sdk/blob/master/doc/api.md
 * Copyright 2017-2023 alili. All Rights Reserved
 * Licensed under MIT (https://github.com/alili/greptime-js-sdk/blob/master/LICENSE)
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (factory((global['greptime-js-sdk'] = {})));
}(this, (function (exports) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var yan = 'yan';
    var yan2 = 'yan2';
    var A = /** @class */ (function () {
        function A() {
        }
        A.prototype.aaa = function () {
            console.log('122');
        };
        return A;
    }());
    var B = /** @class */ (function (_super) {
        __extends(B, _super);
        function B() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        B.prototype.bbb = function () {
            console.log('122');
        };
        return B;
    }(A));

    console.log(yan);
    console.log(yan2);
    var a = 1 + 2;
    var b = a;
    console.log(a);
    console.log(b);
    console.log(B);
    function greeter(person) {
        return 'Hello, ' + person;
    }
    var name = 'base';

    exports.greeter = greeter;
    exports.name = name;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
