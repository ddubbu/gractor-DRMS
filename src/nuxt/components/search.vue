<template>
  <section id="search-wrapper">
    <span>통합검색</span>
    <input />
    <button>
      <i class="fas fa-search"></i>
    </button>
  </section>
</template>

<script>
export default {};
</script>

<style>
#search-wrapper {
  margin-bottom: 40px;
  border: solid 3px #2c2c2c;
  display: flex;
  justify-content: space-between;
  height: 64px;
  /* min-width: 1100px; */
  border-radius: 5px;
}
#search-wrapper span {
  background: black;
  color: white;
  padding: 15px 10px;
  min-width: 80px;
}
#search-wrapper input {
  outline: none;
  border: none;
  padding-left: 20px;

  font-size: 1em;
  line-height: 100%;

  width: 90%;
  background: white;
}

#search-wrapper button {
  outline: none;
  border: none;
  background: white;
  width: 60px;
}
#search-wrapper button i {
  font-size: 2em;
}
</style>
