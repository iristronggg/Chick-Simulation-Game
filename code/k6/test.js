import http from 'k6/http';
import {sleep} from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // simulate ramp-up of traffic from 1 to 60 users over 5 minutes.
    { duration: '60s', target: 20 }, // stay at 60 users for 10 minutes
    { duration: '30s', target: 50 }, // ramp-up to 100 users over 3 minutes (peak hour starts)
    { duration: '20s', target: 50 }, // stay at 100 users for short amount of time (peak hour)
    { duration: '30s', target: 20 }, // ramp-down to 60 users over 3 minutes (peak hour ends)
    { duration: '60s', target: 20 }, // continue at 60 for additional 10 minutes
    { duration: '20s', target: 0 }, // ramp-down to 0 users
  ],
  thresholds: {
    //http_req_failed: ['rate<0.1'], // http errors should be less than 1%
    //http_req_duration: ['p(95) < 3000'], // 95% of requests should be below 200ms
  },
};

export default function () {
        http.post('http://34.117.178.103/get_animals', {
          headers:{
                'Content-Type': 'application/json',
          },
        });
}
