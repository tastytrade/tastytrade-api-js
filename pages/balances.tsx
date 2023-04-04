import React, {useState, useEffect, useContext} from 'react'
import TastytradeClient from '../lib/service/tastytrade-api';
import { AppContext } from '../contexts/context';

export default function Balances() {
    const [balances, setBalances] = useState([]);
    const context = useContext(AppContext);
    console.log(context.account)

    useEffect(() => {
        if (context.account) {
            getBalances(context.account);
        }
    }, []);

    async function getBalances(accountNumber: string[]) {
        const _balances = (await context.tastytradeApi.balancesAndPositionsService.getAccountBalanceValues(accountNumber[0])).data.data
        console.log(_balances)
        setBalances(_balances);
    }
    
    return (
    <div>
        <h1>Balances for Account Number: [account num]</h1>
        {balances ? 
        (
            <div>
                Cash Balance: $ {balances["cash-balance"]}
                <br/>
                Net Liquidating Value: ${balances["net-liquidating-value"]}
                <br/>
                Stock Buying Power: ${balances["equity-buying-power"]}
                <br/>
                Available Trading Funds: ${balances["available-trading-funds"]}
                <br/>
                Not sure which key to retrieve for options BP
            </div>
            ):
            (
                <div>
                No balances
             </div>
            )}
    </div>
    );
};
