import axios from 'axios';

const Named = ({ req }) => {
  if (typeof window === 'undefined') {
    //we are on the server
    console.log('Server side called');
    return axios.create({
      // baseURL: 'http://morelcorp.dev',
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    //we are on the client
    console.log('Client side called');
    return axios.create({
      baseURL: '/',
    });
  }
};

export default Named;
