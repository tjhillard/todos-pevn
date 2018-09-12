<template>
  <div class="home mt-2">
    <v-flex
      sm10 offset-sm1
      md8 offset-md2
      lg6 offset-lg3
      xl4 offset-xl4>
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
            <v-btn depressed block color="accent">All</v-btn>
          </v-flex>
          <v-flex xs-4>
            <v-btn depressed block>Active</v-btn>
          </v-flex>
          <v-flex xs-4>
            <v-btn depressed block>Completed</v-btn>
          </v-flex>
        </v-layout>
        <v-list three-line style="background-color: #fafafa;">
          <v-list-tile v-for="todo in todos" :key="todo.id">
            <v-list-tile-action>
              <v-checkbox></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ todo.description }}</v-list-tile-title>
              <v-list-tile-sub-title>{{ todo.created_at }}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-icon>delete_outline</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </div>
    </v-flex>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TodoApi from '@/services/api/todo-api-service';

export default {
  name: 'home',
  data() {
    return {
      newTodo: '',
      todos: [],
      pageNumber: 1,
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
  methods: {
    fetchTodos() {
      TodoApi
        .getPaginatedTodos(this.pageNumber, this.jwt)
        .then((res) => {
          if (!res.data.error && res.status === 200) {
            this.todos = res.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    addTodo() {
      TodoApi
        .addNewTodo(this.newTodo, this.jwt)
        .then((res) => {
          if (res.status === 200) {
            this.newTodo = '';
            this.todos.unshift(res.data.data);
          }
        });
    },
  },
};
</script>
