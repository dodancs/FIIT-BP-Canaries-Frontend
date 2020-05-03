<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="10">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-row class="d-flex flex-row pa-0 fill-height">
                <v-col class="d-flex justify-start">
                  <v-toolbar-title>Canary account management</v-toolbar-title>
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
                  <v-switch v-model="setup" label="Only setup" hide-details class="pa-1 mr-5"></v-switch>
                  <v-switch v-model="testing" label="Only testing" hide-details class="pa-1 mr-3"></v-switch>
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
                group-by="site"
                :loading="loading"
                loading-text="Loading data, please wait..."
              >
                <template v-slot:item.setup="{ item }">
                  <v-simple-checkbox v-model="item.setup" disabled></v-simple-checkbox>
                </template>
                <template v-slot:item.testing="{ item }">
                  <v-simple-checkbox v-model="item.testing" disabled></v-simple-checkbox>
                </template>

                <template v-slot:item.actions="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        class="mr-2"
                        @click="toggleSetup(item)"
                        v-on="on"
                        color="indigo"
                        v-if="item.setup"
                      >mdi-power</v-icon>
                      <v-icon class="mr-2" @click="toggleSetup(item)" v-on="on" v-else>mdi-power</v-icon>
                    </template>
                    <span>Toogle setup</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        class="mr-2"
                        @click="toggleTesting(item)"
                        v-on="on"
                        color="teal"
                        v-if="item.testing"
                      >mdi-test-tube</v-icon>
                      <v-icon
                        class="mr-2"
                        @click="toggleTesting(item)"
                        v-on="on"
                        v-else
                      >mdi-test-tube-off</v-icon>
                    </template>
                    <span>Toogle testing</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        class="mr-2"
                        @click="editItem(item)"
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
                        @click="deleteItem(item)"
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
        <v-card-title class="headline">Do you really want to delete this canary?</v-card-title>
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
          <span class="headline">Edit canary</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-autocomplete
              :items="sitesAutocomplete"
              label="Site"
              v-model="selectedSite"
              clearable
            ></v-autocomplete>
            <v-autocomplete
              :items="usersAutocomplete"
              label="Assignee"
              v-model="selectedAssignee"
              clearable
            ></v-autocomplete>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="editDialog = false; selectedSite = null; selectedAssignee = null;"
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
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  :items="domainsAutocomplete"
                  label="Domain*"
                  v-model="selectedDomain"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  :items="sitesAutocomplete"
                  label="Site"
                  v-model="selectedSite"
                  clearable
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-switch v-model="selectedTesting" label="Testing*"></v-switch>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  v-model="selectedCount"
                  type="number"
                  label="Count*"
                  :rules="[() => !!selectedCount && selectedCount > 0 && selectedCount <= 1024 || 'Count must be from 1 to 1024']"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-select
                  v-model="selectedStrength"
                  :items="['trivial', 'simple', {text:'random (default)', value:'random'}, 'dictionary', 'strong']"
                  label="Password strength"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="addDialog = false; selectedDomain = null; selectedSite = null;"
          >Close</v-btn>
          <v-btn color="blue darken-1" text @click="addCanary">Generate canaries</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import { config } from "../config";
import axios from "axios";

