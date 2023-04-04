import React, {useState, useEffect, useContext} from 'react'
import TastytradeClient from '../lib/service/tastytrade-api';
import { AppContext } from '../contexts/context';

export default function Orders() {
    const [liveOrders, setLiveOrders] = useState([]);
    const baseUrl = "https://api.cert.tastyworks.com"
    const client = new TastytradeClient(baseUrl)
    const context = useContext(AppContext);

    useEffect(() => {
        if (context.account) {
            getOrders(context.account);
        }
    }, [context.account]);

    async function getOrders(accountNumber: string[]) {
        const _liveOrders = (await client.orderService.getLiveOrders(accountNumber[0])).data.data
        setLiveOrders(_liveOrders);
    }
    
    return (
        <div>
        {context.account ? 
        (
            <h1>Activity</h1>
            // <h1>Positions for Account Number: {context.account![0]}</h1>
        ):
        (
            <p>Loading...</p>
        )
        }
            {liveOrders.length ? 
            (
                <div>
                    {liveOrders}
                </div>
                ):
                (
                <div>
                No Live Orders
                </div>
                )}
        </div>
    );
};