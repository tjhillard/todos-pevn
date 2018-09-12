<template>
  <div class="home mt-2">
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
      <div class="pa-4">
        <h1>My Todos ({{ todos.length }})</h1>
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
              All
            </v-btn>
          </v-flex>
          <v-flex xs-4>
            <v-btn
              depressed
              block
              @click="setFilterByOption('active')"
              :class="{ accent: filterBy === 'active' }">
              Active
            </v-btn>
          </v-flex>
          <v-flex xs-4>
            <v-btn
              depressed
              block
              v-on:click="setFilterByOption('completed')"
              :class="{ accent: filterBy === 'completed' }">
              Completed
            </v-btn>
          </v-flex>
        </v-layout>
        <v-list three-line style="background-color: #fafafa;">
          <v-list-tile v-for="todo in todos" :key="todo.id">
            <v-list-tile-action>
              <v-checkbox @change="toggleTodoCompletedness(todo.id)" v-model="todo.completed"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ todo.description }}</v-list-tile-title>
              <v-list-tile-sub-title>
                Added {{ todo.created_at | formatTimeDistance }} ago @
                {{ todo.created_at | formatDateTime }}
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
  name: 'home',
  data() {
    return {
      newTodo: '',
      todosCache: [],
      todos: [],
      filterBy: 'all',
      errorMessage: '',
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
  },
  watch: {
    filterBy(val) {
      if (val === 'active') {
        this.todos = this.todosCache.filter((todo) => {
          return !todo.completed;
        });
        return;
      }
      if (val === 'completed') {
        this.todos = this.todosCache.filter((todo) => {
          return todo.completed;
        });
        return;
      }
      return this.fetchTodos();
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
          }
        });
    },
    toggleTodoCompletedness(todoId) {
      const todoToToggle = this.todos.find((todo) => todo.id === todoId);
      if (todoToToggle === false) {
        return TodoApi
          .completeTodo(todoId)
          .then((res) => {
            if (res.status === 200) {
              todoToToggle.completeTodo = true;
            }
          });
      }
      TodoApi
        .uncompleteTodo(todoId)
        .then((res) => {
          if (res.status === 200) {
            todoToToggle.completeTodo = false;
          }
        });
    },
    deleteTodo(todoId) {
      TodoApi
        .deleteTodo(todoId)
        .then((res) => {
          this.fetchTodos();
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
