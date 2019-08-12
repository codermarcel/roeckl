# To run the go server you will need a working installation of:

1. `golang` (visit https://golang.org/ and click on download and follow the instructions for your operating system, make sure to test your installation before you continue)

2. `git` (on ubuntu you can install it via the command `sudo apt-get install git` and on windows you can download it from https://git-scm.com/downloads)

3. `gcc` (on ubuntu you can install it via the command `sudo apt-get install gcc` and on windows you can download it from https://sourceforge.net/projects/mingw-w64/ you may now need to restart your computer before you can continue)


Now cd into the `backend` folder and run `go get ./...` to install the go dependencies. This may take a while.

After that you can go `go run . -fresh` to start the go server. If you see the message `http server started on [::]` then the go server is running successfully