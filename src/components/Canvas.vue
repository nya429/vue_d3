<template>
  <div id="canvas-container">
    <h3>Data Visulization HW1 P1</h3>
    <button @click="showStack">Stack</button>
    <button>Band</button>
    <button>Slop</button>
    <br />
    <svg id="canvas"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "Canvas",
  data() {
    return {
      margin: {
        top: 0,
        right: 10,
        bottom: 200,
        left: 30,
      },
      base: {
        height: 600,
        width: 1000,
      },
      svg: null,
    };
  },
  props: {
    csvData: Array,
    variables: Array,
  },
  watch: {
    csvData(newVal, oldVal) {
      // console.log('newVal', newVal.length, 'old', oldVal.length)
      this.renderStackChart();
    },
  },
  methods: {
    renderBandChart() {
      const variableNames = [
        "calories",
        "protein",
        "fat",
        "sodium",
        "fiber",
        "carbo",
        "sugars",
        "potass",
        "vitamins",
      ];

      const numVariables = variableNames.length;
      const numCases = this.csvData.length;
      const xz = d3.range(numCases);

      const yz = d3.range(numVariables).map((i) => {
        const key = variableNames[i];
        return this.csvData.map((d) => d[key]);
      });
    },
    renderStackChart() {
      /** Tooltip */
      const Tooltip = d3
        .select("#canvas-container")
        .append("div")
        .style("opacity", 0)
        .attr("id", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

      const mouseover = function (d) {
        Tooltip.style("opacity", 1);
        d3.select(this).style("stroke", "black").style("opacity", 1);
      };
      const mousemove = function (e, d) {
        console.log(e, d);
        Tooltip.html("The exact value of<br>this cell is: " + d.value)
          .style("left", d3.pointer(e)[0] + 70 + "px")
          .style("top", d3.pointer(e)[1] + "px");
      };
      const mouseleave = function () {
        Tooltip.style("opacity", 0);
        d3.select(this).style("stroke", "none").style("opacity", 0.8);
      };

      const variableNames = [
        "calories",
        "protein",
        "fat",
        "sodium",
        "fiber",
        "carbo",
        "sugars",
        "potass",
        "vitamins",
      ];

      const numVariables = variableNames.length;
      const numCases = this.csvData.length;
      let xz = d3.range(numCases);

      const yz = d3.range(numVariables).map((i) => {
        const key = variableNames[i];
        return this.csvData.map((d) => d[key]);
      });

      const y01z = d3
        .stack()
        .keys(d3.range(numVariables))(d3.transpose(yz)) // stacked yz
        .map((data, i) => data.map(([y0, y1]) => [y0, y1, i]));

      const yMax = d3.max(yz, (y) => d3.max(y));
      const y1Max = d3.max(y01z, (y) => d3.max(y, (d) => d[1]));

      let x = d3
        .scaleBand()
        .domain(xz)
        .rangeRound([this.margin.left, this.base.width - this.margin.right])
        .padding(0.08);

      const y = d3
        .scaleLinear()
        .domain([0, y1Max])
        .range([this.base.height - this.margin.bottom, this.margin.top]);

      const z = d3
        .scaleSequential(d3.interpolateBlues)
        .domain([-0.5 * numVariables, 1.5 * numVariables]);

      let xAxis = (svg) =>
        svg
          .append("g")
          .attr("class", "xtick")
          .attr(
            "transform",
            `translate(0, ${this.base.height - this.margin.bottom})`
          )
          .call(
            d3
              .axisBottom(x)
              .tickSizeOuter(0)
              .tickFormat((i) => this.csvData[i]["name"])
          )
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

      const svg = d3.select("#canvas");

      const rect = this.svg
        .selectAll("g")
        .data(y01z)
        .enter()
        .append("g")
        .attr("class", (d, i) => variableNames[i])
        .attr("fill", (d, i) => z(i))
        .selectAll("rect")
        .data((d) => d)
        .enter()
        .append("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", this.base.height - this.margin.bottom)
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .on("mouseover", mouseover)
        .on("mousemove", (e, d) => mousemove(e, d))
        .on("mouseleave", mouseleave);

      this.svg.call(xAxis);

      y.domain([0, y1Max]);

      rect
        .transition()
        .duration(500)
        .delay((d, i) => i * 20)
        .attr("y", (d) => y(d[1]))
        .attr("height", (d) => y(d[0]) - y(d[1]))
        .transition()
        .attr("x", (d, i) => x(i))
        .attr("width", x.bandwidth());

      // test sort
      setTimeout(() => {
        const keys = variableNames;

        xz = d3.range(xz.length).sort((a, b) => {
          var diff =
            d3.sum(keys.map((key) => this.csvData[a][key])) -
            d3.sum(keys.map((key) => this.csvData[b][key]));
          return diff;
        });

        x = d3
          .scaleBand()
          .domain(xz)
          .rangeRound([this.margin.left, this.base.width - this.margin.right])
          .padding(0.08);

        rect
          .transition()
          // .delay((d, i) => 2000)
          .duration(1000)
          // .delay((d, i) => i * 20)
          .attr("x", (d, i) => x(i))
          .transition();

        this.svg
          .select(".xtick")
          .selectAll(".tick")
          .transition()
          .duration(1000)
          .attr(
            "transform",
            (d, i) =>
              `translate(${x(i) + x.bandwidth() / 2}, ${0})`
          );
      }, 3000);

      // .attr("width", x.bandwidth());
    },
    renderBase() {
      const svg = d3.select("#canvas");

      svg
        .attr("viewBox", [0, 0, this.base.width, this.base.height])
        .attr("width", this.base.width)
        .attr("height", this.base.height);
      this.svg = svg;
    },
    showStack() {
      this.renderStackChart();
    },
  },
  mounted() {
    this.renderBase();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
