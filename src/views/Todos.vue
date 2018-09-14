<template>
  <div class="home mt-1">
    <v-flex
      sm10 offset-sm1
      md8 offset-md2
      lg6 offset-lg3
      xl4 offset-xl4>
      <v-alert
        :value="true"
        type="error"
        v-if="errorMessage"
      >
        {{ errorMessage }}
      </v-alert>
      <v-snackbar
        v-model="snackbar.show"
        color="success"
        :timeout="snackbar.timeout"
        top
      >
        <v-icon color="white">{{ snackbar.icon }}</v-icon>{{ snackbar.message }}
      </v-snackbar>
      <div class="pa-4">
        <div v-if="isLoaded">
          <div v-if="todoDescriptions.length == 0">
            <h2>I need something new to do...</h2>
          </div>
          <div v-else-if="todoDescriptions.length == 1">
            <h2>I need to {{ todoDescriptions[0] }}.</h2>
          </div>
          <div v-else>
            <h2>I've got {{ activeTodos.length }} tasks to complete.</h2>
          </div>
        </div>
        <v-text-field
          label="Add new todo"
          v-model="newTodo"
          clearable
          color="dark"
          @keydown.enter="addTodo"
        ></v-text-field>
        <v-layout row>
          <v-flex xs-4>
            <v-btn
              depressed
              block
              @click="setFilterBy('all')"
              :class="{ accent: filterBy === 'all' }">
              All ({{ todosCache.length }})
            </v-btn>
          </v-flex>
          <v-flex xs-4>
            <v-btn
              depressed
              block
              @click="setFilterBy('active')"
              :class="{ accent: filterBy === 'active' }">
              Active ({{ activeTodos.length }})
            </v-btn>
          </v-flex>
          <v-flex xs-4>
            <v-btn
              depressed
              block
              @click="setFilterBy('completed')"
              :class="{ accent: filterBy === 'completed' }">
              Completed ({{ completedTodos.length }})
            </v-btn>
          </v-flex>
        </v-layout>
        <v-list three-line style="background-color: #fafafa;">
          <v-list-tile v-for="todo in todos" :key="todo.id">
            <v-list-tile-action>
              <v-checkbox @change="setTodoCompletedness(todo.id)" v-model="todo.completed"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ todo.description }}</v-list-tile-title>
              <v-list-tile-sub-title>
                Added {{ todo.created_at | formatTimeDistance }} ago
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon style="cusor: pointer;" @click="deleteTodo(todo.id)">delete_outline</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </div>
    </v-flex>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import distanceInWords from 'date-fns/distance_in_words';
import TodoApi from '@/services/api/todo-api-service';

export default {
  name: 'todos',
  data() {
    return {
      isLoaded: false,
      newTodo: '',
      todosCache: [],
      todos: [],
      filterBy: 'all',
      errorMessage: '',
      snackbar: {
        show: false,
        icon: 'check',
        timeout: 3000,
        message: '',
      },
    };
  },
  mounted() {
    this.fetchTodos();
  },
  computed: {
    ...mapGetters([
      'user',
      'jwt',
    ]),
    todoDescriptions() {
      const descriptions = [];
      this.todosCache.forEach((todo) => {
        if (!todo.completed) {
          descriptions.push(`${todo.description}.`);
        }
      });
      return descriptions;
    },
    activeTodos() {
      return this.todosCache.filter((todo) => {
        return !todo.completed;
      });
    },
    completedTodos() {
      return this.todosCache.filter((todo) => {
        return todo.completed;
      });
    },
  },
  watch: {
    filterBy(val) {
      if (val === 'active') {
        this.todos = this.activeTodos;
        return;
      }
      if (val === 'completed') {
        this.todos = this.completedTodos;
        return;
      }
      this.fetchTodos();
    },
  },
  methods: {
    fetchTodos() {
      this.errorMessage = '';
      TodoApi
        .getPaginatedTodos(1)
        .then((res) => {
          if (!res.data.error) {
            this.todosCache = res.data.data;
            this.todos = res.data.data;
            this.isLoaded = true;
          }
        })
        .catch((err) => {
          this.errorMessage = 'There was a problem fetching your todos. Please try again.';
          this.isLoaded = true;
        });
    },
    addTodo() {
      TodoApi
        .addNewTodo(this.newTodo)
        .then((res) => {
          if (res.status === 200) {
            this.newTodo = '';
            this.todos.unshift(res.data.data);
            this.showSnackbar('Todo added!');
          }
        })
        .catch(() => {
          this.errorMessage = 'Error adding todo. Refresh the page and try again.';
        });
    },
    setTodoCompletedness(todoId) {
      const todoToToggle = this.todos.find((todo) => todo.id === todoId);
      if (todoToToggle.completed) {
        if (this.activeTodos.length > 0) {
          this.showSnackbar(`Nice! 1 down and ${this.activeTodos.length} to go.`);
        } else {
          this.showSnackbar('Sweet. That\'s all of em. 💪');
        }
      }
      TodoApi
        .completeTodo(todoId, todoToToggle.completed)
        .catch(() => {
          this.errorMessage = 'Error updating todo. Refresh the page and try again.';
        });
    },
    deleteTodo(todoId) {
      TodoApi
        .deleteTodo(todoId)
        .then((res) => {
          this.fetchTodos();
          this.showSnackbar('Todo deleted.');
        })
        .catch(() => {
          this.errorMessage = 'Error deleting todo. Refresh the page and try again.';
        });
    },
    setFilterBy(value) {
      this.filterBy = value;
    },
    showSnackbar(message, style = 'success', icon = 'check') {
      this.snackbar = {
        show: true,
        message,
        style,
        icon,
      };
    },
  },
  filters: {
    formatTimeDistance(value) {
      return distanceInWords(value, new Date());
    },
  },
};
</script>

