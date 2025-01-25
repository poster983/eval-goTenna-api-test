import { LetsCount } from "./API.ts";
import {describe, it, before, after} from 'mocha';
import assert from 'assert';


console.log("Hello from Joseph!");
console.log("We are going to be testing the \"https://letscountapi.com/\" API.  An esoteric API that just counts.");



// Lets Count api tests 
//We are going to be using the built in Node Fetch package to make our API calls as that is now standard and there is no need for an external package for such a simple api.
// Bun 1.2 was used to run this, but should also work fine in Node 18

let endpoint = "https://letscountapi.com";
// Add an apendix to the namespace to ensure uniqueness
let namespace = `gt-eval-test-${Math.floor(Math.random() * 10000000)}`;
//we will initialize the keys to the value of their index in the array
let keysToInitialize = ["key1", "key2", "key3", "key4", "key5"];

let api = new LetsCount(endpoint, namespace);
//Mocha Tests
describe('LetsCount API Tests', function () {
    before(function () {
        console.log("Starting test suite for LetsCount API");
        console.info("Endpoint: ", endpoint);
        console.info("Namespace: ", namespace);
        // console.log("Ensure that the namespace and all keys do NOT exist before running these tests.");

    });
    beforeEach(() => {
        console.log("Local Counter BEFORE test: ", api.localCounter);
    })
    //print the local counter after each test
    afterEach(() => {
        console.log("Local Counter AFTER test: ", api.localCounter);
    });

    //MARK: - Tests


    // * Test Group 1: Initialize the keys with the value of their index in the array & Ensure it is a new counter for each
    describe('Initialize counters \"post /\"', function () {
        keysToInitialize.forEach((key, index) => {
            it(`Should create a new key with the value of ${index} AND there should not be an existing key in this namespace`, async () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let response = await api.create(key, index);
                        console.log("Response: ", response);
                        assert.strictEqual(response.exists, undefined, `The key should not exist but it does.`);
                        assert.strictEqual(response.namespace, api.namespace, `Namespace Mismatch. The namespace should be ${api.namespace} but the server responded with ${response.namespace}`);
                        assert.strictEqual(response.key, key, `Key Mismatch. The key should be ${key} but the server responded with ${response.key}`);
                        assert.strictEqual(response.already_exists, false, `The key should not exist but it does.`);
                        assert.strictEqual(response.current_value, index, `The current value of the key should be ${index} but it is ${response.current_value}`);                       
                        assert.strictEqual(api.localCounter[key], index, `The local counter for ${key} should be ${index} but it is ${api.localCounter[key]}`);

                        resolve();
                    } catch (error) {
                        console.error("Error: ", error);
                        reject(error);
                    }
                });
            });
        });
    });

    // * Test Group 1: Increment the main counter by 1.
    describe('Increment Tests /increment', function () {
        for( let key of keysToInitialize) {
            it(`Should increment the key ${key} by 1`, async () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let localBeforeIncrement = api.localCounter[key];
                        let response = await api.increment(key);
                        console.log("Response: ", response);
                        assert.strictEqual(response.namespace, api.namespace, `Namespace Mismatch. The namespace should be ${api.namespace} but the server responded with ${response.namespace}`);
                        assert.strictEqual(response.key, key, `Key Mismatch. The key should be ${key} but the server responded with ${response.key}`);
                        assert.strictEqual(response.current_value, localBeforeIncrement + 1, `The current value of the key should be ${localBeforeIncrement + 1} but it is ${response.current_value}`);                       
                        assert.strictEqual(response.previous_value, localBeforeIncrement, `The Previous value of the key should be ${localBeforeIncrement} but it is ${response.previous_value}`);                       

                        resolve();
                    } catch (error) {
                        console.error("Error: ", error);
                        reject(error);
                    }
                });
            });
        }
        

    })

    // * Test Group 2: set the main counter to 2x its's index
    describe('Update Tests /update', function () {
        for( let i = 0; i < keysToInitialize.length; i++) {
            let key = keysToInitialize[i];
            it(`Should set the key ${key} to 2x its index which is ${i*2}`, async () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let localBeforeUpdate = api.localCounter[key];
                        let response = await api.set(key, i * 2);
                        console.log("Response: ", response);

                        assert.strictEqual(response.namespace, api.namespace, `Namespace Mismatch. The namespace should be ${api.namespace} but the server responded with ${response.namespace}`);
                        assert.strictEqual(response.key, key, `Key Mismatch. The key should be ${key} but the server responded with ${response.key}`);
                        assert.strictEqual(response.current_value, i * 2, `The current value of the key should be ${i * 2} but it is ${response.current_value}`);                       
                        assert.strictEqual(response.previous_value, localBeforeUpdate, `The Previous value of the key should be ${localBeforeUpdate} but it is ${response.previous_value}`);                       

                        resolve();
                    } catch (error) {
                        console.error("Error: ", error);
                        reject(error);
                    }
                });
            });
        }
    })

    // * Test Group 3: Decrement the main counter by 1.

    describe('Decrement Tests /decrement', function () {
        for( let key of keysToInitialize) {
            it(`Should decrement the key ${key} by 1`, async () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let localBeforeDecrement = api.localCounter[key];
                        let response = await api.decrement(key);
                        console.log("Response: ", response);
                        assert.strictEqual(response.namespace, api.namespace, `Namespace Mismatch. The namespace should be ${api.namespace} but the server responded with ${response.namespace}`);
                        assert.strictEqual(response.key, key, `Key Mismatch. The key should be ${key} but the server responded with ${response.key}`);
                        assert.strictEqual(response.current_value, localBeforeDecrement - 1, `The current value of the key should be ${localBeforeDecrement - 1} but it is ${response.current_value}`);                       
                        assert.strictEqual(response.previous_value, localBeforeDecrement, `The Previous value of the key should be ${localBeforeDecrement} but it is ${response.previous_value}`);                       

                        resolve();
                    } catch (error) {
                        console.error("Error: ", error);
                        reject(error);
                    }
                });
            });
        }
        

    })


    // * Test Group 4: get the current value of each of the keys

    describe('Get Current Values /get', function () {
        for( let i = 0; i < keysToInitialize.length; i++) {
            let key = keysToInitialize[i];
            it(`Should get the key ${key} 's value}`, async () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let response = await api.get(key);
                        console.log("Response: ", response);
                        assert.strictEqual(response.exists, true, `The key should exist but it does not.`);
                        assert.strictEqual(response.namespace, api.namespace, `Namespace Mismatch. The namespace should be ${api.namespace} but the server responded with ${response.namespace}`);
                        assert.strictEqual(response.key, key, `Key Mismatch. The key should be ${key} but the server responded with ${response.key}`);
                        assert.strictEqual(response.current_value, api.localCounter[key], `The current value of the key should be ${api.localCounter[key]} but it is ${response.current_value}`);                       
                        resolve();
                    } catch (error) {
                        console.error("Error: ", error);
                        reject(error);
                    }
                });
            });
        }
    })

})
