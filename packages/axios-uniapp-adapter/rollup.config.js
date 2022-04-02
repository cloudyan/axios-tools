/**
 * @author Kuitos
 * @since 2019-05-27
 */

const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const builtin = require('rollup-plugin-node-builtins');
const terser = require('rollup-plugin-terser').terser;
const typescript = require('rollup-plugin-typescript2');

function genConfig(minimize = false) {

	return {
		input: './src/index.ts',
		output: {
			name: 'axios-taro-adapter',
			file: minimize ? './dist/axios-taro-adapter.min.js' : './dist/axios-taro-adapter.js',
			format: 'umd',
			sourcemap: true,
		},
		external: ['axios'],
		plugins: [
			typescript(),
			resolve(),
			commonjs(),
			builtin(),
			minimize ? terser() : void 0,
		],
	};
}

module.exports = [
	genConfig(),
	genConfig(true),
];
