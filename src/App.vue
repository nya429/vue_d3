<template>
  <div id="root">
    <Canvas :csv-data='csv_data' :variables='variableNames' />
  </div>
</template>

<script>
import Canvas from "./components/Canvas.vue";
import * as d3 from "d3";
import axios from "axios";

export default {
  name: "App",
  components: {
    Canvas
  },
  data() {
    return {
      variableNames: [
        "name",
        "mfr",
        "type",
        "Calories",
        "Protein",
        "Fat",
        "Sodium",
        "Fiber",
        "Carbohydrates",
        "Sugars",
        "shelf",
        "Potassium",
        "Vitamins",
        "weight",
        "cups"
      ],
      csv_data: []
    };
  },
  methods: {
    async loadData() {
      const raw = await d3.text("cereal.csv");
      const textString = raw
        .split("\n")
        .slice(0, 15)
        .filter(s => !s.includes("-1"))
        .join("\n");
      const headers = this.variableNames.join("\t") + "\n";
      return await d3.tsvParse(headers + textString.replaceAll(" ", "\t"));
      // .map(d => {
      //   delete d["shelf"];
      //   return d;
      // });
    }
  },
  async beforeMount() {
    const raw_data = await this.loadData();
    this.csv_data = raw_data;
    // console.log("CSV loaded", this.csv_data);
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
