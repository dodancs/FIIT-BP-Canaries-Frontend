<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="10">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-row class="d-flex flex-row pa-0 fill-height">
                <v-col class="d-flex justify-start">
                  <v-toolbar-title>User management</v-toolbar-title>
                </v-col>
                <v-col class="d-flex justify-space-around">
                  <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Search"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-col>
                <v-col class="d-flex justify-end">
                  <v-switch v-model="worker" label="Only workers" hide-details class="pa-1 mr-5"></v-switch>
                  <v-switch v-model="expert" label="Only experts" hide-details class="pa-1 mr-3"></v-switch>
                  <v-btn icon @click="refreshData" class="mt-n2 mr-3">
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                  <v-btn icon @click="addDialog = true" class="mt-n2">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-toolbar>
            <v-card-text>
              <v-alert
                border="right"
                colored-border
                type="error"
                elevation="2"
                v-model="error"
                dismissible
                class="pr-7"
              >{{errorMessage}}: {{errorDetails}}</v-alert>

              <v-data-table
                :headers="headers"
                :items="tableData"
                :items-per-page="10"
                :search="search"
                class="elevation-1"
                :loading="loading"
                loading-text="Loading data, please wait..."
              >
                <template v-slot:item.actions="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        class="mr-2"
                        @click="toEdit = item; selectedPermissions = item.permissions; editDialog = true;"
                        v-on="on"
                        color="primary"
                      >mdi-pencil</v-icon>
                    </template>
                    <span>Edit</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        class="mr-2"
                        @click="toDelete = item; deleteDialog = true;"
                        v-on="on"
                        color="red"
                      >mdi-delete</v-icon>
                    </template>
                    <span>Delete</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="deleteDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Do you really want to delete this user?</v-card-title>
        <v-card-text>This operation cannot be undone. Please choose carefully how to proceed.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="proceedWithDelete">Yes, I want to.</v-btn>
          <v-btn color="primary darken-1" text @click="deleteDialog = false; toDelete = null;">No!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit user</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="selectedPassword"
              label="Password"
              type="password"
              :rules="[() => !selectedPassword || selectedPassword.length > 7 || 'Password needs to be at least 8 characters']"
            ></v-text-field>
            <v-autocomplete
              :items="['admin', 'worker', 'expert']"
              label="Permissions"
              v-model="selectedPermissions"
              :rules="[() => !!selectedPermissions && selectedPermissions != undefined && selectedPermissions.length > 0 || 'Please select at least one permission']"
              clearable
              multiple
            ></v-autocomplete>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="editDialog = false; selectedPassword = null; selectedPermissions = null;"
          >Close</v-btn>
          <v-btn color="blue darken-1" text @click="proceedWithEdit">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Generate canary accounts</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="selectedUsername"
              label="Username*"
              :rules="[() => !!selectedUsername || 'Please enter a username', () => selectedUsername.length > 3 || 'Username needs to be at least 4 characters']"
            ></v-text-field>

            <v-text-field
              v-model="selectedPassword"
              label="Password*"
              type="password"
              :rules="[() => !!selectedPassword || 'Please enter a password', () => selectedPassword.length > 7 || 'Password needs to be at least 8 characters']"
            ></v-text-field>

            <v-autocomplete
              :items="['admin', 'worker', 'expert']"
              label="Permissions*"
              v-model="selectedPermissions"
              :rules="[() => !!selectedPermissions && selectedPermissions != undefined && selectedPermissions.length > 0 || 'Please select at least one permission']"
              clearable
              multiple
            ></v-autocomplete>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="addDialog = false; selectedUsername = null; selectedPassword = null; selectedPermissions = null;"
          >Close</v-btn>
          <v-btn color="blue darken-1" text @click="addUser">Add user</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import { config } from "../config";
import axios from "axios";

