import React, {useState, useEffect, useContext} from 'react'
import { AppContext } from '../contexts/context';
import _ from 'lodash'

export default function Positions() {
    const [positions, setPositions] = useState([]);
    const context = useContext(AppContext);
  
    useEffect(() => {
        if (context.accountNumbers) {
            getPositions(context.accountNumbers[0]);
        }
    }, [context.accountNumbers]);

    async function getPositions(accountNumber: string) {
        const _positions = (await context.tastytradeApi.balancesAndPositionsService.getPositionsList(accountNumber))
        setPositions(_positions);
    }

    return (
    <div>
        {context.accountNumbers? 
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
                        <td>{_.get(position, 'symbol')}</td>
                        <td>{_.get(position, 'quantity')}</td>
                        <td>{_.get(position, 'realized-day-gain-date')}</td>
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
