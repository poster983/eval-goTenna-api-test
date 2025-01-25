# eval-goTenna-api-test

> Hey there!   
> My name is joseph and this is my submission for this coding challenge!  


# Setup
- Clone the repository
- Ensure you have Bun 1.2 or higher installed, you can alternatively use Node 18
- Run `bun install` or `npm install` to install the dependencies.
- Run `bun run test` or `npm run test` to run the tests.  ts-node is used to run the tests so you don't need to compile the typescript files.


# Approach
- I started by reading the requirements and chose [https://letscountapi.com/](https://letscountapi.com/) as the API to use.  It is a simple API that serves as a counter server.  It has a simple API that allows you to increment, decrement, get the count and set the count to an arbitrary value.  I figured it would be a good API to use for this test as it is simple, and allows for tests more than just a simple match on a string.
- I then created a simple wrapper around the API to make it easier to use along with some types. (found in ./API.ts)
- I often use Zod as my runtime type checker in typescript.  They type system in typescript is great but lacks runtime checking which is important when dealing with untrusted input from both users and 3rd party apis.  Zod is an elegant way to do this within the typescript type system. 
- I started writing tests using the Mocha test framework. Mocha, Flutter testing, and Swift Tests (and XCTest) are the testing frameworks I am most familiar with.  
- The API class holds a local dictionary of the count that is expected from the API.   


Please let me know if you have any questions!