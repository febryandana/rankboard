import { afterEach, describe, expect, it, vi } from 'vitest';

type ApiModule = typeof import('./api');

const axiosRetryMock = vi.fn();
const exponentialDelayMock = vi.fn();
const networkRetryCheckMock = vi.fn(() => false);

(axiosRetryMock as any).exponentialDelay = exponentialDelayMock;
(axiosRetryMock as any).isNetworkOrIdempotentRequestError = networkRetryCheckMock;

let responseErrorHandler: ((error: any) => Promise<never>) | undefined;

const createMockAxiosInstance = () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
  interceptors: {
    response: {
      use: vi.fn((_successHandler: unknown, errorHandler: unknown) => {
        responseErrorHandler = errorHandler as (error: any) => Promise<never>;
      }),
    },
  },
});

let mockAxiosInstance = createMockAxiosInstance();

const mockAxiosCreate = vi.fn(() => mockAxiosInstance);

vi.mock('axios', () => ({
  default: { create: mockAxiosCreate },
  create: mockAxiosCreate,
}));

vi.mock('axios-retry', () => ({
  default: axiosRetryMock,
}));

const locationStub = (() => {
  let href = 'http://localhost/';
  return {
    get href() {
      return href;
    },
    set href(value: string) {
      href = value;
    },
    pathname: '/',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
    origin: 'http://localhost',
    host: 'localhost',
    hostname: 'localhost',
    port: '',
    protocol: 'http:',
    search: '',
    hash: '',
    ancestorOrigins: {
      length: 0,
      item: () => null,
      [Symbol.iterator]: function* () {},
    },
    toString() {
      return href;
    },
  } as unknown as Location;
})();

Object.defineProperty(window, 'location', {
  configurable: true,
  value: locationStub,
});

const loadApiModule = async (): Promise<ApiModule> => {
  responseErrorHandler = undefined;
  vi.resetModules();
  mockAxiosInstance = createMockAxiosInstance();
  mockAxiosCreate.mockReset();
  mockAxiosCreate.mockImplementation(() => mockAxiosInstance);
  axiosRetryMock.mockReset();
  return import('./api');
};

const getResponseErrorHandler = () => {
  if (!responseErrorHandler) {
    throw new Error('Response interceptor handler has not been registered yet.');
  }
  return responseErrorHandler;
};

afterEach(() => {
  vi.unstubAllEnvs();
  locationStub.href = 'http://localhost/';
  locationStub.pathname = '/';
});

describe('api client service', () => {
  it('configures axios client with default headers and retry strategy', async () => {
    vi.stubEnv('VITE_API_URL', 'http://localhost:3000/api');

    await loadApiModule();

    expect(mockAxiosCreate).toHaveBeenCalledWith({
      baseURL: 'http://localhost:3000/api',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(axiosRetryMock).toHaveBeenCalledWith(
      mockAxiosInstance,
      expect.objectContaining({
        retries: 3,
        retryDelay: exponentialDelayMock,
      })
    );

    expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalledTimes(1);
  });

  it('auth.login posts credentials and returns api payload', async () => {
    const api = await loadApiModule();
    mockAxiosInstance.post.mockResolvedValue({
      data: { success: true, data: { user: { id: 1 } } },
    });

    const response = await api.auth.login({ username: 'jane', password: 'secret' });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', {
      username: 'jane',
      password: 'secret',
    });
    expect(response).toEqual({ success: true, data: { user: { id: 1 } } });
  });

  it('users.uploadAvatar sends multipart payload with correct headers', async () => {
    const api = await loadApiModule();
    mockAxiosInstance.post.mockResolvedValue({ data: { success: true } });

    const file = new File(['avatar-bytes'], 'avatar.png', { type: 'image/png' });
    const response = await api.users.uploadAvatar(42, file);

    expect(mockAxiosInstance.post).toHaveBeenCalledTimes(1);
    const [url, body, config] = mockAxiosInstance.post.mock.calls[0];

    expect(url).toBe('/users/42/avatar');
    expect(body).toBeInstanceOf(FormData);
    expect((body as FormData).get('avatar')).toBe(file);
    expect(config).toMatchObject({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    expect(response).toEqual({ success: true });
  });

  it('submissions.download requests blob response type', async () => {
    const api = await loadApiModule();
    const blob = new Blob(['submission']);
    mockAxiosInstance.get.mockResolvedValue({ data: blob });

    const response = await api.submissions.download(7);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/submissions/7/download', {
      responseType: 'blob',
    });
    expect(response).toBe(blob);
  });

  it('scores.getByChallengeId fetches leaderboard data', async () => {
    const api = await loadApiModule();
    const payload = { success: true, data: { leaderboard: [] } };
    mockAxiosInstance.get.mockResolvedValue({ data: payload });

    const response = await api.scores.getByChallengeId(3);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/challenges/3/scores');
    expect(response).toBe(payload);
  });

  it('redirects to /login when unauthorized on non-session requests', async () => {
    await loadApiModule();
    const error = {
      response: { status: 401 },
      config: { url: '/secure/data' },
    };

    locationStub.pathname = '/dashboard';
    locationStub.href = '/dashboard';

    await expect(getResponseErrorHandler()(error)).rejects.toBe(error);
    expect(locationStub.href).toBe('/login');
  });

  it('does not redirect when unauthorized response originates from session check', async () => {
    await loadApiModule();
    const error = {
      response: { status: 401 },
      config: { url: '/auth/session' },
    };

    locationStub.pathname = '/login';
    locationStub.href = '/login';

    await expect(getResponseErrorHandler()(error)).rejects.toBe(error);
    expect(locationStub.href).toBe('/login');
  });
});
