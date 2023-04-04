import React, {useState, useEffect, useContext} from 'react'
import TastytradeClient from '../lib/service/tastytrade-api';
import { AppContext } from '../contexts/context';

export default function Trade() {
    const [trade, setTrade] = useState([]);
    const baseUrl = "https://api.cert.tastyworks.com"
    const client = new TastytradeClient(baseUrl)
    const context = useContext(AppContext);  

    useEffect(() => {
        // if (accountNumber) {
        //     getPositions(accountNumber);
        // }
    });

    async function makeTrade(accountNumber: string[]){
        
    }

    return (
    <div>
        Trade screen
        Account: insert account here
    </div>
    );
};
