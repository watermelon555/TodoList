import { call, put } from 'redux-saga/effects';

import UserAPI from '../../api/user';
import { IRes } from '../../common/interface';
import { LocalStorage } from '../../utils';
import {
  ILoginAction,
  IRegisterAction,
  LOGIN_FAIL,
  LOGIN_SUC,
  REGISTER_FAIL,
  REGISTER_SUC,
} from './types';

const userAPI = new UserAPI();

export function* login(action: ILoginAction) {
  const { username, password } = action.payload;

  try {
    const res: IRes = yield call(userAPI.login, username, password);
    yield call(LocalStorage.set, 'userId', res.data.userId);
    yield call(LocalStorage.set, 'username', res.data.username);
    yield put({
      type: LOGIN_SUC,
      payload: { ...res.data, errMsg: res.msg },
    });
    action.payload.callback();
  } catch (error) {
    yield call(LocalStorage.remove, 'userId');
    yield call(LocalStorage.remove, 'username');

    yield put({
      type: LOGIN_FAIL,
      payload: { errMsg: error.message },
    });
  }
}

export function* register(action: IRegisterAction) {
  const { username, password } = action.payload;

  try {
    yield call(userAPI.register, username, password);
    yield put({
      type: REGISTER_SUC,
    });
    action.payload.callback();
  } catch (error) {
    yield put({
      type: REGISTER_FAIL,
      payload: { errMsg: error.message },
    });
  }
}
