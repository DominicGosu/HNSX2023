<template>
  <div class="row column header" id="app">
    <h1 class="cover-heading">
      Tìm kiếm ảnh hưởng <i class="fa fa-search"></i>
    </h1>
    <div class="medium-6 medium-offset-3 ctrl">
      <form class="searchForm" @submit.prevent="submitSearch">
        <input
          type="text"
          class="search"
          v-model="searchQuery"
          placeholder="Type here and press enter"
        />
      </form>
      <div class="searchContainer">
      <!-- Thêm sự kiện click vào biểu tượng giọng nói để bắt đầu/ngừng nghe giọng nói -->
      <button class="voiceButton" @click="toggleListening">
        <i class="fa fa-microphone"></i>
      </button>
    </div>
      <a class="raised-button ink" @click="submitSearch"
        ><i class="fa fa-search"></i> Search</a
      >
    </div>
    <div class="searchResult" transition="expand">
      <div v-for="(data, index) in dataRender" :key="index">
        <h1 class="text-headline-group" @click="expanded(data)">
          {{ data.groupKey }}
        </h1>
        <template v-if="data.isShow">
          <component
            :is="'Group' + data.groupKey"
            :groupData="data.groupData"
          ></component>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import dataSourceFake from "./dataSource";
import GroupDatabase from "@/components/GroupDatabase.vue";
import GroupPBI from "@/components/GroupPBI.vue";
import _ from "lodash";
export default {
  name: "App",
  components: {
    GroupDatabase,
    GroupPBI,
  },
  data() {
    return {
      isResult: false,
      searchQuery: "",
      dataSource: dataSourceFake || [],
      dataRender: [],
      test: "",
      maxSearch: 20,
      isListening: false,
      recognition: null,
    };
  },
  computed: {
    dataRenderByGroup(data) {
      let result = [];
      let group = _.groupBy(data, "groupType");
      for (let key in group) {
        let elem = {
          groupKey: key,
          groupData: group[key],
        };
        result.push(elem);
      }
      return result;
    },
  },
  methods: {
    //thêm sự kiên speech
    toggleListening() {
      if (!this.isListening) {
        this.startListening();
      } else {
        this.stopListening();
      }
    },
    startListening() {
      // Code để bắt đầu nghe giọng nói và xử lý kết quả
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.lang = "vi-VN"; // Ngôn ngữ tiếng Việt
      recognition.start();

      recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;
        this.searchQuery = speechToText; // Gán văn bản nhận được vào ô textbox
        recognition.stop();
        this.isListening = false;
      };

      recognition.onerror = (event) => {
        console.error("Error occurred in recognition: " + event.error);
        recognition.stop();
        this.isListening = false;
      };

      this.isListening = true;
    },
    stopListening() {
      this.isListening = false;
      this.recognition.stop();
    },

    removeVietnameseAccents(str) {
    const diacriticsMap = {
      'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a',
      'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
      'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a',
      'đ': 'd',
      'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ẹ': 'e',
      'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e',
      'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i', 'ị': 'i',
      'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o',
      'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o', 'ộ': 'o',
      'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o',
      'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u', 'ụ': 'u',
      'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u',
      'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y', 'ỵ': 'y'
    };

    return str.replace(/[^A-Za-z0-9]/g, (char) => diacriticsMap[char] || char);
  },
    expanded(data) {
      if (data) {
        data.isShow = !data.isShow;
      }
    },
    buildGroupRender(data) {
      let result = [];
      let group = _.groupBy(data, "groupType");
      for (let key in group) {
        let elem = {
          groupKey: key,
          groupData: group[key],
          isShow: true,
        };
        result.push(elem);
      }
      return result;
    },
    submitSearch() {
      this.isResult = true;
      var data = this.findSimilarArray();
      if (data) {
        this.dataRender = this.buildGroupRender(data);
      }
    },
    calculateSimilarityWithArray(array, words) {
      const wordsLen = words.length;
      let similarCount = 0;
      for (let i = 0; i < wordsLen; i++) {
        let word = this.removeVietnameseAccents(words[i]);
        if (array.includes(word)) {
          similarCount++;
        }
      }

      return similarCount / wordsLen;
    },
    findSimilarArray() {
      // Nhiều mảng nhỏ khác nhau
      const arrays = this.dataSource.map((item) => item.tagSearch);

      // Lấy giá trị nhập vào từ người dùng và tách thành các từ riêng lẻ
      const inputWords = this.getKeywordsFromText(this.searchQuery);

      // Tạo mảng để lưu trữ độ tương đồng của từng mảng con
      const similarities = [];

      // Duyệt qua từng mảng con và tính độ tương đồng với từng từ riêng lẻ trong dữ liệu nhập vào
      for (let i = 0; i < arrays.length; i++) {
        const similarity = this.calculateSimilarityWithArray(
          arrays[i],
          inputWords
        );
        similarities.push(similarity);
      }

      // Tìm chỉ số của mảng có độ tương đồng cao nhất
      let result = [];
      for (let i = 0; i < similarities.length; i++) {
        if (similarities[i]) {
          result.push(this.dataSource[i]);
        }
      }
      // Hiển thị kết quả
      return result;
    },
    getKeywordsFromText(textSearch) {
      const stopWords = new Set([
        'có', 'và', 'là', 'ở', 'trong', 'để', 'với', 'của', 'cho', 'này', 'cũng',
        'này', 'nào', 'đến', 'thì', 'như', 'để', 'khi', 'đã', 'hay', 'từ', 'còn',
        'tôi', 'ảnh', 'hưởng', 'tìm', 'muốn', 'kiếm', 'những'
      ]);
      const words = textSearch.toLowerCase().replace(",","").split(" ");
      const keywords = words.filter(word => !stopWords.has(word));
      return keywords;
    }
  },
};
</script>

