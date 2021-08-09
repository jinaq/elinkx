
export type Customer = {
    ID: number
    Name: string
    ICO: string
}
export type Customers = Customer[]

export type CustomerRow = {
    key: string
    customer: Customer|CustomerInput,
    errors: false|{[path:string]:string}
}
export type CustomerRows = { [path:string]: CustomerRow }

export type CustomerInput = Omit<Customer, "ID">

export const GET = "GET"
export const POST = "POST"
export const PUT = "PUT"
export const DELETE = "DELETE"

export type OPERATION = typeof GET | typeof PUT | typeof POST | typeof DELETE

export type ActionGET = {
    type: typeof GET,
}
export type ActionPOST = {
    type: typeof POST,
    key: string
    input: CustomerInput
}

export type ActionPUT = {
    type: typeof PUT;
    key: string
    input: CustomerInput & { ID: number}
}
export type ActionDELETE = {
    type: typeof DELETE,
    key: string
    id?: number
}
export type Operation = ActionPOST | ActionGET | ActionPUT | ActionDELETE