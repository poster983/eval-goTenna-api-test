import z from 'zod';

//MARK: TYPES
export let ZodLetsCountResponse = z.union([
    z.object({
        current_value: z.number(),
        key: z.string(),
        namespace: z.string(),

        exists: z.literal(true ),
    }).strict(),

    z.object({
        exists: z.literal(false),
    }).strict(),
    
    z.object({
        exists: z.literal(undefined),
        already_exists: z.boolean(),
        current_value: z.number(),
        key: z.string(),
        namespace: z.string(),
    }).strict(),

    
]);

export type LetsCountResponse = z.infer<typeof ZodLetsCountResponse>;

export let ZodLetsCountMutationResponse = z.object({
    current_value: z.number(),
    key: z.string(),
    namespace: z.string(),
    previous_value: z.number(),
    success: z.boolean(),
}).strict();

export type LetsCountMutationResponse = z.infer<typeof ZodLetsCountMutationResponse>;

export interface LetsCountErrorResponse {
    headers: any;
    message: string;
    status: number;
    body?: string;
}



//MARK: API

export class LetsCount {
    endpoint: string;
    namespace: string;

    localCounter: Record<string, number> = {};

    constructor(endpoint: string = "https://letscountapi.com", namespace: string = "gt-eval-test-534267890") {
        this.endpoint = endpoint;
        this.namespace = namespace;
    }

    /**
     * Will create a new key with the specified value
     * @param key 
     * @param initialValue 
     * @returns [LetsCountResponse] - The new value of the key
     */
    async create(key: string, initialValue: number = 0): Promise<LetsCountResponse> {
        const response = await fetch(`${this.endpoint}/${this.namespace}/${key}`,{
            method: "POST",
            body: JSON.stringify({
                current_value: initialValue,
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });
        
        if (response.ok) {
            this.localCounter[key] = initialValue;
            let data = await response.json();
            
            return ZodLetsCountResponse.parse(data);
        } else {
            let data = await response.text();
            throw {
                headers: response.headers,
                message: data,
                status: response.status,
                body: data,
            } as LetsCountErrorResponse
        }
    }

    /**
     * Will get the value of the key
     * @param key 
     * @returns [LetsCountResponse] - The new value of the key
     */
    async get(key: string): Promise<LetsCountResponse> {
        const response = await fetch(`${this.endpoint}/${this.namespace}/${key}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        
        if (response.ok) {
            let data = await response.json();
            data = ZodLetsCountResponse.parse(data);
            this.localCounter[key] = data.current_value;
            return data
        } else {
            let data = await response.text();
            throw {
                headers: response.headers,
                message: data,
                status: response.status,
                body: data,
            } as LetsCountErrorResponse
        }
    }

    /**
     * Will Increase the key by 1 and return the new value
     * @param key 
     * @returns [LetsCountResponse] - The new value of the key
     */
    async increment(key: string): Promise<LetsCountMutationResponse> {
        const response = await fetch(`${this.endpoint}/${this.namespace}/${key}/increment`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });
        
        if (response.ok) {
            let data = await response.json();
            //throws if the data is not valid
            data = ZodLetsCountMutationResponse.parse(data);
            this.localCounter[key] = data.current_value;
            return data
        } else {
            let data = await response.text();
            throw {
                headers: response.headers,
                message: data,
                status: response.status,
                body: data,
            } as LetsCountErrorResponse
        }
    }

    /**
     * Will Decrease the key by 1 and return the new value
     * @param key 
     * @returns [LetsCountResponse] - The new value of the key
     */
    async decrement(key: string): Promise<LetsCountMutationResponse> {
        const response = await fetch(`${this.endpoint}/${this.namespace}/${key}/decrement`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            }
        });
        
        if (response.ok) {
            let data = await response.json();
            //throws if the data is not valid
            data = ZodLetsCountMutationResponse.parse(data);
            this.localCounter[key] = data.current_value;
            return data
        } else {
            let data = await response.text();
            throw {
                headers: response.headers,
                message: data,
                status: response.status,
                body: data,
            } as LetsCountErrorResponse
        }
    }


    /**
     * Will set the key to the specified value
     * @param key 
     * @param value 
     * @returns [LetsCountResponse] - The new value of the key
     */
    async set(key: string, value: number): Promise<LetsCountMutationResponse> {
        const response = await fetch(`${this.endpoint}/${this.namespace}/${key}/update`,{
            method: "POST",
            body: JSON.stringify({
                current_value: value,
            }),
            headers: {
                "Content-Type": "application/json",
            }
        });
        
        if (response.ok) {
            let data = await response.json();
            //throws if the data is not valid
            data = ZodLetsCountMutationResponse.parse(data);
            this.localCounter[key] = data.current_value;
            return data
        } else {
            let data = await response.text();
            throw {
                headers: response.headers,
                message: data,
                status: response.status,
                body: data,
            } as LetsCountErrorResponse
        }
    }

}



