FOR %%c in (.\_production\*.js) DO (
	java -jar compiler.jar --js _production/%%~nc.js --js_output_file %%~nc.js
)

FOR /D %%d in (.\_production\*) DO (
	FOR %%c in (.\_production\%%~nd\*.js) DO (
		IF NOT EXIST ./%%~nd (mkdir %%~nd)
		java -jar compiler.jar --js _production/%%~nd/%%~nc.js --js_output_file %%~nd/%%~nc.js
	)
)

PAUSE