export default {
  name: "UsersPage",
  components: {},
  data: () => ({
    users: null,
    canaries: null,

    tableData: [],
    search: "",
    error: false,
    errorMessage: "",
    errorDetails: "",
    worker: false,
    expert: false,
    loading: true,
    deleteDialog: false,
    toDelete: null,
    editDialog: false,
    toEdit: null,
    addDialog: false,
    selectedPermissions: null,
    selectedUsername: null,
    selectedPassword: null
  }),
  methods: {
    async refreshData() {
      this.loading = true;
      await axios
        .all([
          axios.get(config.baseURL + "canaries", {
            headers: this.$store.getters.getTokenHeader
          }),
          axios.get(config.baseURL + "auth/users", {
            headers: this.$store.getters.getTokenHeader
          })
        ])
        .then(
          axios.spread((canaries, users) => {
            this.canaries = canaries.data.canaries;
            this.users = users.data.users;

            this.tableData = [];

            this.users.forEach(user => {
              var ass = this.canaries.filter(c => c.assignee == user.uuid)
                .length;
              this.tableData.push({
                uuid: user.uuid,
                username: user.username,
                permissionsDisplay: user.permissions.join(","),
                permissions: user.permissions,
                canariesCount: ass,
                canaries: user.canaries
              });
            });
          })
        )
        .catch(error => {
          console.log(error);
          this.errorMessage = error.response.data.message;
          this.errorDetails = error.response.data.details;
          this.error = true;
        });
      this.loading = false;
    },
    async proceedWithDelete() {
      axios
        .delete(config.baseURL + "auth/users/" + this.toDelete.uuid, {
          headers: this.$store.getters.getTokenHeader
        })
        .then(() => {
          this.refreshData();
        })
        .catch(error => {
          this.errorMessage = error.response.data.message;
          this.errorDetails = error.response.data.details;
          this.error = true;
        });
      this.toDelete = null;
      this.deleteDialog = false;
    },
    async proceedWithEdit() {
      if (
        this.selectedPermissions == undefined ||
        this.selectedPermissions == null ||
        this.selectedPermissions.length < 1
      )
        return;

      if (
        this.selectedPermissions == this.toEdit.permissions &&
        (this.selectedPassword == undefined ||
          this.selectedPassword == null ||
          this.selectedPassword.length < 8)
      ) {
        this.selectedPermissions = null;
        this.editDialog = false;
        return;
      }

      var request = {};

      if (this.selectedPermissions != this.toEdit.permissions) {
        request.permissions = this.selectedPermissions;
      }

      if (
        this.selectedPassword != undefined &&
        this.selectedPassword != null &&
        this.selectedPassword.length >= 8
      ) {
        request.password = this.selectedPassword;
      }

      axios
        .put(config.baseURL + "auth/users/" + this.toEdit.uuid, request, {
          headers: this.$store.getters.getTokenHeader
        })
        .then(() => {
          this.refreshData();
        })
        .catch(error => {
          this.errorMessage = error.response.data.message;
          this.errorDetails = error.response.data.details;
          this.error = true;
        });

      this.selectedPassword = null;
      this.selectedPermissions = null;
      this.editDialog = false;
    },
    async addUser() {
      if (
        this.selectedUsername == undefined ||
        this.selectedUsername == null ||
        this.selectedUsername.length <= 3
      ) {
        this.selectedUsername = null;
        this.selectedPassword = null;
        this.selectedPermissions = null;
        return;
      }
      if (
        this.selectedPassword == undefined ||
        this.selectedPassword == null ||
        this.selectedPassword.length < 8
      ) {
        this.selectedUsername = null;
        this.selectedPassword = null;
        this.selectedPermissions = null;
        return;
      }
      if (
        this.selectedPermissions == undefined ||
        this.selectedPermissions == null ||
        this.selectedPermissions.length < 1
      ) {
        this.selectedUsername = null;
        this.selectedPassword = null;
        this.selectedPermissions = null;
        return;
      }

      console.log(this.selectedUsername);

      axios
        .post(
          config.baseURL + "auth/users",
          {
            users: [
              {
                username: this.selectedUsername,
                password: this.selectedPassword,
                permissions: this.selectedPermissions,
                canaries: []
              }
            ]
          },
          {
            headers: this.$store.getters.getTokenHeader
          }
        )
        .then(() => {
          this.refreshData();
        })
        .catch(error => {
          this.errorMessage = error.response.data.message;
          this.errorDetails = error.response.data.details;
          this.error = true;
        });

      this.selectedUsername = null;
      this.selectedPassword = null;
      this.selectedPermissions = null;

      this.addDialog = false;
    }
  },
  computed: {
    headers() {
      return [
        { text: "UUID", align: "start", value: "uuid", width: "25%" },
        { text: "Username", value: "username", width: "20%" },
        {
          text: "Permissions",
          value: "permissionsDisplay",
          width: "33%",
          filter: value => {
            if (!this.worker && !this.expert) return true;
            var perms = value.split(",");
            return (
              (this.worker && perms.includes("worker")) ||
              (this.expert && perms.includes("expert"))
            );
          }
        },
        {
          text: "Canaries",
          value: "canariesCount",
          width: "8%"
        },
        { text: "Actions", value: "actions", sortable: false }
      ];
    }
  },
  mounted() {
    this.refreshData();
  }
};
</script>
