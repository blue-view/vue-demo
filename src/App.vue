<template>
  <div id="app">
    <MHead/>
    <MContent/>
    <div class="play-bar">
      <aplayer
        ref="aplayer"
        autoplay="true"
        showLrc="true"
        :music="playPrama['music']"
        v-if="playPrama['flag']"
        :list="playPrama['list']"
        :callback="callback"
      />
    </div>
    <div class="mask" v-show="this.$store.state.playPrama.mask" :style="{'height':maskStyle+'px'}"></div>
  </div>
</template>
 
<script>
// import HelloWorld from "./components/HelloWorld.vue";
import MHead from "./components/MHead";
import MContent from "./components/MContent";
import Vue from "vue";
import Aplayer from "./aplayer/vue-aplayer";
import { mapState } from "vuex";
import axios from "axios";

Vue.use(Aplayer);

export default {
  name: "app",
  data() {
    return {
      callback: function(obj, context) {
        var that = this;
        var baseUrl = this.$apiUrl.BaseUrl;
        var songMp3Url = baseUrl + this.$apiUrl.SongMp3Url + obj.id;
        var songLyric = baseUrl + this.$apiUrl.SongLyric + obj.id;
        var currentSong = this.$store.state.playPrama["list"].filter(function(
          song
        ) {
          return obj.id == song.id;
        });
        axios.all([this.$getHttp(songMp3Url), this.$getHttp(songLyric)]).then(
          axios.spread(function(songMp3Url, songLyric) {
            var src = songMp3Url.data.data[0].url;
            var lrc = songLyric.data.lrc && songLyric.data.lrc.lyric;
            currentSong[0]["src"] = src;
            currentSong[0]["lrc"] = lrc;
            context.currentMusic = currentSong[0];
            context.thenPlay();
          })
        );
      }
    };
  },
  components: {
    MHead,
    MContent,
    Aplayer
  },
  watch: {
    playPrama: {
      deep: true
      // handler: function(newVal, oldVal) {
      //   this.$nextTick(function() {
      //     if (newVal.flag) {
      //       var aplayer = this.$refs.aplayer;
      //       aplayer.$el.style.margin = 0;
      //     }
      //   });
      // }
    }
  },
  computed: {
    playPrama() {
      return this.$store.state.playPrama;
    },
    maskStyle() {
      return window.innerHeight + document.documentElement.scrollTop;
    }
    // mapState({
    //     playPrama: state => state.playPrama
    //   })
  },
  mounted: function() {

  }
};
</script>

<style lang="scss">
@import "@/common/css/base.scss";
@font-face {
  font-family: "iconfont";
  src: url("./assets/iconfont/iconfont.eot");
  src: url("./assets/iconfont/iconfont.eot?#iefix") format("embedded-opentype"),
    url("./assets/iconfont/iconfont.woff2") format("woff2"),
    url("./assets/iconfont/iconfont.woff") format("woff"),
    url("./assets/iconfont/iconfont.ttf") format("truetype"),
    url("./assets/iconfont/iconfont.svg#iconfont") format("svg");
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.play-bar {
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 100;
}
.mask {
  position: absolute;
  width: 100%;
  // height:100%;
  background: #000;
  opacity: 0.5;
  left:0;
  top:0;
  z-index:80;
}
</style>