<template>
  <div>
    <h2>HW2</h2>
    <br>
    <li>
      <input type="radio" id="stack" name="stack" value="Q1" v-model="Q" />
      <label for="stack">Question 1</label>
      <span>&nbsp;</span>
      <input type="radio" id="band" name="band" value="Q3" v-model="Q" />
      <label for="band">Question 3</label>
    </li>
    <br> <br>
    <div v-if="Q==='Q1'" id='Q1'>
      <h3>Redesign of Location Platforms</h3>
      <br />

    </div>

    <div v-if="Q==='Q3'" id='Q3'>
      <h3>Paper Acceptance Rate for the Main AI Conferences</h3>
      <ul>
        <li>
          <h4>Scale Type</h4>
        </li>
        <li>
          <input v-bind:disabled="!rendered" type="radio" id="number" name="number" value="number" v-model="chartType" />
          <label for="number">By Number</label>
          <span>&nbsp;</span>
          <input v-bind:disabled="!rendered" type="radio" id="percentile" name="percentile" value="percentile" v-model="chartType" />
          <label for="percentile">By Percentile</label>
        </li>
      </ul>

    </div>
    <div id="canvas-container">
      <svg id="canvas"></svg>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";
import { switchCase } from "@babel/types";

const rawData = [
  {
    Name: "Here",
    MapsData: 88,
    LocationIntelligence: 82,
    LocationServices: 77,
    Platform: 72,
    DeveloperEcosystem: 64,
    Partners: 67,
    Customers: 66
  },
  {
    Name: "Google",
    MapsData: 87,
    LocationIntelligence: 80,
    LocationServices: 72,
    Platform: 46,
    DeveloperEcosystem: 54,
    Partners: 57,
    Customers: 55
  },
  {
    Name: "Tomtom",
    MapsData: 72,
    LocationIntelligence: 66,
    LocationServices: 65,
    Platform: 38,
    DeveloperEcosystem: 42,
    Partners: 56,
    Customers: 48
  },
  {
    Name: "Amap.com",
    MapsData: 53,
    LocationIntelligence: 54,
    LocationServices: 55,
    Platform: 42,
    DeveloperEcosystem: 42,
    Partners: 37,
    Customers: 34
  },
  {
    Name: "Mapbox",
    MapsData: 51,
    LocationIntelligence: 45,
    LocationServices: 42,
    Platform: 36,
    DeveloperEcosystem: 49,
    Partners: 44,
    Customers: 39
  },
  {
    Name: "Baidu",
    MapsData: 54,
    LocationIntelligence: 51,
    LocationServices: 53,
    Platform: 25,
    DeveloperEcosystem: 39,
    Partners: 39,
    Customers: 33
  },
  {
    Name: "Zerin",
    MapsData: 50,
    LocationIntelligence: 47,
    LocationServices: 51,
    Platform: 25,
    DeveloperEcosystem: 36,
    Partners: 38,
    Customers: 36
  },
  {
    Name: "NavInfo",
    MapsData: 51,
    LocationIntelligence: 46,
    LocationServices: 49,
    Platform: 20,
    DeveloperEcosystem: 33,
    Partners: 40,
    Customers: 40
  },
  {
    Name: "Esri",
    MapsData: 49,
    LocationIntelligence: 41,
    LocationServices: 29,
    Platform: 51,
    DeveloperEcosystem: 44,
    Partners: 31,
    Customers: 30
  },
  {
    Name: "AzureMaps",
    MapsData: 32,
    LocationIntelligence: 37,
    LocationServices: 31,
    Platform: 41,
    DeveloperEcosystem: 49,
    Partners: 40,
    Customers: 27
  },
  {
    Name: "MapmyIndia",
    MapsData: 48,
    LocationIntelligence: 32,
    LocationServices: 33,
    Platform: 19,
    DeveloperEcosystem: 35,
    Partners: 42,
    Customers: 39
  },
  {
    Name: "Naver",
    MapsData: 48,
    LocationIntelligence: 52,
    LocationServices: 38,
    Platform: 24,
    DeveloperEcosystem: 29,
    Partners: 28,
    Customers: 23
  },
  {
    Name: "Sygic",
    MapsData: 47,
    LocationIntelligence: 44,
    LocationServices: 33,
    Platform: 16,
    DeveloperEcosystem: 24,
    Partners: 36,
    Customers: 36
  },
  {
    Name: "Telenav",
    MapsData: 49,
    LocationIntelligence: 37,
    LocationServices: 48,
    Platform: 22,
    DeveloperEcosystem: 31,
    Partners: 26,
    Customers: 24
  },
  {
    Name: "Apple",
    MapsData: 54,
    LocationIntelligence: 42,
    LocationServices: 44,
    Platform: 18,
    DeveloperEcosystem: 26,
    Partners: 25,
    Customers: 22
  },
  {
    Name: "BingMaps",
    MapsData: 41,
    LocationIntelligence: 36,
    LocationServices: 39,
    Platform: 16,
    DeveloperEcosystem: 31,
    Partners: 26,
    Customers: 24
  },
  {
    Name: "Navmii",
    MapsData: 37,
    LocationIntelligence: 29,
    LocationServices: 30,
    Platform: 15,
    DeveloperEcosystem: 21,
    Partners: 31,
    Customers: 26
  },
  {
    Name: "Kakao",
    MapsData: 38,
    LocationIntelligence: 34,
    LocationServices: 36,
    Platform: 15,
    DeveloperEcosystem: 25,
    Partners: 21,
    Customers: 26
  },
  {
    Name: "Tencent",
    MapsData: 34,
    LocationIntelligence: 30,
    LocationServices: 38,
    Platform: 16,
    DeveloperEcosystem: 28,
    Partners: 20,
    Customers: 15
  },
  {
    Name: "Tmap",
    MapsData: 27,
    LocationIntelligence: 28,
    LocationServices: 27,
    Platform: 18,
    DeveloperEcosystem: 22,
    Partners: 28,
    Customers: 26
  },
  {
    Name: "HyundaiAutoEver",
    MapsData: 41,
    LocationIntelligence: 41,
    LocationServices: 39,
    Platform: 12,
    DeveloperEcosystem: 15,
    Partners: 17,
    Customers: 11
  },
  {
    Name: "Yandex",
    MapsData: 32,
    LocationIntelligence: 33,
    LocationServices: 29,
    Platform: 17,
    DeveloperEcosystem: 21,
    Partners: 25,
    Customers: 18
  },
  {
    Name: "Otonomo",
    MapsData: 0,
    LocationIntelligence: 9,
    LocationServices: 7,
    Platform: 45,
    DeveloperEcosystem: 43,
    Partners: 20,
    Customers: 33
  },
  {
    Name: "NaviTeL",
    MapsData: 33,
    LocationIntelligence: 25,
    LocationServices: 27,
    Platform: 10,
    DeveloperEcosystem: 15,
    Partners: 24,
    Customers: 18
  },
  {
    Name: "Mapquest",
    MapsData: 26,
    LocationIntelligence: 18,
    LocationServices: 26,
    Platform: 11,
    DeveloperEcosystem: 22,
    Partners: 21,
    Customers: 18
  },
  {
    Name: "Cart",
    MapsData: 0,
    LocationIntelligence: 0,
    LocationServices: 0,
    Platform: 50,
    DeveloperEcosystem: 36,
    Partners: 20,
    Customers: 31
  },
  {
    Name: "ComTech",
    MapsData: 27,
    LocationIntelligence: 16,
    LocationServices: 19,
    Platform: 9,
    DeveloperEcosystem: 25,
    Partners: 21,
    Customers: 16
  }
];

