/**
 * Displays the dapps added by the current user
 */

import React, { useState, useEffect } from 'react';
import {
  Row,
  Col,
  CardDeck,
} from 'reactstrap';
import {
  useWeb3Context,
} from 'web3-react';

import DappPreview from '../dappPreview';

import {
  getIdentity,
} from '../../services/utilities';

function Manage() {
  const web3 = useWeb3Context();

  const [resolvers, setResolvers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (web3.active && loading) {
      getIdentity(web3.library, web3.account)
        .then((identity) => {
          setResolvers(identity.resolvers);
          setLoading(false);
        })
        .catch((err) => { console.log(err); });
    }
  });

  return (
    <div>
      <Row>
        <Col>
          <h1>
            dApps You Added
            {' '}
            {resolvers.length}
          </h1>
          <p>View dApp Detail Page To Remove</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <CardDeck>
            {resolvers.length > 0 ? (
              <div>
                {resolvers.filter(resolver => resolver !== '0x387Ce3020e13B0a334Bb3EB25DdCb73c133f1D7A').map(resolver => (
                  <DappPreview
                    key={resolver}
                    id={resolver}
                    legacy
                    added
                  />
                ))
              }
              </div>
            ) : (
              <p>No dapps yet! :( </p>
            )}
          </CardDeck>
        </Col>
      </Row>
    </div>
  );
}

export default Manage;
