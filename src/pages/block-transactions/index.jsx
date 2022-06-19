/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBlockTransactions } from '../../api';
import { hexToInt } from '../../utils';

export default function BlockTransactions() {
  const { blockNumber } = useParams();

  const [blockTransactions, setBlockTransactions] = useState(null);
  const [loadingBlockTransactions, setLoadingBlockTransactions] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const getBlockTransaction = async () => {
      setLoadingBlockTransactions(true);
      try {
        const { transactions } = await fetchBlockTransactions(
          parseInt(blockNumber, 10)
        );
        setBlockTransactions(transactions);
      } catch (e) {
        setErrorMessage(e.message);
      } finally {
        setLoadingBlockTransactions(false);
      }
    };
    getBlockTransaction();
  }, [blockNumber]);
  return (
    <div className="transactions">
      <h2>Transactions of Block {blockNumber}</h2>
      {loadingBlockTransactions && <span>Loading...</span>}
      {errorMessage && <span className="error">Error: {errorMessage}</span>}
      {blockTransactions?.map(
        ({ hash, gasLimit, gasPrice, from, to, value, nonce }) =>
          hexToInt(value._hex) > 0 && (
            <div key={hash} className="data-container">
              <div className="info-column">
                <div>
                  <span>Transaction Hash</span>
                  <span>{hash}</span>
                </div>
                <div>
                  <span>From</span>
                  <span>{from}</span>
                </div>
                <div>
                  <span>To</span>
                  <span>{to}</span>
                </div>
              </div>
              <div className="info-row">
                <div>
                  <span>Gas Limit</span>
                  <span>{hexToInt(gasLimit._hex)}</span>
                </div>
                <div>
                  <span>Gas Price</span>
                  <span>{hexToInt(gasPrice._hex)}</span>
                </div>
                <div>
                  <span>Value</span>
                  <span>{hexToInt(value._hex)}</span>
                </div>
                <div>
                  <span>NONCE</span>
                  <span>{nonce}</span>
                </div>
              </div>
            </div>
          )
      )}
    </div>
  );
}