export default {
  name: "Canvas",
  data() {
    return {
      Q: "Q1",
      chartType: "number",
      margin: {
        top: 50,
        right: 200,
        bottom: 200,
        left: 200
      },
      base: {
        height: 650,
        width: 1400
      },
      rendered: false,
      xz: 0,
      react: [],
      checkedVariables: [],
      variableList: [],
      variableUnit: {},
      svg: null,
      csvData: [],
      defaultVariableNames: [],
      variableRange: [],
      csvData2: [],
      defaultVariableNames2: [],
      yz: [],
      yzNorm: [],
      y01z: 0,
      y02z: 0,
      yMax1: 0,
      yMax2: 0,
      y: 0
    };
  },
  props: {
    // csvData: Array,
    // variables: Array
  },
  watch: {
    chartType(val) {
      this.reRenderStackChart2(val);
    },
    Q(val) {
      this.clearAll();
      switch (val) {
        case "Q1":
          this.renderStackChart();
          return;
        case "Q3":
          this.renderStackChart2();
          return;
      }
    }
  },
  methods: {
    async loadCsv() {
      const raw = await d3.csv("data-1.csv");
      return raw;
    },
    clearAll() {
      // this.checkedVariables = this.variableList;
      d3.selectAll("svg > *").remove();
    },
    renderBase() {
      const svg = d3.select("#canvas");

      svg
        .attr("viewBox", [0, 0, this.base.width, this.base.height])
        .attr("width", this.base.width)
        .attr("height", this.base.height);
      this.svg = svg;
    },
    renderStackChart() {
      const svg = d3.select("#canvas");
      let Tooltip;
      if (d3.selectAll("#canvas-container #tooltip").size() === 0) {
        Tooltip = d3
          .select("#canvas-container")
          .append("div")
          .style("opacity", 0)
          .attr("id", "tooltip")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "2px")
          .style("border-radius", "5px")
          .style("padding", "5px")
          .style(" max-width", "300px")
          .style("position", "absolute");
      } else {
        Tooltip = d3.select("#tooltip");
      }
      // if ()

      // const mouseover = function () {
      //   Tooltip.style("opacity", 1);
      //   // console.log(d);
      //   // const key = d[3];
      //   // const groupp = d3.select(this.parentNode).datum();
      //   // console.log(key, groupp);
      //   d3.select(this).style("stroke", "black");
      //   // .style("opacity", 1);
      // };

      const variableNames = this.defaultVariableNames.slice(1);

      const numVariables = variableNames.length;
      //   console.log(numVariables);
      const csvData = this.csvData;
      const numCases = csvData.length;

      this.xz = d3.range(numCases);

      let yz = d3.range(numVariables).map(i => {
        const key = variableNames[i];
        return this.csvData.map(d => d[key]);
      });
      let ysum = d3.range(numCases).map(i => {
        return d3.sum(
          d3.range(numVariables).map(j => this.csvData[i][variableNames[j]])
        );
      });
      //   console.log(ysum);
      const y01z = d3
        .stack()
        .keys(d3.range(numVariables))(d3.transpose(yz)) // stacked yz
        .map((data, i) =>
          data.map(([y0, y1], idx) => [
            y0,
            y1,
            i,
            variableNames[i],
            idx,
            this.variableRange[i],
            ysum[idx]
          ])
        );

      const mousemove = function(e, d) {
        Tooltip.style("left", d3.pointer(e)[0] + 70 + "px").style(
          "top",
          d3.pointer(e)[1] + "px"
        );
      };
      const mouseleave = function() {
        Tooltip.style("opacity", 0);
        d3.select(this).style("stroke", "none");
        svg
          .select(".xtick")
          .selectAll(".tick")
          .style("opacity", 1);

        variableNames.map(key => {
          svg
            .select(`.${key}`)
            .selectAll("rect")
            .style("opacity", 1);
        });
        // .style("opacity", 0.8);
      };

      const yMax = d3.max(yz, y => d3.max(y));
      //   const y1Max = d3.max(y01z, y => d3.max(y, d => d[1]));
      const y1Max = 550;

      let x = d3
        .scaleBand()
        .domain(this.xz)
        .rangeRound([this.margin.left, this.base.width - this.margin.right])
        .padding(0.2);

      const y = d3
        .scaleLinear()
        .domain([0, y1Max])
        .range([this.base.height - this.margin.bottom, this.margin.top]);

      let colors = [
        "#0071c0",
        "#01b0f1",
        "#76b531",
        "#01b8b3",
        "#f6ba00",
        "#c55b10",
        "#c00000"
      ];

      colors = [
        "#4e79a7",
        "#f28e2c",
        "#e15759",
        "#76b7b2",
        "#59a14f",
        "#edc949",
        "#af7aa1",
        "#ff9da7",
        "#9c755f",
        "#bab0ab"
      ];
      const z = d3.scaleOrdinal(colors).domain(d3.range(numVariables));
      //   console.log(d3.range(7).map(i => z(i)));

      let xAxis = svg =>
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
              .tickFormat(i => this.csvData[i]["Name"])
          )
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .style("font-size", "1.4em")
          .attr("transform", "rotate(-65)");

      let yAxis = svg =>
        svg
          .append("g")
          .attr("class", "ytick")
          .attr("transform", `translate(${this.margin.left},0 )`)
          .call(
            d3
              .axisLeft(y)
              .tickSizeOuter(0)
              .tickFormat(i => i)
          )
          .call(g => g.select(".domain").remove());

      //   const variableUnit = this.variableUnit;
      this.rect = this.svg
        .append("g")
        .attr("class", "group")
        .selectAll("g")
        .data(y01z)
        .enter()
        .append("g")
        .attr("class", (d, i) => variableNames[i])
        .attr("fill", (d, i) => z(i))
        .selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", this.base.height - this.margin.bottom)
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .on("mouseover", function(e, d) {
          const key = d[3];
          const range = d[5];
          const sum = d[6];
          const group = d3.select(this.parentNode).datum();
          const idx = group.indexOf(d);
          Tooltip.html(
            // "<strong>" +
            //   csvData[idx]["Name"] +
            //   "</strong><br><br>" +
            key.match(/[A-Z][a-z]+|[0-9]+/g).join(" ") +
              ": <strong>" +
              csvData[idx][key] +
              "</strong>" +
              " out of " +
              range +
              "<br><br>" +
              "Total: <strong>" +
              sum
          ).style("opacity", 1);

          d3.select(this).style("stroke", "black");

          svg
            .select(".xtick")
            .selectAll(".tick")
            .style("opacity", (d, i) => (i === idx ? 1 : 0.4));

          variableNames.map(key => {
            svg
              .select(`.${key}`)
              .selectAll("rect")
              .style("opacity", (d, i) => (i === idx ? 1 : 0.4));
          });

          // .style("opacity", 1);
        })
        .on("mousemove", (e, d) => mousemove(e, d))
        .on("mouseleave", mouseleave);

      this.svg.call(xAxis);
      this.svg.call(yAxis);

      y.domain([0, y1Max]);

      this.svg.append("g").attr("class", "g-legend");

      const legend = this.svg
        .select(".g-legend")
        .selectAll("g")
        .data(variableNames)
        .enter()
        .append("g");

      legend.attr("class", "legned").attr(
        "transform",
        (d, i) =>
          `translate(
                ${this.base.width - this.margin.right * 2}, 
            ${10 + (variableNames.length - i) * 28})`
      );
      // .attr("x", (d, i) => 100 * i + 100)
      // .attr("y", 5);

      legend
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", (d, i) => z(i));

      legend
        .append("text")
        .text(d => d.match(/[A-Z][a-z]+|[0-9]+/g).join(" "))
        .attr("x", 23)
        .attr("y", 15)
        .attr("fill", (d, i) => "#555");

      this.rect
        .transition()
        .duration(500)
        .delay((d, i) => i * 20)
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .transition()
        // .attr("x", (d, i) => x(i))
        // .attr("width", x.bandwidth())
        .on("end", () => {
          this.rendered = true;
        });
    },
    renderStackChart2() {
      const svg = d3.select("#canvas");
      let Tooltip;
      if (d3.selectAll("#canvas-container #tooltip").size() === 0) {
        Tooltip = d3
          .select("#canvas-container")
          .append("div")
          .style("opacity", 0)
          .attr("id", "tooltip")
          .style("background-color", "white")
          .style("border", "solid")
          .style("border-width", "2px")
          .style("border-radius", "5px")
          .style("padding", "5px")
          .style(" max-width", "300px")
          .style("position", "absolute");
      } else {
        Tooltip = d3.select("#tooltip");
      }

      const variableNames = this.defaultVariableNames2.filter(
        (_, i) => i !== 2
      );
      // console.log("csvData2", this.csvData2);
      let csvData = this.csvData2;
      const caseName = "Conference(Name'Year)";

      const numCases = csvData.length;
      const numVariables = variableNames.length;

      this.xz = d3.range(numCases);

      csvData = csvData.map(d => {
        let num_unaccepted =
          d["NumOfTotalSubmissions"] - d["NumOfAcceptedPapers"];
        return { ...d, NumOfUnacceptedPapers: num_unaccepted };
      });

      this.csvData2 = csvData;

      let dataNorm = csvData.map(d => {
        let name = d[caseName];
        if (name === "") return variableNames.map(key => 0);
        let max = d["NumOfTotalSubmissions"];
        let scale = d3
          .scaleLinear()
          .domain([0, max])
          .range([0, 100]);
        return variableNames.map(key => +scale(+d[key]).toFixed(2));
      });

      let yz = d3
        .range(numVariables)
        // .filter((_, i) => i !== 2)
        .map(i => {
          const key = variableNames[i];
          return csvData.map(d => +d[key]);
        });
      this.yz = yz;

      let yzNorm = d3
        .range(numVariables)
        // .filter((_, i) => i !== 2)
        .map(i => {
          return dataNorm.map(d => d[i]);
        });
      this.yzNorm = yzNorm;

      let y01z = d3
        .stack()
        .keys(d3.range(numVariables))(d3.transpose(yz)) // stacked yz
        .map((data, i) =>
          data.map(([y0, y1], idx) => [
            y0,
            y1,
            i, // varaible idx
            variableNames[i], // varaible name
            idx, // case idx
            csvData[idx][caseName],
            csvData[idx]["NumOfTotalSubmissions"],
            yzNorm[i][idx],
            "number"
          ])
        );
      this.y01z = y01z;

      let y02z = d3
        .stack()
        .keys(d3.range(numVariables))(d3.transpose(yzNorm)) // stacked yz
        .map((data, i) =>
          data.map(([y0, y1], idx) => [
            y0,
            y1,
            i,
            variableNames[i],
            idx,
            csvData[idx][caseName],
            csvData[idx]["NumOfTotalSubmissions"],
            yzNorm[i][idx],
            "percent"
            // ysum[idx]
          ])
        );
      this.y02z = y02z;

      const yMax1 = d3.max(csvData.map(y => y["NumOfTotalSubmissions"]));
      const yMax2 = 100;

      this.yMax1 = yMax1;
      this.yMax2 = yMax2;

      let yMax = this.chartType === "number" ? yMax1 : yMax2;

      let x = d3
        .scaleBand()
        .domain(this.xz)
        .rangeRound([this.margin.left, this.base.width - this.margin.right])
        .padding(0.2);

      const y = d3
        .scaleLinear()
        .domain([0, yMax])
        .range([this.base.height - this.margin.bottom, this.margin.top]);
      this.y = y;

      let colors = ["#f28e2c", "#4e79a7"];
      const z = d3.scaleOrdinal(colors).domain(d3.range(numVariables));

      let xAxis = svg =>
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
              .tickFormat(i => csvData[i][caseName])
          )
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .style("font-size", "1.4em")
          .attr("transform", "rotate(-65)");

      let yAxis = svg =>
        svg
          .append("g")
          .attr("class", "ytick")
          .attr("transform", `translate(${this.margin.left},0 )`)
          .call(
            d3
              .axisLeft(y)
              .tickSizeOuter(0)
              .tickFormat(i => i)
          )
          .call(g => g.select(".domain").remove());

      const mousemove = function(e, d) {
        Tooltip.style("left", d3.pointer(e)[0] + 70 + "px").style(
          "top",
          d3.pointer(e)[1] + "px"
        );
      };

      const mouseleave = function() {
        Tooltip.style("opacity", 0);
        d3.select(this).style("stroke", "none");
        svg
          .select(".xtick")
          .selectAll(".tick")
          .style("opacity", 1);

        variableNames.map(key => {
          svg
            .select(`.${key}`)
            .selectAll("rect")
            .style("opacity", 1);
        });
        // .style("opacity", 0.8);
      };

      this.svg.append("g").attr("class", "g-legend");

      const legend = this.svg
        .select(".g-legend")
        .selectAll("g")
        .data(variableNames)
        .enter()
        .append("g");

      legend.attr("class", "legned").attr(
        "transform",
        (d, i) =>
          `translate(
                ${this.base.width - this.margin.right * 2 - i * 200}, 
            ${10})`
      );
      // .attr("x", (d, i) => 100 * i + 100)
      // .attr("y", 5);

      legend
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", (d, i) => z(i));

      legend
        .append("text")
        .text((d, i) => (i == 0 ? "Accepted Papers" : "Unaccepted Papers"))
        .attr("x", 23)
        .attr("y", 15)
        .attr("fill", (d, i) => "#555");

      let type = this.chartType;

      let ydata = type === "number" ? y01z : y02z;

      this.rect = this.svg
        .append("g")
        .attr("class", "group")
        .selectAll("g")
        .data(ydata)
        .enter()
        .append("g")
        .attr("class", (d, i) => variableNames[i])
        .attr("fill", (d, i) => z(i))
        .selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect");
      this.rect
        .attr("x", (d, i) => x(i))
        .attr("y", this.base.height - this.margin.bottom)
        .attr("width", x.bandwidth())
        .attr("height", 0)
        .on("mouseover", function(e, d) {
        const key = d[3];
        const percent = d[7];
        const sum = d[6];
        const idx = d[4];
        const type = d[8];
        let text =
          type === "percent"
            ? "<strong>" +
              percent +
              "%</strong><br>" +
              csvData[idx][key] +
              " out of " +
              sum
            : "<strong>" +
              csvData[idx][key] +
              "</strong>" +
              " out of " +
              "<strong>" +
              sum +
              "</strong><br>" +
              percent +
              "%";

        Tooltip.html(text).style("opacity", 1);
        // console.log(d3.select(this))
        d3.select(this).style("stroke", "black");

        svg
          .select(".xtick")
          .selectAll(".tick")
          .style("opacity", (d, i) => (i === idx ? 1 : 0.4));

        variableNames.map(key => {
          svg
            .select(`.${key}`)
            .selectAll("rect")
            .style("opacity", (d, i) => (i === idx ? 1 : 0.4));
        });
      })
        .on("mousemove", (e, d) => mousemove(e, d))
        .on("mouseleave", mouseleave);

      this.svg.call(xAxis);
      this.svg.call(yAxis);

      this.rect
        .transition()
        .duration(500)
        .delay((d, i) => i * 20)
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .transition()
        // .attr("x", (d, i) => x(i))
        // .attr("width", x.bandwidth())
        .on("end", () => {
          this.rendered = true;
        });
    },
    reRenderStackChart2(type) {
      const svg = d3.select("#canvas");

      this.rendered = false;
      let y, yz;
      if (type === "number") {
        this.y.domain([0, this.yMax1]);
        yz = this.y01z;
      } else {
        this.y.domain([0, this.yMax2]);
        yz = this.y02z;
      }
      y = this.y;

      this.rect
        .data((d, i) => yz[i])
        .transition()
        .duration(500)
        .delay((d, i) => i * 20)
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .transition()
        .on("end", () => {
          this.rendered = true;
        });

      this.svg
        .select(".ytick")
        .transition()
        .duration(1000)
        .call(
          d3
            .axisLeft(y)
            .tickSizeOuter(0)
            .tickFormat(i => (type === "number" ? i : i + "%"))
        );
    }
  },
  async mounted() {
    this.clearAll() 
    // console.log("mount");
    this.csvData2 = await this.loadCsv();

    this.renderBase();
    this.renderStackChart();
  },
  async beforeMount() {
    this.csvData = rawData;

    this.defaultVariableNames = [
      "Name",
      "MapsData",
      "LocationIntelligence",
      "LocationServices",
      "Platform",
      "DeveloperEcosystem",
      "Partners",
      "Customers"
    ];

    this.defaultVariableNames2 = [
      // "Acceptance rate",
      // "Conference (Name'Year)  ",
      "NumOfAcceptedPapers",
      "NumOfUnacceptedPapers",
      "NumOfTotalSubmissions"
    ];

    this.variableRange = [110, 110, 110, 90, 80, 80, 80];
  }
};
</script>

<style scoped>
h3,
h2,
h4 {
  margin: 20px 0 0;
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
#canvas-container {
  position: relative;
  width: 1400px;
  margin: auto;
}
p {
  text-align: left;
  width: 80%;
  padding: 10px;
  margin: auto;
}
</style>