export default {
  name: "HomePage",
  components: {},
  data: () => ({
    sites: null,
    sitesAutocomplete: null,
    domains: null,
    domainsAutocomplete: null,
    users: null,
    usersAutocomplete: null,
    canaries: null,

    tableData: [],
    search: "",
    error: false,
    errorMessage: "",
    errorDetails: "",
    testing: false,
    setup: false,
    loading: true,
    deleteDialog: false,
    toDelete: null,
    editDialog: false,
    toEdit: null,
    selectedSite: null,
    selectedAssignee: null,
    addDialog: false,
    selectedDomain: null,
    selectedTesting: false,
    selectedCount: 10,
    selectedStrength: null
  }),
  methods: {
    async refreshData() {
      this.loading = true;
      await axios
        .all([
          axios.get(config.baseURL + "sites", {
            headers: this.$store.getters.getTokenHeader
          }),
          axios.get(config.baseURL + "domains", {
            headers: this.$store.getters.getTokenHeader
          }),
          axios.get(config.baseURL + "canaries", {
            headers: this.$store.getters.getTokenHeader
          }),
          axios.get(config.baseURL + "auth/users", {
            headers: this.$store.getters.getTokenHeader
          })
        ])
        .then(
          axios.spread((sites, domains, canaries, users) => {
            this.sites = sites.data.sites;
            this.domains = domains.data.domains;
            this.canaries = canaries.data.canaries;
            this.users = users.data.users;

            this.tableData = [];
            this.sitesAutocomplete = [];
            this.domainsAutocomplete = [];
            this.usersAutocomplete = [];

            this.sites.forEach(site => {
              this.sitesAutocomplete.push({
                text: site.site,
                value: site.uuid
              });
            });

            this.domains.forEach(domain => {
              this.domainsAutocomplete.push({
                text: domain.domain,
                value: domain.uuid
              });
            });

            this.users.forEach(user => {
              if (user.permissions.includes("worker"))
                this.usersAutocomplete.push({
                  text: user.username + " (" + user.uuid + ")",
                  value: user.uuid
                });
            });

            this.canaries.forEach(canary => {
              var ss = this.sites.find(s => s.uuid == canary.site);
              var ass = this.users.find(u => u.uuid == canary.assignee);
              this.tableData.push({
                uuid: canary.uuid,
                site: ss == null ? "-" : ss.site,
                email: canary.email,
                assignee:
                  ass == null ? "" : ass.username + " (" + ass.uuid + ")",
                setup: canary.setup,
                testing: canary.testing
              });
            });
          })
        )
        .catch(error => {
          this.errorMessage = error.response.data.message;
          this.errorDetails = error.response.data.details;
          this.error = true;
        });
      this.loading = false;
    },
    async toggleTesting(item) {
      axios
        .put(
          config.baseURL + "canaries/" + item.uuid,
          {
            testing: !item.testing
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
    },
    async toggleSetup(item) {
      axios
        .put(
          config.baseURL + "canaries/" + item.uuid,
          {
            setup: !item.setup
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
    },
    editItem(item) {
      this.toEdit = item;
      var canary = this.canaries.find(c => c.uuid == item.uuid);
      var ss = this.sites.find(s => s.uuid == canary.site);
      var sa = this.users.find(u => u.uuid == canary.assignee);
      this.selectedSite = ss == null ? null : ss.uuid;
      this.selectedAssignee = sa == null ? null : sa.uuid;
      this.editDialog = true;
    },
    deleteItem(item) {
      this.toDelete = item.uuid;
      this.deleteDialog = true;
    },
    async proceedWithDelete() {
      axios
        .delete(config.baseURL + "canaries/" + this.toDelete, {
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
      if (this.selectedSite == undefined) this.selectedSite = null;
      if (this.selectedAssignee == undefined) this.selectedAssignee = null;
      axios
        .put(
          config.baseURL + "canaries/" + this.toEdit.uuid,
          {
            site: this.selectedSite,
            assignee: this.selectedAssignee
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
      this.toEdit = null;
      this.editDialog = false;
      this.selectedSite = null;
      this.selectedAssignee = null;
    },
    async addCanary() {
      if (this.selectedSite == undefined) this.selectedSite = null;
      axios
        .post(
          config.baseURL + "canaries",
          {
            domain: this.selectedDomain,
            site: this.selectedSite,
            testing: this.selectedTesting,
            count: this.selectedCount,
            password_strength: this.selectedStrength
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

      this.selectedDomain = null;
      this.selectedSite = null;
      this.selectedTesting = false;
      this.selectedCount = 10;
      this.selectedStrength = null;

      this.addDialog = false;
    }
  },
  computed: {
    headers() {
      return [
        { text: "Site", align: "start", value: "site" },
        { text: "E-mail", value: "email", width: "33%" },
        { text: "Assignee", value: "assignee", width: "33%" },
        {
          text: "Set-up",
          value: "setup",
          filter: value => {
            if (!this.setup) return true;

            return this.setup == value;
          },
          width: "8%"
        },
        {
          text: "Testing",
          value: "testing",
          filter: value => {
            if (!this.testing) return true;

            return this.testing == value;
          },
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
