<template>
    <ul>
        <li>
            <router-link to="/">HW1</router-link>
            <router-link to="hw2">HW2</router-link>
        </li>
    </ul>
</template>

<script>
export default {
  name: "Nav"
};
</script>

<style scoped>
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: #333;
}

li {
}

li a {
  float: left;
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

li a:hover:not(.active) {
  background-color: #111;
}

.active {
  background-color: #04aa6d;
}
</style>
