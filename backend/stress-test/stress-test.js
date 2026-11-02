import http from 'k6/http';
import { check, sleep } from 'k6';

const CONFIG = {
  baseUrl: __ENV.BASE_URL || 'http://localhost:8088/api/v1',
  loginEndpoint: '/auth/login',
  protectedEndpoint: '/especialidades/resumen',
  credentials: {
    usuario: __ENV.TEST_USER || 'admin01',
    claveAcceso: __ENV.TEST_PASSWORD || 'Admin123',
  },
  tokenField: 'access_token',
};

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<2000'],
  },
};

function login() {
  const payload = JSON.stringify(CONFIG.credentials);
  const params = { headers: { 'Content-Type': 'application/json' } };

  const res = http.post(`${CONFIG.baseUrl}${CONFIG.loginEndpoint}`, payload, params);

  check(res, {
    'login status 200': (r) => r.status === 200,
    'login token presente': (r) => !!r.json(CONFIG.tokenField),
  });

  return res.json(CONFIG.tokenField);
}

export default function () {
  const token = login();

  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const res = http.get(`${CONFIG.baseUrl}${CONFIG.protectedEndpoint}`, params);

  check(res, {
    'endpoint protegido status 200': (r) => r.status === 200,
  });

  sleep(1);
}
