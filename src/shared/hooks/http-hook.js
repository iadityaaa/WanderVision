import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  //SToring active req as a reference so that its value doesnot change when the component rerenders
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);
      //api available in modern browsers
      const httpAbortCtrl = new AbortController();
      //current property from the ref
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          //this connects abort control to the req so tha we can abort it later
          signal: httpAbortCtrl.signal,
        });

        //The response still doesn't have the parsed response body which we extract using res.json()
        const responseData = await response.json();

        //SInce my request is completed now i can remove the reqCtrl (AbortController) used for this very request
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== httpAbortCtrl
        );

        //Important: NO error is thrown if the request is sent and the response contains a non-success error code (i.e. 4xx or 5xx). In such a case, you still end up in the then() block and you have to handle the error there
        if (!response.ok) {
          // A property that cheks the response code to be in 200s
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
        throw err; //throw error if theres any otherwise undefined will be returned
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
