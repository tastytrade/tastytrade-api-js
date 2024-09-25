import { useState, useEffect, useCallback } from 'react';
import DXChart from '@devexperts/dxcharts-lite'
import generateCandlesData from '@devexperts/dxcharts-lite/dist/chart/utils/candles-generator.utils';


export default function chartInstance(){
    const [candles, setCandles] = useState<Array<any>>([]);
    const [chart, setChartInstance] = useState<any | null>(null);
    
    
    useEffect(() => {
        setTimeout(() => {
            setCandles(generateCandlesData({ quantity: 1000, withVolume: true }));
        }, 1000); 
    }, []);
    
    
    const setRef:any = useCallback((node:any) => {
        if (node) {
            setChartInstance(DXChart.createChart(node));
        }
    }, []);

    useEffect(() => {
        chart &&
            chart.setData({
                candles,
            });
    }, [candles, chart]);

    
    if (candles.length === 0) {
        return (
            <div className='chart__loading'>['...loading']</div>
        )
    }
    return (
        <div className='chart__container'>{setRef}</div>

    );

}