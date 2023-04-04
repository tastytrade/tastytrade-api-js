import React, {useState, useEffect, useContext} from 'react'
import TastytradeClient from '../lib/service/tastytrade-api';
import { AppContext } from '../contexts/context';

export default function Positions() {
    const [positions, setPositions] = useState([]);
    const baseUrl = "https://api.cert.tastyworks.com"
    const client = new TastytradeClient(baseUrl)
    const context = useContext(AppContext);
  
    useEffect(() => {
        if (context.account) {
            getPositions(context.account);
        }
    }, [context.account]);

    async function getPositions(accountNumber: string[]) {
        const _positions = (await client.balancesAndPositionsService.getPositionsList(accountNumber[0])).data.data
        setPositions(_positions);
    }

    return (
    <div>
        {context.account? 
        (
            <h1>Portfolio</h1>
            // <h1>Positions for Account Number: {context.account![0]}</h1>
        ):
        (
            <p>Loading...</p>
        )
        }
        {positions.length ? 
        (
            <table>
            <thead>
                <tr>
                    <th>Symbol</th>
                    <th>Quantity</th>
                    <th>Day Gain</th>
                </tr>
            </thead>
            <tbody>
                {positions.map((position, index) => (
                    <tr key={index}>
                        <td>{position.symbol}</td>
                        <td>{position.quantity}</td>
                        <td>{position["realized-day-gain-date"]}</td>
                    </tr>
                ))}
            </tbody>
        </table>
            ):
            (
            <div>
               No positions
            </div>
            )}
    </div>
    );
};
