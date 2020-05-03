<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="10">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-row class="d-flex flex-row pa-0 fill-height">
                <v-col class="d-flex justify-start">
                  <v-toolbar-title>Domain management</v-toolbar-title>
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
        <v-card-title class="headline">Do you really want to delete this domain?</v-card-title>
        <v-card-text>This operation cannot be undone. Please choose carefully how to proceed.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="proceedWithDelete">Yes, I want to.</v-btn>
          <v-btn color="primary darken-1" text @click="deleteDialog = false; toDelete = null;">No!</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="addDialog" persistent max-width="360">
      <v-card>
        <v-card-title>
          <span class="headline">Add domain</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-text-field
              v-model="selectedDomain"
              label="Domain name*"
              :rules="[() => !!selectedDomain || 'Please enter a domain name.']"
            ></v-text-field>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="addDialog = false; selectedDomain = null;">Close</v-btn>
          <v-btn color="blue darken-1" text @click="addDomain">Add domain</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-content>
</template>

<script>
import { config } from "../config";
import axios from "axios";

export default {
  name: "DomainsPage",
  components: {},
  data: () => ({
    domains: null,
    canaries: null,

    headers: [
      { text: "UUID", align: "start", value: "uuid" },
      { text: "Name", value: "name", width: "33%" },
      { text: "Number of canaries", value: "number", width: "33%" },
      { text: "Actions", value: "actions", sortable: false }
    ],

    tableData: [],
    loading: false,
    search: "",
    error: false,
    errorMessage: "",
    errorDetails: "",
    deleteDialog: false,
    toDelete: null,
    addDialog: false,
    selectedDomain: null
  }),
  methods: {
    async refreshData() {
      this.loading = true;
      await axios
        .all([
          axios.get(config.baseURL + "domains", {
            headers: this.$store.getters.getTokenHeader
          }),
          axios.get(config.baseURL + "canaries", {
            headers: this.$store.getters.getTokenHeader
          })
        ])
        .then(
          axios.spread((domains, canaries) => {
            this.domains = domains.data.domains;
            this.canaries = canaries.data.canaries;

            this.tableData = [];

            this.domains.forEach(domain => {
              var cc = this.canaries.filter(c => c.domain == domain.uuid)
                .length;
              this.tableData.push({
                uuid: domain.uuid,
                name: domain.domain,
                number: cc
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
    async proceedWithDelete() {
      axios
        .delete(config.baseURL + "domains/" + this.toDelete.uuid, {
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
    async addDomain() {
      if (this.selectedDomain == undefined) this.selectedDomain = null;
      axios
        .post(
          config.baseURL + "domains",
          {
            domains: [this.selectedDomain]
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

      this.addDialog = false;
    }
  },
  mounted() {
    this.refreshData();
  }
};
</script>
