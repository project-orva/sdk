import {Service} from '../.internal/service';
import {Profile} from '../.internal/profile';

const SERVICE_URL = 'http://example.service.com/';

const getUser = () => {
  // handle grpc user request here.
  return {};
};

const service = new Service(SERVICE_URL, {get: getUser});

export default new Profile(service);
