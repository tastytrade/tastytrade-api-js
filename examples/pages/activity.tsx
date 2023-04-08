import React, {useState, useEffect, useContext} from 'react'
import { AppContext } from '../contexts/context';

export default function Orders() {
    const [liveOrders, setLiveOrders] = useState([]);
    const context = useContext(AppContext);

    useEffect(() => {
        if (context.accountNumbers) {
            getOrders(context.accountNumbers[0]);
        }
    }, [context.accountNumbers]);

    async function getOrders(accountNumber: string) {
        const _liveOrders = (await context.tastytradeApi.orderService.getLiveOrders(accountNumber))
        setLiveOrders(_liveOrders);
    }
    
    return (
        <div>
        {context.accountNumbers ? 
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