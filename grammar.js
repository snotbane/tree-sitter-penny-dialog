/**
 * @file Injected sub-grammar for Penny strings
 * @author Sebastian Weaver <snotbane@pm.me>
 * @license Unlicense
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

export default grammar({
	name: "penny_dialog",

	externals: ($) => [$.expression_content],

	// extras: ($) => [],

	rules: {
		text: ($) =>
			optional(
				choice(
					seq("`", optional($._contents), "`"),
					seq(">", optional($._contents)),
					prec(-1, $._contents),
				),
			),

		_contents: ($) =>
			repeat1(
				choice(
					$.pure,
					$.translation_marker,
					$.path,
					$._tag,
					$.expression,
					$.escape_sequence,
				),
			),

		escape_sequence: ($) => prec(10, /\\\S/),

		number: ($) => choice(/\d+/, /\d+\.\d+/, /[\.]\d+/, /\d+([:\.]\d+)+/),

		// Pure text is displayed directly to the user without any alteration.
		pure: ($) => prec(-1, choice($._formal, $.informal)),

		// Formal (truly pure) pure text is any sequence of linguistic characters. This is highlighted as a regular string.
		_formal: ($) => token(repeat1(/[^\\\d\/@#$%^&*+=_`|<>{}\[\]]/)),

		// Any character that is recognized as "informal text," and does not fit into any other category. It is not illegal, but unusual to find in traditional literature.
		informal: ($) => prec(-10, choice($.number, $._informal_misc)),

		_informal_misc: ($) => /[\/@#$%^&*+=_`|\\<>{}\[\]]/,

		expression: ($) => seq("{", $.expression_content, "}"),

		path: ($) => seq("@", /\.?[a-z_][a-z_0-9]*(\.[a-z_][a-z_0-9]*)*/i),

		identifier: ($) => /[a-z_][a-z_0-9]*/i,

		translation_marker: ($) =>
			seq("[", choice($.lang, $.lang_invalid), "]"),
		lang: ($) => prec(2, /[a-z\-]+/i),
		lang_invalid: ($) => /[^\]]+/,

		_tag: ($) => choice($.tag_start, $.tag_end),
		tag_start: ($) =>
			seq("<", optional(seq($.decor, repeat(seq("|", $.decor)))), ">"),

		tag_end: ($) =>
			seq(
				"</",
				optional(seq($.identifier, repeat(seq("|", $.identifier)))),
				">",
			),

		decor: ($) => seq($.arg, repeat(seq($.arg))),

		arg: ($) =>
			prec.left(2, seq($.identifier, optional(seq("=", $.arg_value)))),

		arg_value: ($) =>
			choice(/[^@{}'"`|>\s]+/, $._quoted_string, $.expression, $.path),

		_quoted_string: ($) =>
			prec(
				100,
				choice(
					seq("'", /[^']*/, "'"),
					seq('"', /[^"]*/, '"'),
					seq("`", /[^`]*/, "`"),
				),
			),
	},
});
