import { useState, useEffect } from 'react';
import _ from 'lodash'

// TODO: Add fancy error handling
// TODO: Add fancy response data processing

export default function UseHttpRequest(httpRequestor: (input:any) => any, onMount = false, defaultInput: any = null) {
  const [isLoading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<null | string>(null)
  const [responseData, setResponseData] = useState<null | object>(null)

  const executeRequest = async (input:any = null) => {
    setErrorMessage('')

    try {
      setLoading(true)
      const response = await httpRequestor(input)
      setResponseData(response)
      return response
    } catch (error) {
      setErrorMessage(_.get(error, 'message', null))
    } finally {
      setLoading(false)
    }
  }

  if (onMount) {
    useEffect(() => {
      executeRequest(defaultInput);
    }, []);
  }

  return { isLoading, errorMessage, executeRequest, responseData }
}
