require(["ckeditor/ckeditor"],function(){CKEDITOR.config.jqueryOverrideVal="undefined"==typeof CKEDITOR.config.jqueryOverrideVal?!0:CKEDITOR.config.jqueryOverrideVal;var f=window.jQuery;"undefined"!=typeof f&&(f.extend(f.fn,{ckeditorGet:function(){var d=this.eq(0).data("ckeditorInstance");if(!d)throw"CKEditor not yet initialized, use ckeditor() with callback.";return d},ckeditor:function(d,b){if(!CKEDITOR.env.isCompatible)return this;if(!f.isFunction(d)){var k=b;b=d;d=k}b=b||{};this.filter("textarea, div, p").each(function(){var a=
f(this),e=a.data("ckeditorInstance"),h=a.data("_ckeditorInstanceLock"),g=this;if(e&&!h)d&&d.apply(e,[this]);else if(h)CKEDITOR.on("instanceReady",function(a){var c=a.editor;setTimeout(function(){c.element?c.element.$==g&&d&&d.apply(c,[g]):setTimeout(arguments.callee,100)},0)},null,null,9999);else{if(b.autoUpdateElement||"undefined"==typeof b.autoUpdateElement&&CKEDITOR.config.autoUpdateElement)b.autoUpdateElementJquery=!0;b.autoUpdateElement=!1;a.data("_ckeditorInstanceLock",!0);e=CKEDITOR.replace(g,
b);a.data("ckeditorInstance",e);e.on("instanceReady",function(b){var c=b.editor;setTimeout(function(){if(c.element){b.removeListener("instanceReady",this.callee);c.on("dataReady",function(){a.trigger("setData.ckeditor",[c])});c.on("getData",function(b){a.trigger("getData.ckeditor",[c,b.data])},999);c.on("destroy",function(){a.trigger("destroy.ckeditor",[c])});if(c.config.autoUpdateElementJquery&&a.is("textarea")&&a.parents("form").length){var e=function(){a.ckeditor(function(){c.updateElement()})};
a.parents("form").submit(e);a.parents("form").bind("form-pre-serialize",e);a.bind("destroy.ckeditor",function(){a.parents("form").unbind("submit",e);a.parents("form").unbind("form-pre-serialize",e)})}c.on("destroy",function(){a.data("ckeditorInstance",null)});a.data("_ckeditorInstanceLock",null);a.trigger("instanceReady.ckeditor",[c]);d&&d.apply(c,[g])}else setTimeout(arguments.callee,100)},0)},null,null,9999)}});return this}}),CKEDITOR.config.jqueryOverrideVal&&(f.fn.val=CKEDITOR.tools.override(f.fn.val,
function(d){return function(b,k){var a="undefined"!=typeof b,e;this.each(function(){var h=f(this),g=h.data("ckeditorInstance");if(!k&&h.is("textarea")&&g)if(a)g.setData(b);else return e=g.getData(),null;else if(a)d.call(h,b);else return e=d.call(h),null;return!0});return a?this:e}})))});
