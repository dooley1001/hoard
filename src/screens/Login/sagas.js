/**
|--------------------------------------------------
| Login Saga
|--------------------------------------------------
*
*  This handles all side-effects for logging a user
*  in. Any token storage, anylitics tracking, or app
*  redirection can be triggered here.
*
*/

import { call, put } from 'redux-saga/effects';
import { LOGIN_SUCCESS, LOGIN_ERROR } from './constants';
import api from 'lib/api';
import { getErrorMessage } from 'lib/api-errors';

// TODO: abstract these into dev/prod files
const loginUrl = `https://erebor-staging.hoardinvest.com/login/`;
const userInfoUrl = `https://erebor-staging.hoardinvest.com/users/`;

// Handle logging in via the API
export async function loginApi(username_or_email, password) {
  try {
    const {user_uid} = await api.post(loginUrl, { username_or_email, password });
    const fullUrl = `${userInfoUrl}${user_uid}`;
    const res = await api.get(fullUrl);
    return {
      ...res,
      user_uid
    };
  } catch (error) {
    throw error;
  }
}

export default function* loginFlow({ username_or_email, password }) {
  let currentUser;

  try {
    // try to call to our loginApi() function.  Redux Saga
    // will pause here until we either are successful or
    // receive an error
    currentUser = yield call(loginApi, username_or_email, password);

    // .. we can also tell redux that our login was successful
    yield put({ type: LOGIN_SUCCESS });
  } catch (e) {
    currentUser = null;
    yield put({
      type: LOGIN_ERROR,
      error: getErrorMessage(e)
    });
  }

  // return the currentUser for health and wealth
  return currentUser;
}
