import { call, put, takeLatest, select, debounce } from 'redux-saga/effects';
import api from '../../api';
import {
  fetchCarsRequest,
  fetchCarsSuccess,
  fetchCarsFailure,
  applyFilters,
  setFilter
} from './carsSlice';

const getFilters = (state) => state.cars.filters;

function* fetchCarsSaga() {
  try {
    const filters = yield select(getFilters);
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    const response = yield call(api.get, `/cars?${params.toString()}`);
    yield put(fetchCarsSuccess({ data: response.data, isFiltered: params.toString().length > 0 }));
  } catch (error) {
    yield put(fetchCarsFailure(error.message));
  }
}

function* carsSaga() {
  yield takeLatest(fetchCarsRequest.type, fetchCarsSaga);
  yield debounce(500, applyFilters.type, fetchCarsSaga);
}

export default carsSaga;