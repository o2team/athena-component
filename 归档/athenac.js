ace.define("ace/theme/athenac",["require","exports","module","ace/lib/dom"], function(acequire, exports, module) {

exports.isDark = false;
exports.cssClass = "ace-athenac";
exports.cssText = "\
.ace-athenac {font-size:14px;line-height:20px;background-color:#fff;color:black;}\
.ace-athenac .ace_gutter {background:#ebebeb;color:#333;overflow:hidden;}\
		.ace-athenac .ace_gutter-cell {color:#afafaf;}\
.ace-athenac .ace_scroller {border-left:3px solid #B7C9EA !important}\
	.ace-athenac .ace_content {}\
		.ace-athenac .ace_print-margin-layer {}\
			.ace-athenac .ace_print-margin-layer .ace_print-margin {width:1px;background:#e8e8e8;}\
		.ace-athenac .ace_marker-layer {}\
			.ace-athenac .ace_marker-layer .ace_active-line {background:rgba(0,0,0,0.1);}\
			.ace-athenac .ace_marker-layer .ace_selection {background:rgb(181, 213, 255);}\
			.ace-athenac .ace_marker-layer .ace_selected-word {background:rgb(250, 250, 255);border:1px solid rgb(200, 200, 250);}\
			.ace-athenac .ace_marker-layer .ace_step {background:rgb(252, 255, 0);}\
			.ace-athenac .ace_marker-layer .ace_stack {background:rgb(164, 229, 101);}\
			.ace-athenac .ace_marker-layer .ace_bracket {margin:-1px 0 0 -1px;border:1px solid rgb(192, 192, 192);}\
		.ace-athenac .ace_text-layer {}\
			.ace-athenac .ace_text-layer .ace_line {}\
		.ace-athenac .ace_cursor-layer {}\
			.ace-athenac .ace_cursor-layer .ace_cursor {color:black;}\
\
.ace-athenac .ace_invisible {color:rgb(191, 191, 191);}\
.ace-athenac .ace_constant.ace_buildin {color:rgb(88, 72, 246);}\
.ace-athenac .ace_constant.ace_language {color:rgb(88, 92, 246);}\
.ace-athenac .ace_constant.ace_library {color:rgb(6, 150, 14);}\
.ace-athenac .ace_invalid {background-color:rgb(153, 0, 0);color:white;}\
.ace-athenac .ace_fold {}\
.ace-athenac .ace_support.ace_function {color:rgb(60, 76, 114);}\
.ace-athenac .ace_support.ace_constant {color:rgb(6, 150, 14);}\
.ace-athenac .ace_support.ace_type,\
.ace-athenac .ace_support.ace_class\
.ace-athenac .ace_support.ace_other {color:rgb(109, 121, 222);}\
.ace-athenac .ace_variable.ace_parameter {font-style:italic;color:#FD971F;}\
.ace-athenac .ace_keyword.ace_operator {color:rgb(104, 118, 135);}\
.ace-athenac .ace_comment {color:#236e24;}\
.ace-athenac .ace_comment.ace_doc {color:#236e24;}\
.ace-athenac .ace_comment.ace_doc.ace_tag {color:#236e24;}\
.ace-athenac .ace_constant.ace_numeric {color:rgb(0, 0, 205);}\
.ace-athenac .ace_variable {color:rgb(49, 132, 149);}\
.ace-athenac .ace_xml-pe {color:rgb(104, 104, 91);}\
.ace-athenac .ace_entity.ace_name.ace_function {color:#0000A2;}\
.ace-athenac .ace_heading {color:rgb(12, 7, 255);}\
.ace-athenac .ace_list {color:rgb(185, 6, 144);}\
.ace-athenac .ace_gutter-active-line {background-color:#dcdcdc;}\
.ace-athenac .ace_storage,\
.ace-athenac .ace_keyword,\
.ace-athenac .ace_meta.ace_tag {color:rgb(147, 15, 128);}\
.ace-athenac .ace_string.ace_regex {color:rgb(255, 0, 0)}\
.ace-athenac .ace_string {color:#1A1AA6;}\
.ace-athenac .ace_entity.ace_other.ace_attribute-name {color:#994409;}\
.ace-athenac .ace_indent-guide {background:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAACCAYAAACZgbYnAAAAE0lEQVQImWP4////f4bLly//BwAmVgd1/w11/gAAAABJRU5ErkJggg==\") right repeat-y;}\
";

var dom = acequire("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);
});
