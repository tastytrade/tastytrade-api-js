import React, {useState, useEffect, useContext} from 'react'
import { AppContext } from '../contexts/context';

export default function Trade() {
    const [trade, setTrade] = useState([]);
    const context = useContext(AppContext);  

    useEffect(() => {
        // if (accountNumber) {
        //     getPositions(accountNumber);
        // }
    });

    async function makeTrade(accountNumber: string){
        
    }

    return (
    <div>
        Trade screen
        Account: insert account here
    </div>
    );
};
