<template>
  <div>
    <div class="div_home">
      <div class="div_home_title">Space War</div>

      <div class="div_home_container">
        <div class="div_button" @click="onClickSolo()">
          <img class="img_button" src="../assets/solo.svg">
          <section class="sec_button">Solo</section>
        </div>

        <div class="div_button" @click="onClickBattle()">
          <img class="img_button" src="../assets/battle.svg">
          <section class="sec_button">Battle</section>
        </div>
      </div>
    </div>
    <footer id="footer">
      <span class="span_footer" @click="onClickFooter()">Powered by ZengYu &copy;2018 <Icon type="logo-github" /> {{project}}</span>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      project: 'Space War'
    }
  },
  methods: {
    onClickSolo: function () {
      this.$router.push('/solo')
    },
    onClickBattle: function () {
      this.$router.push('/battle')
    },
    onClickFooter: function () {
      window.open('https://github.com/frogfans/SpaceWar-Web')
    }
  }
}
</script>

<style scoped>
@font-face {
  font-family: 'Iceland';
  font-style: normal;
  font-weight: 900;
  src: local('Iceland'), local('Iceland-Regular');
}

/*glow for webkit*/
@-webkit-keyframes neon {
  from {
    text-shadow: 0 0 10px #fefcc9,
      0 0 20px #feec85,
      0 0 40px #ffae34,
      0 0 60px #ec760c,
      0 0 100px #cd4606,
      0 0 160px #973716,
      0 0 220px #451b0e,
      0 0 300px #230b00;
  }

  to {
    text-shadow: 0 0 5px #fefcc9,
      0 0 10px #feec85,
      0 0 20px #ffae34,
      0 0 30px #ec760c,
      0 0 50px #cd4606,
      0 0 80px #973716,
      0 0 110px #451b0e,
      0 0 150px #230b00;
  }
}

/*glow for mozilla*/
@-moz-keyframes neon {
  from {
    text-shadow: 0 0 10px #fefcc9,
      0 0 20px #feec85,
      0 0 40px #ffae34,
      0 0 60px #ec760c,
      0 0 100px #cd4606,
      0 0 160px #973716,
      0 0 220px #451b0e,
      0 0 300px #230b00;
  }

  to {
    text-shadow: 0 0 5px #fefcc9,
      0 0 10px #feec85,
      0 0 20px #ffae34,
      0 0 30px #ec760c,
      0 0 50px #cd4606,
      0 0 80px #973716,
      0 0 110px #451b0e,
      0 0 150px #230b00;
  }
}

/*glow*/
@keyframes neon {
  from {
    text-shadow: 0 0 10px #fefcc9,
      0 0 20px #feec85,
      0 0 40px #ffae34,
      0 0 60px #ec760c,
      0 0 100px #cd4606,
      0 0 160px #973716,
      0 0 220px #451b0e,
      0 0 300px #230b00;
  }

  to {
    text-shadow: 0 0 5px #fefcc9,
      0 0 10px #feec85,
      0 0 20px #ffae34,
      0 0 30px #ec760c,
      0 0 50px #cd4606,
      0 0 80px #973716,
      0 0 110px #451b0e,
      0 0 150px #230b00;
  }
}

.div_home {
  width: auto;
  height: auto;
  padding: 10px;
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  align-items: center;
}

.div_home_title {
  text-align: center;
  text-decoration: none;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  transition: all 0.5s;
  color: #ffffff;
  font-size: 80px;
  font-family: Iceland;
  -webkit-animation: neon 1.5s ease-in-out infinite alternate;
  -moz-animation: neon 1.5s ease-in-out infinite alternate;
  animation: neon 1.5s ease-in-out infinite alternate;
  cursor: default;
}

.div_home_container {
  width: auto;
  height: 200px;
  margin: 50px auto 0 auto;
  display: flex;
}

.div_button {
  margin: auto 30px;
  padding: 20px 50px;
  width: auto;
  height: auto;
  display: inline-block;
  align-items: center;
  color: #ffffff;
  background-color: rgba(7, 7, 7, 0.2);
  border-radius: 30px;
  -webkit-transition-duration: 0.5s;
  /* Safari */
  transition-duration: 0.5s;
  cursor: pointer;
}

.div_button:hover {
  background-color: rgba(248, 248, 248, 0.2);
}

.img_button {
  width: 100px;
  height: 100px;
  display: block;
  margin: auto;
}

.sec_button {
  margin-top: 10px;
  display: block;
  align-items: center;
  font-size: 32px;
  font-family: sans-serif, Arial, Helvetica;
  -webkit-transition-duration: 0.5s;
  transition-duration: 0.5s;
}

#footer {
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translate(-50%, -50%);
  align-items: center;
  color: rgba(248, 248, 248, 0.4);
}

.span_footer {
  padding: 2px;
  text-align: center;
  font-size: 16px;
  -webkit-transition-duration: 0.5s;
  transition-duration: 0.5s;
  cursor: pointer;
}

.span_footer:hover {
  color: rgba(248, 248, 248, 1);
}
</style>
