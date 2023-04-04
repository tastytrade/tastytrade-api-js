import React, {useState, useEffect, useContext} from 'react'
import TastytradeClient from '../lib/service/tastytrade-api';
import { AppContext } from '../contexts/context';

export default function AccountStatus() {
    const [accountStatus, setAccountStatus] = useState([]);
    const baseUrl = "https://api.cert.tastyworks.com"
    const client = new TastytradeClient(baseUrl)
    const context = useContext(AppContext);

    useEffect(() => {
        if (context.account) {
            getAccountStatus(context.account);
        }
    }, [context.account]);

    async function getAccountStatus(accountNumber: string[]) {
        const _status = (await client.accountStatusService.getAccountStatus(accountNumber[0])).data.data
        setAccountStatus(_status);
    }
    
    return (
    <div>
        <h1>Account Statuses for [input account num]</h1>
        {accountStatus ? 
        (
            <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(accountStatus).map(([key, value], index) => (
                <tr key={index}>
                  <td>{key}</td>
                  <td>{value.toString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
            ):
            (
            <div>
               No Account Status
            </div>
            )}
    </div>
    );
};
