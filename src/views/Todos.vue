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
              @click="setFilterByOption('all')"
              :class="{ accent: filterBy === 'all' }">
              All ({{ todosCache.length }})
            </v-btn>
          </v-flex>
          <v-flex xs-4>
            <v-btn
              depressed
              block
              @click="setFilterByOption('active')"
              :class="{ accent: filterBy === 'active' }">
              Active ({{ activeTodos.length }})
            </v-btn>
          </v-flex>
          <v-flex xs-4>
            <v-btn
              depressed
              block
              @click="setFilterByOption('completed')"
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
import format from 'date-fns/format';
import distanceInWords from 'date-fns/distance_in_words';
import TodoApi from '@/services/api/todo-api-service';

export default {
  name: 'todos',
  data() {
    return {
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
      isLoaded: false,
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
        });
    },
    addTodo() {
      TodoApi
        .addNewTodo(this.newTodo)
        .then((res) => {
          if (res.status === 200) {
            this.newTodo = '';
            this.todos.unshift(res.data.data);
            this.snackbar.message = 'Todo added.';
            this.snackbar.show = true;
          }
        });
    },
    setTodoCompletedness(todoId) {
      const todoToToggle = this.todos.find((todo) => todo.id === todoId);
      TodoApi.completeTodo(todoId, todoToToggle.completed);
    },
    deleteTodo(todoId) {
      TodoApi
        .deleteTodo(todoId)
        .then((res) => {
          this.fetchTodos();
          this.snackbar.message = `Todo ${todoId} deleted.`;
          this.snackbar.show = true;
        });
    },
    setFilterByOption(value) {
      this.filterBy = value;
    },
  },
  filters: {
    formatDateTime(value) {
      return format(value, 'MM/DD/YYYY h:mm:ss');
    },
    formatTimeDistance(value) {
      return distanceInWords(value, new Date());
    },
  },
};
</script>

