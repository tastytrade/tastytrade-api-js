import React, {useState, useEffect, useContext} from 'react'
import { AppContext } from '../contexts/context';

export default function AccountStatus() {
    const [accountStatus, setAccountStatus] = useState({});
    const context = useContext(AppContext);

    useEffect(() => {
        if (context.accountNumbers) {
            getAccountStatus(context.accountNumbers[0]);
        }
    }, [context.accountNumbers]);

    async function getAccountStatus(accountNumber: string) {
        const _status = (await context.tastytradeApi.accountStatusService.getAccountStatus(accountNumber)).data.data
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
                  <td>{(value as string).toString()}</td>
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
