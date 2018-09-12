import axios from 'axios';
import store from '../../store';
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
        authorization: `Bearer ${store.getters.jwt}`,
      },
      params: {
        order_by: 'created_at',
        order: 'desc',
        page_number: pageNumber || 1,
        per_page: 100,
      },
    });
  }

  addNewTodo(todo) {
    return this.http.request('/', {
      method: 'post',
      headers: {
        authorization: `Bearer ${store.getters.jwt}`,
      },
      data: {
        description: todo,
      },
    });
  }

  completeTodo(todoId, value) {
    return this.http.request(`/${todoId}`, {
      method: 'put',
      headers: {
        authorization: `Bearer ${store.getters.jwt}`,
      },
      data: {
        completed: value,
      },
    });
  }

  deleteTodo(todoId) {
    return this.http.request(`/${todoId}`, {
      method: 'delete',
      headers: {
        authorization: `Bearer ${store.getters.jwt}`,
      },
    });
  }
}

export default new TodoApi();