<style>
.text-headline-group {
  text-align: left;
  width: fit-content;
}
body,
html {
  width: 100%;
  height: 100%;
  background: #f7efe2;
  font-family: "Source Sans Pro", sans-serif;
}
a {
  color: #333;
}

.card {
  text-align: left;
  border-radius: 0;
  background: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.13), 0 1px 5px 0 rgba(0, 0, 0, 0.08);
  padding: 0 1.6rem;
  margin-bottom: 0.8rem;
}

.card:hover {
  color: #f25c00;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.13), 0 3px 5px 0 rgba(0, 0, 0, 0.08);
}

.ctrl {
  margin-bottom: 1.6rem;
}

h1,
h2 {
  font-family: "Source Sans Pro", sans-serif;
}

.header {
  color: #555;
  height: 100%;
  text-align: center;
  padding-top: 5px;
}

.header .cover-heading {
  font-size: 46px;
  color: #f25c00;
  margin-top: 1.6rem;
  margin-bottom: 1.6rem;
}
.removeInput {
  font-size: 36px;
  color: #f9a603;
  cursor: pointer;
  top: 0;
  right: 0;
  position: absolute;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}
.searchForm {
  margin-bottom: 2.6rem;
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
}
.searchForm .search {
  width: 50%;
}

.text-body-1 {
  font-size: 15px;
  line-height: 20px;
  padding-top: 12px;
  margin-bottom: 1.4rem;
  letter-spacing: 0;
}

.text-headline {
  font-size: 24px;
  line-height: 32px;
  padding-top: 16px;
  margin-bottom: 12px;
  letter-spacing: 0;
}

/* vuejs transition */
.expand-transition {
  transition: all 0.5s ease;
  padding: 10px;
  min-height: 1500px;
  overflow: hidden;
}

.expand-enter,
.expand-leave {
  height: 0;
  padding: 0 10px;
  opacity: 0;
}

/* Material Design code below */
.raised-button {
  display: inline-block;
  text-align: center;
  line-height: 1;
  cursor: pointer;
  -webkit-appearance: none;
  transition: all 0.25s ease-out;
  vertical-align: middle;
  border: 1px solid transparent;
  border-radius: 2px;
  padding: 0.85em 1em;
  margin: 0 1rem 1rem 0;
  font-size: 0.9rem;
  background: #f9a603;
  color: #fafafa;
}
.raised-button:hover,
.raised-button:focus {
  background: #e69903;
  color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.13), 0 1px 5px 0 rgba(0, 0, 0, 0.08);
}

