import React, {useState, useContext} from 'react'
import {AppContext} from '../contexts/context';
import UseHttpRequest from '../components/use-http-request';
import _ from 'lodash'
import CustomTable from '../components/custom-table';
import Button from '../components/button';

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

export default function symbolSearch() {
    const [symbol, setSymbol] = useState('');
    const [symbolData, setSymbolData] = useState<null | object>(null)
    const [error, setError] = useState("");
    const context = useContext(AppContext);

    const { isLoading, errorMessage, executeRequest, responseData } = UseHttpRequest(async (symbol) => (
      context.tastytradeApi.symbolSearchService.getSymbolData(symbol)
    ), false);
  
    const handleSearch = async () => {
      setError("")
      try{
        const metricsResults = await executeRequest(symbol);
        setSymbolData(metricsResults);
      }catch(error:any){
        parseError(error);
      }
    };
  
    const handleKeyPress = (event:any) => {
        if(event.target.value){
          setSymbol(event.target.value)
          if (event.key === 'Enter') {
            handleSearch();
          }
        }
      }
  
      if (_.isNil(context.accountNumbers)) {
        return <p>Loading...</p>
      }

    const renderResults = ()=>{

      if (_.isNil(symbolData)) {
        return <p>No results...</p>
      }

      return(
          <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(symbolData).map(([key, value], index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{value.symbol}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{value.description}</td>
                  </tr>
                ))}
              </tbody>
          </table>
      )
    }

  return (
    <div className='w-3/12'>
        <h2 className="text-center mb-4">Symbol Search</h2>
        <div>Enter symbol</div>
        <input
            type='text'
            className="p-2 w-full border border-gray-400 mb-2"
            onKeyUp={handleKeyPress}
            required
          />
        <Button onClick={handleSearch} title="Search" />
        {error && <div>{error}</div>}
        {renderResults()}
    </div>
  )
};
