<template>
  <div>
    <section id="header">
      <img src="../../assets/search_img.png" />
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
      <selectTable />
    </section>
  </div>
</template>

<script>
import selectTable from '../../components/selectTable.vue';
export default {
  components: {
    selectTable,
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
</style>
