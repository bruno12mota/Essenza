function fnFixPng(b){if("Win32"==navigator.platform&&"Microsoft Internet Explorer"==navigator.appName&&window.attachEvent){var a=b.css("background-image"),a=a.substring(5,a.length-2);b.css("filter","progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+a+"', sizingMethod='scale')");b.css("background-image","url(x.gif)")}};
