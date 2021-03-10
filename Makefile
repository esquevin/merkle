.PHONY: test build run

run: output
	cd build && deno run --allow-net --allow-read https://deno.land/std/http/file_server.ts -p 3000

test:
	deno test

output: build/index.html
	@echo "done"

build/index.html: build build/app.js  build/style.css
	
	cp ./index.html build/index.html

build/style.css: build
	cp ./style.css build/style.css

build:
	mkdir -p build

build/app.js: build
	deno bundle -c tsconfig.json app.tsx | sed 's/#//g' > ./build/app.js
