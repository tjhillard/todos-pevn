import axios from 'axios';
import HandleRefreshToken from './refresh-token-service';

class TodoApi {
  constructor() {
    this.http = axios.create({
      baseURL: '/api/v1/todos',
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
      validateStatus: false,
    });
    this.http.interceptors.response.use(response => HandleRefreshToken(response));
  }

  getPaginatedTodos(pageNumber, token) {
    return this.http.get('/', {
      headers: {
        authorization: `Bearer ${token}`,
      },
      params: {
        order_by: 'created_at',
        order: 'desc',
        page_number: pageNumber || 1,
        per_page: 10,
      },
    });
  }

  addNewTodo(todo, token) {
    return this.http.request('/', {
      method: 'post',
      headers: {
        authorization: `Bearer ${token}`,
      },
      data: {
        description: todo,
      },
    });
  }
}

export default new TodoApi();
