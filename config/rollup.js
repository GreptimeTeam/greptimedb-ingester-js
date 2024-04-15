var typescript = require('rollup-plugin-typescript2');
var pkg = require('../package.json');

var version = pkg.version;

var banner = 
`/*!
 * ${pkg.name} ${version} (https://github.com/alili/greptime-js-sdk)
 * API https://github.com/alili/greptime-js-sdk/blob/master/doc/api.md
 * Copyright 2017-${(new Date).getFullYear()} alili. All Rights Reserved
 * Licensed under MIT (https://github.com/alili/greptime-js-sdk/blob/master/LICENSE)
 */
`;

function getCompiler(opt) {
    opt = opt || {
        tsconfigOverride: { compilerOptions: { module: 'ESNext' } },
    }

    return typescript(opt);
}

exports.name = 'greptime-js-sdk';
exports.banner = banner;
exports.getCompiler = getCompiler;

