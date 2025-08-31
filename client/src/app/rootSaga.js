import { all } from 'redux-saga/effects';
import authSaga from '../features/auth/authSaga';
import carsSaga from '../features/dashboard/carsSaga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    carsSaga(),
  ]);
}