input:focus {
  outline: none;
}

[type="text"],
[type="password"],
[type="date"],
[type="datetime"],
[type="datetime-local"],
[type="month"],
[type="week"],
[type="email"],
[type="number"],
[type="search"],
[type="tel"],
[type="time"],
[type="url"],
[type="color"],
textarea {
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: 2.4375rem;
  padding: 0.5rem;
  border: 0;
  margin: 0 0 1rem;
  font-family: inherit;
  font-size: 1rem;
  color: #9e9e9e;
  background-color: white;
  box-shadow: none;
  border-radius: 0;
  transition: box-shadow 0.5s, border-color 0.25s ease-in-out;
  -webkit-appearance: none;
  -moz-appearance: none;
}
input[type="text"],
input[type="password"],
input[type="date"],
input[type="datetime"],
input[type="datetime-local"],
input[type="month"],
input[type="week"],
input[type="email"],
input[type="number"],
input[type="search"],
input[type="tel"],
input[type="time"],
input[type="url"],
input[type="color"],
textarea {
  padding: 1rem 0 0.5rem 0;
  margin: 1.75rem 0 0.5rem;
  border-bottom: 1px solid #e0e0e0;
  border-radius: 0;
  background: transparent;
}
input[type="text"]::-webkit-input-placeholder,
input[type="text"]::-webkit-input-placeholder,
input[type="password"]::-webkit-input-placeholder,
input[type="password"]::-webkit-input-placeholder,
input[type="date"]::-webkit-input-placeholder,
input[type="date"]::-webkit-input-placeholder,
input[type="datetime"]::-webkit-input-placeholder,
input[type="datetime"]::-webkit-input-placeholder,
input[type="datetime-local"]::-webkit-input-placeholder,
input[type="datetime-local"]::-webkit-input-placeholder,
input[type="month"]::-webkit-input-placeholder,
input[type="month"]::-webkit-input-placeholder,
input[type="week"]::-webkit-input-placeholder,
input[type="week"]::-webkit-input-placeholder,
input[type="email"]::-webkit-input-placeholder,
input[type="email"]::-webkit-input-placeholder,
input[type="number"]::-webkit-input-placeholder,
input[type="number"]::-webkit-input-placeholder,
input[type="search"]::-webkit-input-placeholder,
input[type="search"]::-webkit-input-placeholder,
input[type="tel"]::-webkit-input-placeholder,
input[type="tel"]::-webkit-input-placeholder,
input[type="time"]::-webkit-input-placeholder,
input[type="time"]::-webkit-input-placeholder,
input[type="url"]::-webkit-input-placeholder,
input[type="url"]::-webkit-input-placeholder,
input[type="color"]::-webkit-input-placeholder,
input[type="color"]::-webkit-input-placeholder,
textarea::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  color: rgba(0, 0, 0, 0.26);
}
input[type="text"]:-moz-placeholder,
input[type="text"]::-moz-placeholder,
input[type="password"]:-moz-placeholder,
input[type="password"]::-moz-placeholder,
input[type="date"]:-moz-placeholder,
input[type="date"]::-moz-placeholder,
input[type="datetime"]:-moz-placeholder,
input[type="datetime"]::-moz-placeholder,
input[type="datetime-local"]:-moz-placeholder,
input[type="datetime-local"]::-moz-placeholder,
input[type="month"]:-moz-placeholder,
input[type="month"]::-moz-placeholder,
input[type="week"]:-moz-placeholder,
input[type="week"]::-moz-placeholder,
input[type="email"]:-moz-placeholder,
input[type="email"]::-moz-placeholder,
input[type="number"]:-moz-placeholder,
input[type="number"]::-moz-placeholder,
input[type="search"]:-moz-placeholder,
input[type="search"]::-moz-placeholder,
input[type="tel"]:-moz-placeholder,
input[type="tel"]::-moz-placeholder,
input[type="time"]:-moz-placeholder,
input[type="time"]::-moz-placeholder,
input[type="url"]:-moz-placeholder,
input[type="url"]::-moz-placeholder,
input[type="color"]:-moz-placeholder,
input[type="color"]::-moz-placeholder,
textarea:-moz-placeholder,
textarea::-moz-placeholder {
  color: rgba(0, 0, 0, 0.26);
}
input[type="text"]:focus,
input[type="password"]:focus,
input[type="date"]:focus,
input[type="datetime"]:focus,
input[type="datetime-local"]:focus,
input[type="month"]:focus,
input[type="week"]:focus,
input[type="email"]:focus,
input[type="number"]:focus,
input[type="search"]:focus,
input[type="tel"]:focus,
input[type="time"]:focus,
input[type="url"]:focus,
input[type="color"]:focus,
textarea:focus {
  border: none;
  border-bottom: 2px solid #f9a603;
  box-shadow: none;
  position: relative;
  top: 1px;
  background: transparent;
}
input[type="text"].with-floating-label + label.floating-label,
input[type="password"].with-floating-label + label.floating-label,
input[type="date"].with-floating-label + label.floating-label,
input[type="datetime"].with-floating-label + label.floating-label,
input[type="datetime-local"].with-floating-label + label.floating-label,
input[type="month"].with-floating-label + label.floating-label,
input[type="week"].with-floating-label + label.floating-label,
input[type="email"].with-floating-label + label.floating-label,
input[type="number"].with-floating-label + label.floating-label,
input[type="search"].with-floating-label + label.floating-label,
input[type="tel"].with-floating-label + label.floating-label,
input[type="time"].with-floating-label + label.floating-label,
input[type="url"].with-floating-label + label.floating-label,
input[type="color"].with-floating-label + label.floating-label,
textarea.with-floating-label + label.floating-label {
  font-size: 1rem;
  color: rgba(0, 0, 0, 0.26);
  position: relative;
  top: -35px;
  transition: top 0.45s ease-in-out, color 0.45s ease-in-out,
    font-size 0.45s ease-in-out;
  height: 0;
  cursor: text;
}
input[type="text"].with-floating-label:focus + label.floating-label,
input[type="text"].with-floating-label:valid + label.floating-label,
input[type="password"].with-floating-label:focus + label.floating-label,
input[type="password"].with-floating-label:valid + label.floating-label,
input[type="date"].with-floating-label:focus + label.floating-label,
input[type="date"].with-floating-label:valid + label.floating-label,
input[type="datetime"].with-floating-label:focus + label.floating-label,
input[type="datetime"].with-floating-label:valid + label.floating-label,
input[type="datetime-local"].with-floating-label:focus + label.floating-label,
input[type="datetime-local"].with-floating-label:valid + label.floating-label,
input[type="month"].with-floating-label:focus + label.floating-label,
input[type="month"].with-floating-label:valid + label.floating-label,
input[type="week"].with-floating-label:focus + label.floating-label,
input[type="week"].with-floating-label:valid + label.floating-label,
input[type="email"].with-floating-label:focus + label.floating-label,
input[type="email"].with-floating-label:valid + label.floating-label,
input[type="number"].with-floating-label:focus + label.floating-label,
input[type="number"].with-floating-label:valid + label.floating-label,
input[type="search"].with-floating-label:focus + label.floating-label,
input[type="search"].with-floating-label:valid + label.floating-label,
input[type="tel"].with-floating-label:focus + label.floating-label,
input[type="tel"].with-floating-label:valid + label.floating-label,
input[type="time"].with-floating-label:focus + label.floating-label,
input[type="time"].with-floating-label:valid + label.floating-label,
input[type="url"].with-floating-label:focus + label.floating-label,
input[type="url"].with-floating-label:valid + label.floating-label,
input[type="color"].with-floating-label:focus + label.floating-label,
input[type="color"].with-floating-label:valid + label.floating-label,
textarea.with-floating-label:focus + label.floating-label,
textarea.with-floating-label:valid + label.floating-label {
  color: #00bcd4;
  font-size: 0.75rem;
  top: -56px;
}
.input-container {
  display: flex;
  align-items: center;
  position: relative;
}

.searchForm {
  flex: 1;
}

.voiceButton {
  position: absolute;
  right: 24%;
  top: 18%;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #888;
  padding: 8px;
}

.voiceButton i {
  vertical-align: middle;
}

</style>
