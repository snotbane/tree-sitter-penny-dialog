/**
 * @file Injected sub-grammar for Penny strings
 * @author Sebastian Weaver <snotbane@pm.me>
 * @license Unlicense
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
	name: "penny_dialog",

	externals: ($) => [$.express_content],

	extras: ($) => [],

	rules: {
		text: ($) =>
			repeat(
				choice(
					$.pure,
					$.translation,
					$.path,
					$.tag,
					$.express,
					$.escape,
				),
			),

		// Pure text is displayed directly to the user without any alteration.
		pure: ($) =>
			// prec(-10, choice(token(repeat1($._pure_formal)), $.informal)),
			prec(-1, choice($._pure_formal, $.informal)),

		// Formal (truly pure) pure text is any sequence of linguistic characters. This is highlighted as a regular string.
		_pure_formal: ($) => token(repeat1(/[^\\\d\/@#$%^&*+=_`|<>{}\[\]]/)),

		// Any character that is recognized as "informal text," and does not fit into any other category. It is not illegal, but unusual to find in traditional literature.
		informal: ($) => prec(-10, choice($.number, $._informal_misc)),

		_informal_misc: ($) => /[\/@#$%^&*+=_`|\\<>{}\[\]]/,

		number: ($) => choice(/\d+/, /\d+\.\d+/, /[\.]\d+/, /\d+([:\.]\d+)+/),

		translation: ($) =>
			seq(
				"{",
				/\s*/,
				choice($.translation_content, $.translation_content_invalid),
				/\s*/,
				"}",
			),
		translation_content: ($) => prec(2, /[a-z\-]+/i),
		translation_content_invalid: ($) => /[^\}]+/,

		path: ($) =>
			seq(
				$._path_declaration,
				/\.?[a-z_][a-z_0-9]*(\.[a-z_][a-z_0-9]*)*/i,
			),
		_path_declaration: ($) => alias("@", $.special),

		tag: ($) =>
			seq(
				"<",
				optional(seq($.tag_group, repeat(seq("|", $.tag_group)))),
				">",
			),
		tag_group: ($) =>
			seq(
				$.tag_id,
				optional(
					choice(
						seq(/\s+/, $.tag_param, /\s*=\s*/, $.tag_arg),
						seq(/\s*=\s*/, $.tag_arg),
					),
				),
			),

		tag_id: ($) => /[a-z_][a-z_0-9]*/i,
		tag_param: ($) => /[a-z_][a-z_0-9]*/i,
		tag_arg: ($) => /[^>]+/,

		escape: ($) => prec(10, /\\\S/),

		express: ($) => seq("[", $.express_content, "]"),

		// _identifier: ($) => /[a-z_][a-z_0-9]*/i,
	},
});
