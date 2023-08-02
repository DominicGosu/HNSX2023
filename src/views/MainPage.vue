<template>
  <div class="row column header" id="app">
    <div class="header-group">
    <img src="@/assets/Logo_MISA_JSC_Vie.png" width ="200px">
    <h1 class="cover-heading">
      Tìm kiếm ảnh hưởng
    </h1>
  </div>

    <div class="search-viewer">
      <div class="searchForm">
        <form  @submit.prevent="submitSearch">
          <div class="search-box">
          <span class="text-title-search">Từ khóa:</span>
          <input
            type="text"
            class="search"
            v-model="searchQuery"
            placeholder="Nhập từ khóa tìm kiếm"
            />
            <!-- Thêm sự kiện click vào biểu tượng giọng nói để bắt đầu/ngừng nghe giọng nói -->
          <button class="voiceButton" @click="toggleListening">
            <i class="fa fa-microphone"></i>
          </button>
        </div>
        </form>
        <div class="flex radio-group">
            <label class="radio">
              <input type="radio" id="one" :value="1" v-model="picked" />
                <span>TFS</span>
            </label>
            <label class="radio">
              <input type="radio" id="two" :value="2" v-model="picked" />
                <span>Database</span>
            </label>
        </div>
      </div>
      <button class="raised-button ink" @click="submitSearch"
        ><i class="fa fa-search"></i> Search</button>
    </div>
    <div v-if="dataRender.length > 0">
    <h1  class="title-content-result">Kết quả tìm kiếm</h1>
    <div class="searchResult" transition="expand">
          <component
            :is="'GroupDatabase'"
            :groupData="dataRender"
          ></component>
    </div>
  </div>
  </div>
</template>

<script>
import dataSourceFake from "./dataSource";
import GroupDatabase from "@/components/GroupDatabase.vue";
// import GroupPBI from "@/components/GroupPBI.vue";
import _ from "lodash";

export default {
  name: "App",
  components: {
    GroupDatabase,
    // GroupPBI,
  },
  mounted()
  {
    
  },
  
  data() {
    return {
      isResult: false,
      searchQuery: "",
      dataSource: dataSourceFake || [],
      dataRender: [],
      test: "",
      maxSearch: 20,
      picked:2,
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
    // buildGroupRender(data) {
    //   let result = [];
    //   let group = _.groupBy(data, "groupType");
    //   for (let key in group) {
    //     let elem = {
    //       groupKey: key,
    //       groupData: group[key],
    //       isShow: true,
    //     };
    //     result.push(elem);
    //   }
    //   return result;
    // },
    submitSearch() {
      this.isResult = true;
      var data = this.findSimilarArray();
      if (data) {
        this.dataRender = data;
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

<style lang="scss">
body
{
  background-color: rgb(227,245,247);
}

.header-group{
  display:flex;
}
.cover-heading
{
  flex:1;
  text-align: center;
}
.search-viewer
{
  padding-left:200px;
  display:flex;
  justify-content: center;
  align-items: center;
}
.searchForm
{
  width:50%;
  margin-right:20px;
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
  color: grey;
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
  border-bottom: 2px solid #5D9BFB;
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
$radioSize: 22px;
$radioBorder: #D1D7E3;
$radioActive: #5D9BFB;

.radio {
    margin: 16px 0;
    display: block;
    cursor: pointer;
    input {
        display: none;
        & + span {
            line-height: $radioSize;
            height: $radioSize;
            padding-left: $radioSize;
            display: block;
            position: relative;
            &:not(:empty) {
                padding-left: $radioSize + 8;
            }
            &:before,
            &:after {
                content: '';
                width: $radioSize;
                height: $radioSize;
                display: block;
                border-radius: 50%;
                left: 0;
                top: 0;
                position: absolute;
            }
            &:before {
                background: $radioBorder;
                transition: background .2s ease, transform .4s cubic-bezier(.175, .885, .32, 2);
            }
            &:after {
                background: #fff;
                transform: scale(.78);
                transition: transform .6s cubic-bezier(.175, .885, .32, 1.4);
            }
        }
        &:checked + span {
            &:before {
                transform: scale(1.04);
                background: $radioActive;
            }
            &:after {
                transform: scale(.4);
                transition: transform .3s ease;
            }
        }
    }
    &:hover {
        input {
            & + span {
                &:before {
                    transform: scale(.92);
                }
                &:after {
                    transform: scale(.74);
                }
            }
            &:checked + span {
                &:after {
                    transform: scale(.4);
                }
            }
        }
    }
}
.raised-button{
  width:120px;
  height:50px;
  border-radius: 16px;
  border: 0px;
  background:#5D9BFB;
  color:white;
}
.flex
{
  display:flex;
}
.radio-group
{
  justify-content: center;
}
.search-box
{
  display:flex;
  align-items: end;
  margin-left: 10%;
}
.radio
{
  margin-right:60px;
  cursor: pointer;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.title-content-result
{
  text-align: center;
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
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #888;
}

.voiceButton i {
  vertical-align: middle;
}
.text-title-search
{
  font-size: 18px;
    font-weight: bold;
    white-space: nowrap;
    line-height: 50px;
    margin-right: 16px
}
</style>
