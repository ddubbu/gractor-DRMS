<template>
  <div>
    <section id="header">
      <img src="../assets/search_img.png" />
      <h1>경기지역화폐 결제 매장 검색</h1>
      <p>
        경기지역화폐는 소상공인 경쟁력 강화를 위해 백화점, 대형마트, 일부
        제외업종 및
        <br />
        일정 기준 매출액 이상의 매장에서 사용이 제한됩니다.
      </p>
      <p>
        * 가맹점 폐업 또는 업종변경, 가맹점 정보변경 등으로 현재 정보와 다를 수
        있으니 매장에 사용 가능 여부를 확인하기 바랍니다.
      </p>
    </section>
    <section id="select-region">
      <h4>검색하려는 지역을 선택해 주세요.</h4>
      <ul>
        <li v-for="(region, idx) of regions" :key="idx">{{ region }}</li>
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
      ],
    };
  },
};
</script>

<style>
#header {
  text-align: center;
  margin: 80px 145px;
}

#header :last-child {
  /* #header p:nth-child(2) { */
  margin-top: 9px;
  /* color: red; */
  font-size: 10px;
}

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
