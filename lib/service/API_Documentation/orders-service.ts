import TastytradeHttpClient from "../tastytrade-http-client";

export default class OrderService {
    constructor(private httpClient: TastytradeHttpClient) {
    }

    //Orders: Allows an API client to view, filter, create, cancel and replace orders.
    async postReconfirmOrder(accountNumber: string, orderId: string){
        //Reconfirm an order
        const reconfirmOrder = await this.httpClient.postData(`/accounts/${accountNumber}/orders/${orderId}/reconfirm`, {}, {})
        return reconfirmOrder
    }
    async replacementOrderDryRun(accountNumber: string, orderId: string, replacementOrder: object){
        //Runs through preflights for cancel-replace and edit without routing
        const replacementOrderDryRun = await this.httpClient.postData(`/accounts/${accountNumber}/orders/${orderId}/dry-run`, replacementOrder, {})
        return replacementOrderDryRun
    }
    async getOrder(accountNumber: string, orderId: string){
        //Returns an order based on the orderId
        const _order = await this.httpClient.getData(`/accounts/${accountNumber}/orders/${orderId}`, {}, {})
        return _order
    }
    async cancelOrder(accountNumber: string, orderId: number){
        //Requests order cancellation
        const _order = await this.httpClient.deleteData(`/accounts/${accountNumber}/orders/${orderId}`, {})
        return _order
    }
    async replaceOrder(accountNumber: string, orderId: string, replacementOrder : object){
        //Replaces a live order with a new one. Subsequent fills of the original order will abort the replacement.
        const _order = await this.httpClient.putData(`/accounts/${accountNumber}/orders/${orderId}`, replacementOrder , {})
        return _order
    }
    async editOrder(accountNumber: string, orderId: string, order : object){
        //Edit price and execution properties of a live order by replacement. Subsequent fills of the original order will abort the replacement.
        const _order = await this.httpClient.patchData(`/accounts/${accountNumber}/orders/${orderId}`, order , {})
        return _order
    }
    async getLiveOrders(accountNumber: string){
        //Returns a list of live orders for the resource
        const liveOrders = await this.httpClient.getData(`/accounts/${accountNumber}/orders/live`, {}, {})
        return liveOrders
    }
    async getOrders(accountNumber: string, queryParams = {}){
        //Returns a paginated list of the customer's orders (as identified by the provided authentication token) based on sort param. If no sort is passed in, it defaults to descending order.
        const orders = await this.httpClient.getData(`/accounts/${accountNumber}/orders`, {}, queryParams)
        return orders
    }
    async createOrder(accountNumber: string, order: object){
        //Accepts a json document containing parameters to create an order for the client.
        const _order = await this.httpClient.postData(`/accounts/${accountNumber}/orders`, order , {})
        return _order
    }
    async postOrderDryRun(accountNumber: string, order: object){
        //Accepts a json document containing parameters to create an order and then runs the prefights without placing the order.
        const orderDryRun = await this.httpClient.postData(`/accounts/${accountNumber}/orders/dry-run`, order , {})
        return orderDryRun
    }
    async getLiveOrdersForCustomer(customerId: string){
        //Returns a list of live orders for the resource
        const liveOrders = await this.httpClient.getData(`/customers/${customerId}/orders/live`, {}, {})
        return liveOrders
    }
    async getCustomerOrders(customerId: string, queryParams = {}){
        //Returns a paginated list of the customer's orders (as identified by the provided authentication token) based on sort param. If no sort is passed in, it defaults to descending order.
        const customerOrders = await this.httpClient.getData(`/customers/${customerId}/orders`, {}, queryParams)
        return customerOrders
    }
}
