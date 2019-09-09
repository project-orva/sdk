import {Service} from '../.internal/service';
import {Profile} from '../.internal/profile';

const SERVICE_URL = 'http://example.service.com/';

const getItem = () => {
  // handle grpc request here.
  return {};
};

const setItem = () => {
  // make grpc request here.
};

const service = new Service(SERVICE_URL, {get: getItem, set: setItem});

export default new Profile(service);
