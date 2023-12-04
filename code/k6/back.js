import http from 'k6/http';
import {sleep} from 'k6';

export let options = {
        vus: 50,
        duration: '30s',
}
export default function () {

        http.post('http://34.117.178.103/get_animals', {
          headers:{
                'Content-Type': 'application/json',
          },
        });
	sleep(1);

}

