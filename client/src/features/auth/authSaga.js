import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../api';
import { 
    loginRequest, loginSuccess, loginFailure,
    signupRequest, signupSuccess, signupFailure 
} from './authSlice';

function* loginUser(action) {
  try {
    const response = yield call(api.post, '/auth/login', action.payload);
    yield put(loginSuccess(response.data));
  } catch (error) {
    yield put(loginFailure(error.response?.data?.message || 'Login failed'));
  }
}

function* signupUser(action) {
    try {
      yield call(api.post, '/auth/signup', action.payload);
      yield put(signupSuccess());
      action.payload.navigate('/login');
    } catch (error) {
      yield put(signupFailure(error.response?.data?.message || 'Signup failed'));
    }
}

function* authSaga() {
  yield takeLatest(loginRequest.type, loginUser);
  yield takeLatest(signupRequest.type, signupUser);
}

export default authSaga;