import http from 'k6/http';
import {sleep} from 'k6';

export let options = {
        vus: 15000,
        duration: '300s',
}
export default function () {
        http.get('http://34.117.178.103/');
        sleep(1);
}