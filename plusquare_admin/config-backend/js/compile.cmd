FOR %%c in (.\*.js) DO (
	java -jar compiler.jar --js %%~nc.js --js_output_file _production/%%~nc.js
)

FOR /D %%d in (.\*) DO (
	FOR %%c in (.\%%~nd\*.js) DO (
		java -jar compiler.jar --js %%~nd/%%~nc.js --js_output_file _production/%%~nd/%%~nc.js
	)
)

FOR %%c in (.\ui\elements\*.js) DO (
	java -jar compiler.jar --js ui/elements/%%~nc.js --js_output_file _production/ui/elements/%%~nc.js
)

PAUSE