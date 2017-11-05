$clockHome=$pwd.Path
Copy-Item -Path "$clockHome/Contents/htmls/*.*" -Destination "$clockHome/bin"
Copy-Item -Path "$clockHome/Contents/styles/*.*" -Destination "$clockHome/bin"
Copy-Item -Path "$clockHome/Contents/histories/*.*" -Destination "$clockHome/bin"
