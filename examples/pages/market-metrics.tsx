import React, {useState, useContext} from 'react'
import {AppContext} from '../contexts/context';
import UseHttpRequest from '../components/use-http-request';
import _ from 'lodash'
import CustomTable from '../components/custom-table';

function parseError(error:any){
    if (error.message === 'Network Error'){
      console.log('network error')
      return(error.message);
    }else if (error.code === "ERR_BAD_REQUEST"){
      console.log(error)
      return(error.response.data.error.code);
    }else{
      console.log(error)
    }
}

export default function MarketMetrics() {
  const [symbol, setSymbol] = useState('');
  const [marketMetrics, setMarketMetrics] = useState<null | object>(null)
  const [error, setError] = useState("");
  const context = useContext(AppContext);

  const { isLoading, errorMessage, executeRequest, responseData } = UseHttpRequest(async (symbol) => (
    context.tastytradeApi.marketMetricsService.getMarketMetrics(symbol)
  ), false);

  const handleSearch = async (e: any) => {
    e.preventDefault();
    setError("")
    try{
      const metricsResults = await executeRequest(symbol);
      setMarketMetrics(metricsResults);
    }catch(error:any){
      parseError(error);
  }
  };

  const handleKeyPress = (event:any) => {
      if(event.target.value){
        setSymbol(event.target.value)
        if (event.key === 'Enter') {
          handleSearch(event);
        }
      }
    }

  if (_.isNil(context.accountNumbers)) {
    return <p>Loading...</p>
  }

  const renderResults = ()=>{

    if (_.isNil(marketMetrics)) {
      return <p>No results...</p>
    }
    return(
      // might not work, might have to return the same as in symbol-search if marketMetrics is an array of objects
      <CustomTable tableInformation={marketMetrics}/>
    )
  }

  return (
    <div className='w-3/12'>
        <h2 className="text-center mb-4">Market Metrics Search</h2>
        <div>Enter symbol</div>
        <input
            type='text'
            className="p-2 w-full border border-gray-400"
            onKeyUp={handleKeyPress}
            required
          />
            <button className="rounded cursor-pointer p-5 bg-black text-white" onClick={handleSearch}>Search!</button>
            {error && <div>{error}</div>}
            {renderResults()}
    </div>
  )
};
