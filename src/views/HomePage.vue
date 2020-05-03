<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="8">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Canary account management</v-toolbar-title>
              <v-spacer />
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer />
              <v-switch v-model="setup" label="Only setup" hide-details class="ma-5"></v-switch>
              <v-switch v-model="testing" label="Only testing" hide-details class="ma-5"></v-switch>
              <v-btn icon @click="refreshData" class="ma-1">
                <v-icon class="mr-2">mdi-refresh</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-alert
                border="right"
                colored-border
                type="error"
                elevation="2"
                v-model="error"
              >{{errorMessage}}: {{errorDetails}}</v-alert>

              <v-data-table
                :headers="headers"
                :items="tableData"
                :items-per-page="20"
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
                        @click="editItem(item)"
                        v-on="on"
                        color="primary"
                        v-if="item.setup"
                      >mdi-power</v-icon>
                      <v-icon class="mr-2" @click="editItem(item)" v-on="on" v-else>mdi-power</v-icon>
                    </template>
                    <span>Toogle setup</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-icon
                        class="mr-2"
                        @click="editItem(item)"
                        v-on="on"
                        color="teal"
                        v-if="item.testing"
                      >mdi-test-tube</v-icon>
                      <v-icon
                        class="mr-2"
                        @click="editItem(item)"
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
    canaries: null,

    tableData: [],
    search: "",
    error: false,
    errorMessage: "",
    errorDetails: "",
    testing: false,
    setup: false,
    loading: true
  }),
  methods: {
    async refreshData() {
      this.loading = true;
      this.tableData = [];
      await axios
        .all([
          axios.get(config.baseURL + "sites", {
            headers: this.$store.getters.getTokenHeader
          }),
          axios.get(config.baseURL + "canaries", {
            headers: this.$store.getters.getTokenHeader
          })
        ])
        .then(
          axios.spread((sites, canaries) => {
            this.sites = sites.data.sites;
            this.canaries = canaries.data.canaries;

            this.canaries.forEach(canary => {
              var ss = this.sites.find(s => s.uuid == canary.site);
              this.tableData.push({
                site: ss == null ? "-" : ss.site,
                email: canary.email,
                assignee: canary.assignee,
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
    }
  },
  computed: {
    headers() {
      return [
        { text: "Site", align: "start", value: "site" },
        { text: "E-mail", value: "email" },
        { text: "Assignee", value: "assignee" },
        {
          text: "Set-up",
          value: "setup",
          filter: value => {
            if (!this.setup) return true;

            return this.setup == value;
          }
        },
        {
          text: "Testing",
          value: "testing",
          filter: value => {
            if (!this.testing) return true;

            return this.testing == value;
          }
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
