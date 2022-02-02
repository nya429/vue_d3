<template>
  <div>
    <h3>Data Visulization HW1 P1</h3>
    <br>
    <ul>
      <li>Select a Visulization Type to Display</li>
      <li>
        <button @click="showStack">Stack</button>

        <button>Band</button>

        <button @click="showSlop">Slop</button>
      </li>
    </ul>
    <br />
    <div id="canvas-container">
      <ul v-if="chartType==='STACK'">
        <li>
          <strong>Select Variable</strong>
        </li>
        <li v-for="vriable in variableList" :key="vriable">
          <input type="checkbox" v-bind:disabled='!rendered || (checkedVariables.length === 1 && checkedVariables[0] === vriable)' v-bind:id="vriable" v-bind:name="vriable" v-bind:value='vriable' v-model='checkedVariables'>
          <label v-bind:for="vriable">{{vriable}}</label>
        </li>
      </ul>
      <br>
      <br>
      <!-- <p>{{checkedVariables}}</p> -->
      <svg id="canvas"></svg>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "Canvas",
  data() {
    return {
      chartType: "NA",
      margin: {
        top: 0,
        right: 10,
        bottom: 200,
        left: 30
      },
      marginSlop: {
        top: 100,
        right: 300,
        bottom: 10,
        left: 300
      },
      base: {
        height: 600,
        width: 1400
      },
      rendered: false,
      xz: 0,
      react: [],
      checkedVariables: [],
      variableList: [
        "Calories",
        "Protein",
        "Fat",
        "Sodium",
        "Fiber",
        "Carbohydrates",
        "Sugars",
        "Potassium"
        // "Vitamins"
      ],
      svg: null
    };
  },
  props: {
    csvData: Array,
    variables: Array
  },
  watch: {
    csvData(newVal, oldVal) {
      this.showStack();
    },
    checkedVariables(newVal, oldVal) {
      if (this.rendered) this.reRenderStackChart();
    }
  },
  methods: {
    renderSlopChart() {
      // const Tooltip = d3
      //   .select("#canvas-container")
      //   .append("div")
      //   .style("opacity", 0)
      //   .attr("id", "tooltip")
      //   .style("background-color", "white")
      //   .style("border", "solid")
      //   .style("border-width", "2px")
      //   .style("border-radius", "5px")
      //   .style("padding", "5px")
      //   .style(" max-width", "300px")
      //   .style("position", "absolute");
      const dodgeAttr = (selection, name, value, separation) => {
        const V = dodge(selection.data().map(value), separation);
        selection.attr(name, (_, i) => V[i]);
      };
      const dodge = (V, separation, maxiter = 10, maxerror = 1e-1) => {
        const n = V.length;
        if (!V.every(isFinite)) throw new Error("invalid position");
        if (!(n > 1)) return V;
        let I = d3.range(V.length);
        for (let iter = 0; iter < maxiter; ++iter) {
          I.sort((i, j) => d3.ascending(V[i], V[j]));
          let error = 0;
          for (let i = 1; i < n; ++i) {
            let delta = V[I[i]] - V[I[i - 1]];
            if (delta < separation) {
              delta = (separation - delta) / 2;
              error = Math.max(error, delta);
              V[I[i - 1]] -= delta;
              V[I[i]] += delta;
            }
          }
          if (error < maxerror) break;
        }
        return V;
      };

      let thatSvg = this.svg;
      const mouseover = function() {
        // Tooltip.style("opacity", 1);
        // console.log(d);
        // const key = d[3];
        // const groupp = d3.select(this.parentNode).datum();
        // console.log(key, groupp);
        d3
          .select(this)
          .style("opacity", "1")
          .attr("stroke-width", 3);
        // .style("opacity", 1);
      };
      const mousemove = function(e, d) {
        // Tooltip.style("left", d3.pointer(e)[0] + 70 + "px").style(
        //   "top",
        //   d3.pointer(e)[1] + "px"
        // );
      };
      const mouseleave = function() {
        // Tooltip.style("opacity", 0);
        thatSvg
          .selectAll(".g-line path")
          .attr("stroke", "black")
          .attr("stroke-width", 1);
        d3.select(this).style("opacity", 0.5);
      };
      console.log("slop");
      let data = [...this.csvData];

      const yz = d3.range(this.variableList.length).map(i => {
        const key = this.variableList[i];
        return this.csvData.map(d => d[key]);
      });

      const yzNorm = yz.map(d => {
        let dp = d.map(d => +d);
        let max = d3.max(dp);
        let scale = d3
          .scaleLinear()
          .domain([0, max])
          .range([0, 100]);
        return dp.map(i => Math.floor(scale(i)));
      });

      const flattenData = yzNorm
        .map((c, i) => {
          return c.map((d, idx) => {
            return {
              type: this.variableList[i],
              value: d,
              brand: this.csvData[idx]["name"]
            };
          });
        })
        .flat();
      let X = d3.map(flattenData, d => d.type);
      let Y = d3.map(flattenData, d => d.value);
      let Z = d3.map(flattenData, d => d.brand);

      let xDomain = d3.map(flattenData, d => d.type);
      let yDomain = d3.extent(d3.map(flattenData, d => d.value));
      let zDomain = d3.map(flattenData, d => d.brand);
      xDomain = new d3.InternSet(xDomain);
      zDomain = new d3.InternSet(zDomain);
      console.log(Y);
      const I = d3
        .range(X.length)
        .filter(i => xDomain.has(X[i]) && zDomain.has(Z[i]));
      // console.log(I);
      const xScale = d3
        .scalePoint()
        .domain(xDomain)
        .range([this.marginSlop.left, this.base.width - this.marginSlop.right])
        .padding(0.08);

      const yScale = d3
        .scaleLinear()
        .domain(yDomain)
        .range([
          this.base.height - this.marginSlop.bottom,
          this.marginSlop.top
        ]);

      const xAxis = d3.axisTop(xScale).tickSizeOuter(2);
      // const yFormat = yScale.tickFormat(100, yFormat);

      const line = d3
        .line()
        // .defined(i => D[i])
        .curve(d3.curveLinear)
        .x(i => xScale(X[i]))
        .y(i => yScale(Y[i]));

      this.svg
        .append("g")
        .attr("transform", `translate(0, ${this.marginSlop.top - 30})`)
        .style("font", "14px times")
        .call(xAxis)
        .call(g => g.select(".domain").remove());

      this.svg
        .append("g")
        .attr("class", "g-line")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-linecap", 2)
        .attr("stroke-linejoin", 2)
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.5)
        .selectAll("path")
        .data(d3.group(I, i => Z[i]))
        .join("path")
        .style("mix-blend-mode", "multiply")
        .attr("d", ([, I]) => line(I))
        .style("opacity", 0.5);

      const Ix = d3.group(I, i => X[i]);
      console.log("Ix", Ix.get("Protein"));

      for (const [i, x] of [...xDomain].entries()) {
        console.log(i, x);
        const text = this.svg
          .append("g")
          .attr("class", "g-text")
          .attr(
            "text-anchor",
            i === 0 ? "end" : i === xDomain.size - 1 ? "start" : "middle"
          )
          .selectAll("text")
          .data(Ix.get(x))
          .join("text")
          .attr("x", xScale(x))
          .call(dodgeAttr, "y", i => yScale(Y[i]), 15)
          .text(
            i === 0
              ? i => `${Z[i]} ${Y[i]}`
              : i === xDomain.size - 1 ? i => `${Y[i]} ${Z[i]}` : i => Y[i]
          )
          // .attr("fill", "none")
          .style("font-size", "0.7em");
        // .call(dodgeAttr, "y", i => yScale(Y[i]), labelSeparation)
        // .attr("dy", "0.7em")
        // .attr(
        //   "dx",
        //   i === 0 ? -1 : i === xDomain.size - 1 ? 1 : 0 * 0.08
        // )
        // .text()
        // .call(text => text.clone(true))
        //
        // // .attr("stroke", 1)
        // .attr("stroke-width", 1);
      }

      d3
        .selectAll(".g-text text")
        .on("mouseover", function(e, i) {
          // Tooltip.html("Brand: ").style("opacity", 1);
          console.log();
          d3
            .select(this)
            .style("stroke", "black")
            .style("opacity", 1);

          thatSvg
            .selectAll(".g-line path")
            .filter((d, idx) => i === idx)
            .attr("stroke", "red")
            .attr("stroke-width", 3);
        })
        .on("mousemove", (e, d) => mousemove(e, d))
        .on("mouseleave", mouseleave);
    },
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
        "vitamins"
      ];

      const numVariables = variableNames.length;
      const numCases = this.csvData.length;
      this.xz = d3.range(numCases);

      const yz = d3.range(numVariables).map(i => {
        const key = variableNames[i];
        return this.csvData.map(d => d[key]);
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
        .style("padding", "5px")
        .style(" max-width", "300px")
        .style("position", "absolute");

      const mouseover = function() {
        Tooltip.style("opacity", 1);
        // console.log(d);
        // const key = d[3];
        // const groupp = d3.select(this.parentNode).datum();
        // console.log(key, groupp);
        d3.select(this).style("stroke", "black");
        // .style("opacity", 1);
      };
      const mousemove = function(e, d) {
        Tooltip.style("left", d3.pointer(e)[0] + 70 + "px").style(
          "top",
          d3.pointer(e)[1] + "px"
        );
      };
      const mouseleave = function() {
        Tooltip.style("opacity", 0);
        d3.select(this).style("stroke", "none");
        // .style("opacity", 0.8);
      };

      const variableNames = this.checkedVariables;

      const numVariables = variableNames.length;
      const csvData = this.csvData;
      const numCases = csvData.length;

      this.xz = d3.range(numCases);

      const yz = d3.range(numVariables).map(i => {
        const key = variableNames[i];
        return this.csvData.map(d => d[key]);
      });

      const y01z = d3
        .stack()
        .keys(d3.range(numVariables))(d3.transpose(yz)) // stacked yz
        .map((data, i) =>
          data.map(([y0, y1]) => [y0, y1, i, variableNames[i]])
        );

      const yMax = d3.max(yz, y => d3.max(y));
      const y1Max = d3.max(y01z, y => d3.max(y, d => d[1]));

      let x = d3
        .scaleBand()
        .domain(this.xz)
        .rangeRound([this.margin.left, this.base.width - this.margin.right])
        .padding(0.08);

      const y = d3
        .scaleLinear()
        .domain([0, y1Max])
        .range([this.base.height - this.margin.bottom, this.margin.top]);

      const z = d3
        .scaleSequential(d3.interpolateBlues)
        .domain([-0.5 * numVariables, 1.4 * numVariables]);

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
              .tickFormat(i => this.csvData[i]["name"])
          )
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-65)");

      const svg = d3.select("#canvas");

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
          const group = d3.select(this.parentNode).datum();
          const idx = group.indexOf(d);
          Tooltip.html(
            "Brand: " +
              csvData[idx]["name"] +
              "<br>" +
              "<strong>" +
              key +
              "</strong>" +
              ": " +
              (d[1] - d[0])
          ).style("opacity", 1);

          d3.select(this).style("stroke", "black");
          // .style("opacity", 1);
        })
        .on("mousemove", (e, d) => mousemove(e, d))
        .on("mouseleave", mouseleave);

      this.svg.call(xAxis);

      y.domain([0, y1Max]);

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
    reRenderStackChart() {
      const numVariables = this.variableList.length;
      const keys = this.variableList;
      const checkedKeys = this.checkedVariables;

      const yz = d3.range(numVariables).map(i => {
        const key = this.variableList[i];
        if (checkedKeys.includes(key)) {
          return this.csvData.map(d => d[key]);
        } else {
          return this.csvData.map(d => 0);
        }
      });

      const y01z = d3
        .stack()
        .keys(d3.range(numVariables))(d3.transpose(yz)) // stacked yz
        .map((data, i) =>
          data.map(([y0, y1]) => [y0, y1, i, this.variableList[i]])
        );

      this.xz = d3.range(this.xz.length).sort((a, b) => {
        var diff =
          d3.sum(checkedKeys.map(key => this.csvData[a][key])) -
          d3.sum(checkedKeys.map(key => this.csvData[b][key]));
        return diff;
      });

      let x = d3
        .scaleBand()
        .domain(this.xz)
        .rangeRound([this.margin.left, this.base.width - this.margin.right])
        .padding(0.08);

      const yMax = d3.max(yz, y => d3.max(y));
      const y1Max = d3.max(y01z, y => d3.max(y, d => d[1]));

      let y = d3
        .scaleLinear()
        .domain([0, y1Max])
        .range([this.base.height - this.margin.bottom, this.margin.top]);

      this.svg
        .select("g.group")
        .selectAll("g")
        .data(y01z)
        .selectAll("rect")
        .data(d => d)
        .transition()
        .duration(500)
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]));
      // .transition();

      this.rect
        .transition()
        .delay(500)
        .duration(1000)
        // .delay((d, i) => i * 20)
        .attr("x", (d, i) => x(i))
        .transition();

      this.svg
        .select(".xtick")
        .selectAll(".tick")
        .transition()
        .delay(500)
        .duration(1000)
        .attr(
          "transform",
          (d, i) => `translate(${x(i) + x.bandwidth() / 2}, ${0})`
        );
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
      if (this.chartType === "STACK") return;
      this.chartType = "STACK";
      this.clearAll();
      this.renderStackChart();
    },
    showSlop() {
      if (this.chartType === "SLOP") return;
      this.chartType = "SLOP";
      this.clearAll();
      this.renderSlopChart();
    },
    clearAll() {
      d3.selectAll("svg > *").remove();
    }
  },
  mounted() {
    this.checkedVariables = this.variableList;
    this.renderBase();
  }
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
#canvas-container {
  position: relative;
}
</style>
