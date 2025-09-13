import axios from 'axios';

axios.post('http://localhost:80/order')  // assuming Spring Boot runs on port 8080
  .then(response => {
    console.log('Response from load balancer:', response);
  })
  .catch(error => {
    console.error('Error calling load balancer:', error);
  });
 