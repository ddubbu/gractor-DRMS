<template>
  <div>
    <section id="select-region">
      <ul>
        <li v-for="region of regions" :key="region">{{ region }}</li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      regions: [
        '가평군',
        '고양시',
        '과천시',
        '광명시',
        '광주시',
        '구리시',
        '군포시',
        '김포시',
        '남양주시',
        '동두천시',
        '부천시',
        '성남시',
        '수원시',
        '시흥시',
        '안산시',
        '안성시',
        '안양시',
        '양주시',
        '양평군',
        '여주시',
        '연천군',
        '오산시',
        '용인시',
        '의왕시',
        '의정부시',
        '이천시',
        '파주시',
        '평택시',
        '포천시',
        '하남시',
        '화성시',
      ],
    };
  },
};
</script>

<style>
#select-region {
  /* margin: 0 auto; */
  text-align: center;
}

#select-region ul {
  list-style: none;
  display: flex;
  width: 910px;
  flex-wrap: wrap;
  /* text-align: center; */
  align-items: center;
  margin: 0 auto;
  padding: 0;
  /* justify-content: center; */
}

#select-region > ul > li {
  display: inline-block;
  padding-top: 20px;
  /* line-height: 50%; */
  /* inline-flex; */
  width: 180px;
  font-size: 13px;
  color: #000;
  height: 55px;
  line-height: 19px;
  border: 1px solid #ddd;
  /* border-right: 1px solid #ddd;
  border-bottom: 1px solid #ddd; */
  text-align: center;
  background: #fff;
}
</style>
