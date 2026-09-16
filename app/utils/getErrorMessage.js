export function getErrorMessage(error) {
  // No response at all usually means: no internet, or server is unreachable
  if (!error.response) {
    if (error.message === 'Network Error') {
      return 'Unable to connect. Please check your internet connection.';
    }
    return 'Something went wrong connecting to the server. Please try again.';
  }

  const status = error.response.status;

  if (status === 401) {
    return 'Your session has expired. Please log in again.';
  }
  if (status >= 500) {
    return 'The server is having issues right now. Please try again shortly.';
  }
  if (status === 404) {
    return 'The requested data could not be found.';
  }

  // Try to surface a specific field error from Django REST Framework's response shape
  const data = error.response.data;
  if (data) {
    if (typeof data === 'string') return data;
    if (data.detail) return data.detail;
    if (data.error) return data.error;
    const firstKey = Object.keys(data)[0];
    if (firstKey && Array.isArray(data[firstKey])) return data[firstKey][0];
  }

  return 'Something went wrong. Please try again.';
}