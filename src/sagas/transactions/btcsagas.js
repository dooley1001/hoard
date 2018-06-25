import Bitcoin from 'bitcoinjs-lib';
import {TRANSACTION_FOUND} from './constants';
import { WALLET_IMPORT_SUCCESS, WALLET_TRACK_SYMBOL_SUCCESS } from "screens/Wallet/constants";
import { SYMBOL_BTC } from "containers/App/constants";
import { fork, all, take, select, takeEvery, call, put } from "redux-saga/effects";

import {BTCNodeRequest} from 'screens/Wallet/WalletInstances/BtcWallet';
import {timestampPriceApi} from './ethsagas';
import TxDecoder from './btc-tx-decoder';
import Config from 'react-native-config';

import api from 'lib/api';

export default function* btcTransactionsSagaWatcher() {
  yield all([
    takeEvery(WALLET_TRACK_SYMBOL_SUCCESS, fetchTransactions),
  ]);
}

export function* fetchTransactions(action) {
  if (action.payload.symbol === SYMBOL_BTC) {

    const endpoint = `${Config.BTC_NODE_ENDPOINT}/txs?address=${action.payload.publicAddress}`;
    const response = yield api.get(endpoint);

    for (let transaction of response.txs) {
      const inAddresses = transaction.vin.map(vin => vin.addr);
      const wasSend = inAddresses.includes(action.payload.publicAddress);

      let from;
      let to;
      let value;

      if (wasSend) {
        from = action.payload.publicAddress;
        const firstOtherVout = transaction
          .vout
          .find(vout => vout.scriptPubKey.addresses[0] !== action.payload.publicAddress);
        to = firstOtherVout.scriptPubKey.addresses[0];
        value = Number(firstOtherVout.value);
      } else {
        from = inAddresses[0];
        to = action.payload.publicAddress;
        const firstMyVout = transaction
              .vout
              .find(vout => vout.scriptPubKey.addresses[0] === action.payload.publicAddress);
        value = Number(firstMyVout.value);
      }

      const price = yield call(timestampPriceApi.makeRequest, `?fsym=BTC&tsyms=USD&ts=${transaction.time}`);

      yield put({
        type: TRANSACTION_FOUND,
        transaction: {
          timeMined: transaction.time * 1000,
          blockNumber: transaction.blockheight,
          isTrade: false,
          hash: transaction.txid,
          gasPrice: transaction.fees,
          priceAtTimeMined: value * price.BTC.USD,
          from,
          to,
          value
        }
      });
    }
  }
}
