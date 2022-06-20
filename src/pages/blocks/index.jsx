import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFullTime, hexToInt } from '../../utils';
import { fetchBlocks, stopUpdating, updateBlocks } from '../../api';

export default function Blocks() {
  const [latestBlocks, setLatestBlocks] = useState(null);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [updatingBlocks, setUpdatingBlocks] = useState(false);
  const currentProviderRef = useRef(null);

  useEffect(() => {
    const getBlocks = async () => {
      setLoadingBlocks(true);
      try {
        const blocks = await fetchBlocks();
        setLatestBlocks(blocks);
      } catch (e) {
        setErrorMessage(`${e.message} Please refresh.`);
      } finally {
        setLoadingBlocks(false);
      }
    };
    getBlocks();
  }, []);

  const getUpdatedBlock = (block) => {
    if (block.number > latestBlocks[0].number) {
      setLatestBlocks((blocks) => [block, ...blocks]);
    }
  };

  useEffect(() => {
    if (latestBlocks?.length > 0 && !updatingBlocks) {
      const provider = updateBlocks(getUpdatedBlock);
      currentProviderRef.current = provider;
      setUpdatingBlocks(true);
    }
    return () => stopUpdating(currentProviderRef.current);
  }, [latestBlocks]);

  return (
    <div className="blocks">
      <h2>Blocks</h2>
      {loadingBlocks && <span>Loading...</span>}
      {errorMessage && <span className="error">Error: {errorMessage}</span>}
      {latestBlocks?.map(
        ({ number, timestamp, gasUsed, gasLimit, transactions }) => (
          <div key={number} className="data-container">
            <div className="info-row">
              <div>
                <span>Block</span>
                <span>{number}</span>
              </div>
              <div>
                <span>Mined on</span>
                <span>{getFullTime(timestamp)}</span>
              </div>
              <div>
                <span>Gas Used</span>
                <span>
                  {`${hexToInt(gasUsed._hex)} of ${hexToInt(gasLimit._hex)}`}
                </span>
              </div>
              <Link
                to={`/${number}`}
                className={`button${transactions.length ? '' : ' disabled'}`}
              >
                {transactions.length || 'No'} transactions
              </Link>
            </div>
          </div>
        )
      )}
    </div>
  );
}
