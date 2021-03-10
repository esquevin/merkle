## Merkle tree

I chose Deno for this exemple project because it's a great alternative to node, with default typescript support.

https://deno.land

In order to run the code you'll need deno on your machine. It's a single executable with no dependencies. On MacOS `brew install deno` should do the trick if you are using Homebrew.

Commits are atomics and tests always pass.

In the end I added a small web UI on top of it because it's nice to play with data structure, but I'm still more of a frontend guy.

Once deno is installed run `make test` for the tests or `make` to prepare the bundle and launch a simple http server on port 3000.

If you can't / don't want to run the server, I keep one running on https://esquevin.com/merkle/