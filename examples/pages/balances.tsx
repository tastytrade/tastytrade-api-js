import React, {useState, useEffect, useContext} from 'react'
import { AppContext } from '../contexts/context';
import _ from 'lodash'

export default function Balances() {
    const [balances, setBalances] = useState({});
    const context = useContext(AppContext);

    useEffect(() => {
      if (context.accountNumbers) {
        getBalances(context.accountNumbers[0]);
      }
    }, []);

    async function getBalances(accountNumber: string) {
        const _balances = (await context.tastytradeApi.balancesAndPositionsService.getAccountBalanceValues(accountNumber))
        setBalances(_balances);
    }
    
    return (
    <div>
        <h1>Balances for Account Number: [account num]</h1>
        {balances ? 
        (
            <div>
                Cash Balance: $ {_.get(balances, 'cash-balance')}
                <br/>
                Net Liquidating Value: ${_.get(balances, 'net-liquidating-value')}
                <br/>
                Stock Buying Power: ${_.get(balances, 'equity-buying-power')}
                <br/>
                Available Trading Funds: ${_.get(balances, 'available-trading-funds')}
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
